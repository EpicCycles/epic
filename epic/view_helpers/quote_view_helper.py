from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.contrib import messages

import logging

from epic.email_helpers.quote import send_quote_email
from epic.form_helpers.choices import get_part_type_list_from_cache, get_part_section_list_from_cache, \
    get_part_types_for_section_from_cache
from epic.forms import QuoteForm, QuotePartBasicForm, \
    QuoteBikeChangePartForm, QuoteSimpleAddPartForm, QuoteSimpleForm, QuotePartForm, QuoteFittingForm, QuoteBikeForm
from epic.helpers.quote_helper import quote_requote
from epic.model_helpers.part_helper import find_or_create_part, validate_and_create_part
from epic.models import QuotePart, QuotePartAttribute, CustomerNote, INITIAL, Fitting, Quote, \
    Customer, FramePart, FrameExclusion, Frame, Brand
from epic.view_helpers.attribute_view_helper import build_quote_part_attribute_form, save_quote_part_attribute_form
from epic.view_helpers.customer_order_view_helper import create_customer_order_from_quote
from epic.view_helpers.fitting_view_helper import create_fitting
from epic.view_helpers.menu_view_helper import add_standard_session_data
from epic.view_helpers.note_view_helper import create_customer_note

COPIED = "Replace Me"


def show_add_quote(request):
    quote_form = QuoteForm()
    return show_new_quote_form(request, quote_form, None)


def show_add_quote_for_customer(request, customer):
    quote_form = QuoteForm(initial={'customer': customer})
    return show_new_quote_form(request, quote_form, customer)


def copy_quote_and_display(request, pk):
    # get the quote you are basing it on and create a copy_quote
    old_quote = get_object_or_404(Quote, pk=pk)
    new_quote = copy_quote_detail(old_quote, request, old_quote.frame)
    new_quote.quote_desc = COPIED
    new_quote.save()
    messages.success(request, 'Quote created as copy of ' + str(old_quote))

    if new_quote.is_bike():
        # display the bike based quote copy page
        return HttpResponseRedirect(reverse('quote_copy_bike', args=(new_quote.id,)))
    else:
        # display the simple quote edit page
        return HttpResponseRedirect(reverse('quote_edit_simple', args=(new_quote.id,)))


def copy_quote_new_bike(request, quote, frame):
    # get the quote you are basing it on and create a copy_quote
    new_quote = copy_quote_detail(quote, request, frame)
    new_quote.frame_sell_price = frame.sell_price
    new_quote.colour = None
    new_quote.frame_size = None
    new_quote.colour_price = None
    new_quote.keyed_sell_price = None
    new_quote.recalculate_prices()
    new_quote.quote_desc = COPIED
    new_quote.save()
    messages.success(request, 'Quote created as copy of ' + str(quote))

    return HttpResponseRedirect(reverse('quote_edit_bike', args=(new_quote.id,)))


def new_quote_change_customer(request):
    new_customer_id = request.POST.get('new_customer_id', '')
    customer = get_object_or_404(Customer, pk=new_customer_id)
    quote_form = QuoteForm(request.POST)
    messages.success(request, 'Customer changed ')

    return show_new_quote_form(request, quote_form, customer)


def show_new_quote_form(request, quote_form, customer):
    details_for_page = {'quote_form': quote_form, }
    if customer:
        details_for_page['customer'] = customer
        details_for_page['customer_addresses'] = customer.customeraddress_set.all()
        details_for_page['customer_phones'] = customer.customerphone_set.all()

    if request.method == "POST":
        details_for_page['note_contents_epic'] = request.POST.get('note_contents_epic', '')
        details_for_page['note_contents_cust'] = request.POST.get('note_contents_cust', '')
    else:
        details_for_page['note_contents_epic'] = ''
        details_for_page['note_contents_cust'] = ''

    return render(request, "epic/quote_start.html", add_standard_session_data(request, details_for_page))


def create_new_quote(request):
    # new quote to be added
    quote_form = QuoteForm(request.POST)
    if quote_form.is_valid():
        try:
            new_quote = quote_form.save()
            new_quote.created_by = request.user
            new_quote.save()
            messages.success(request, 'Quote started')

            create_customer_note(request, new_quote.customer, new_quote, None)
        except Exception:
            logging.getLogger("error_logger").exception('Quote could not be saved')
            return show_new_quote_form(request, quote_form, quote_form.cleaned_data['customer'])

        return show_quote_edit(new_quote)

    else:
        logging.getLogger("error_logger").error(quote_form.errors.as_json())
        return show_new_quote_form(request, quote_form, quote_form.cleaned_data['customer'])


def show_quote_edit(quote):
    if quote.is_bike():
        # display the bike based quote edit page
        return HttpResponseRedirect(reverse('quote_edit_bike', args=(quote.id,)))
    else:
        # display the simple quote edit page
        return HttpResponseRedirect(reverse('quote_edit_simple', args=(quote.id,)))


def process_bike_quote_changes(request, quote):
    # get back the form from the page to save changes
    quote_page = 'epic/quote_edit_bike.html'

    quote_form = QuoteBikeForm(request.POST, instance=quote)
    quote_simple_add_part = QuoteSimpleAddPartForm(request.POST)
    fitting_form = QuoteFittingForm(request.POST, prefix='fitting')
    details_for_page = {'quote': quote, 'quote_form': quote_form, 'quoteSimpleAddPart': quote_simple_add_part,
                        'fittingForm': fitting_form}

    old_sell_price = quote.sell_price
    create_customer_note(request, quote.customer, quote, None)
    details_for_page['customer_notes'] = CustomerNote.objects.filter(quote=quote)

    # add any new parts
    new_quote_part = None
    if quote_simple_add_part.is_valid():
        part = validate_and_create_part(request, quote_simple_add_part)
        if part is not None:
            quote_line = QuotePart.objects.filter(quote=quote).count() + 1
            new_quote_part = create_quote_part(quote_simple_add_part, quote.pk, part.pk, quote_line)
            messages.info(request, 'Part added to quote ' + str(new_quote_part))

            details_for_page['quoteSimpleAddPart'] = QuoteSimpleAddPartForm(empty_permitted=True)

    if fitting_form.has_changed():
        if fitting_form.is_valid():
            fitting = create_fitting(quote.customer, fitting_form)
            messages.info(request, 'Fitting saved and added to quote ' + str(fitting))

            # update the fitting value on the quote and re-save
            quote.fitting = fitting
            quote.save()
            details_for_page['fittingForm'] = QuoteFittingForm(prefix='fitting')
    else:
        # get the currently selected fitting and add it to the quote.
        id_fitting = request.POST.get('id_fitting', '')
        if id_fitting is not '':
            fitting = Fitting.objects.get(pk=id_fitting)
            # update the fitting value on the quote and re-save
            quote.fitting = fitting
            quote.save()
        elif quote.fitting:
            quote.fitting = None
            quote.save()

    details_for_page['customerFittings'] = Fitting.objects.filter(customer=quote.customer)
    details_for_page['quoteSections'] = update_quote_section_parts_and_forms(request, quote, new_quote_part)

    if quote_form.is_valid():
        quote = quote_form.save()

    quote.recalculate_prices()
    # if sell price has changed blank keyed value and reset quote status
    if quote.keyed_sell_price and old_sell_price != quote.sell_price:
        quote.keyed_sell_price = None
        quote.quote_status = INITIAL
        messages.info(request, 'Quote total reset due to price changes ')
        quote.save()

    # refresh the quote form based on saved values
    if quote_form.is_valid():
        details_for_page['quote_form'] = QuoteBikeForm(instance=quote)

    return render(request, quote_page, add_standard_session_data(request, details_for_page))


def show_bike_quote_edit(request, quote):
    if quote.quote_desc == COPIED:
        quote.quote_desc = None

    quote_simple_add_part = QuoteSimpleAddPartForm(empty_permitted=True)
    quote_page = 'epic/quote_edit_bike.html'
    customer_fittings = Fitting.objects.filter(customer=quote.customer)
    customer_notes = CustomerNote.objects.filter(quote=quote)
    fitting_form = QuoteFittingForm(prefix='fitting')
    return render(request, quote_page,
                  add_standard_session_data(request, {'quote_form': QuoteBikeForm(instance=quote), 'quote': quote,
                                                      'quoteSections': get_quote_section_parts_and_forms(quote),
                                                      'fittingForm': fitting_form,
                                                      'customerFittings': customer_fittings,
                                                      'quoteSimpleAddPart': quote_simple_add_part,
                                                      'customer_notes': customer_notes}))


def show_bike_quote_edit_new_customer(request, quote, new_customer_id):
    customer = get_object_or_404(Customer, pk=new_customer_id)
    old_customer = quote.customer
    # update the quote with the new customer and an appropriate version
    quote.customer = customer
    quote.version = 1
    quote.quote_desc = COPIED
    quote.save()
    messages.success(request, 'Quote customer changed from ' + str(old_customer) + ' to ' + str(customer))

    return show_bike_quote_edit(request, quote)


def show_bike_quote_edit_new_frame(request, quote, new_frame_id):
    frame = get_object_or_404(Frame, pk=new_frame_id)
    old_frame = quote.frame
    # update the quote with the new frame and an appropriate version
    quote.frame = frame
    quote.frame_sell_price = frame.sell_price
    quote.colour = None
    quote.frame_size = None
    quote.colour_price = None
    quote.keyed_sell_price = None
    quote.save()
    messages.success(request, 'Quote frame changed from ' + str(old_frame) + ' to ' + str(
        frame) + ' price, colour and any trade in values removed.')

    # go through quote parts and find equivalents for new frame
    quote_parts = quote.quotepart_set.all()
    quote_part_count = quote_parts.count()
    for partType in get_part_type_list_from_cache():
        new_frame_part = FramePart.objects.filter(frame=frame, part__partType=partType).first()
        if FrameExclusion.objects.filter(frame=frame, partType=partType).exists():
            # delete all quote parts with frame parts for part type
            quote_parts.filter(partType=partType).delete()
            messages.warning(request,
                             "Parts removed as part type " + partType.description + " not valid for this Frameset/Bike")
        else:
            frame_part_used = False
            # get all quote parts for part type
            for quote_part in quote_parts.filter(partType=partType, frame_part__isnull=False):
                if new_frame_part != quote_part.frame_part:
                    if new_frame_part:
                        if quote_part.is_frame_part():
                            quote_part.part = new_frame_part.part
                        else:
                            quote_part.trade_in_price = None
                    else:
                        # if this was a standard part and not isn't remove part
                        if quote_part.is_frame_part():
                            quote_part.part = None

                    quote_part.frame_part = new_frame_part
                    quote_part.save()
                frame_part_used = True

            if new_frame_part and not frame_part_used:
                quote_part = quote_parts.filter(partType=partType, frame_part__isnull=True).first()
                if quote_part:
                    quote_part.frame_part = new_frame_part
                    quote_part.save()
                else:
                    quote_part_count += 1
                    quote_part = QuotePart(quote=quote, line=quote_part_count, partType=partType, quantity=1,
                                           part=new_frame_part.part, frame_part=new_frame_part)
                    quote_part.save()

    quote.quote_desc = None
    return show_bike_quote_edit(request, quote)


def update_simple_quote_parts(request, quote, new_quote_part):
    quote_parts = QuotePart.objects.filter(quote=quote).prefetch_related('part', 'frame_part', 'quotepartattribute_set')
    quote_part_forms = []
    quote_parts_for_screen = []

    # get back all the quote part forms from the page
    for quote_part in quote_parts:
        if quote_part == new_quote_part:
            quote_parts_for_screen.append(build_quote_part_for_screen(quote_part))
            quote_part_forms.append(QuotePartForm(instance=quote_part, prefix="QP" + str(quote_part.id)))
        else:
            # save form
            quote_part_form = QuotePartForm(request.POST, request.FILES, instance=quote_part,
                                            prefix="QP" + str(quote_part.id))
            if quote_part_form.is_valid():
                quote_part = quote_part_form.save()
                if quote_part.quantity == 0:
                    messages.info(request, 'Part removed from quote' + str(quote_part))
                    quote_part.delete()
                    quote_part = None

            if quote_part:
                # save any attributes keyed
                quote_part_details = [quote_part]
                quote_part_attribute_forms = []
                quote_part_attributes = quote_part.getAttributes()

                for quote_part_attribute in quote_part_attributes:
                    quote_part_attribute_forms.append(
                        save_quote_part_attribute_form(request, quote_part_attribute, quote_part))
                quote_part_details.append(quote_part_attribute_forms)

                quote_parts_for_screen.append(quote_part_details)
                quote_part_forms.append(quote_part_form)

    zipped_values = zip(quote_parts_for_screen, quote_part_forms)
    return zipped_values


def process_simple_quote_changes(request, quote):
    quote_page = 'epic/quote_edit_simple.html'
    # get back the form from the page to save changes
    quote_form = QuoteSimpleForm(request.POST, instance=quote)
    quote_simple_add_part = QuoteSimpleAddPartForm(request.POST)
    details_for_page = {'quote': quote, 'quote_form': quote_form, 'quoteSimpleAddPart': quote_simple_add_part}
    old_sell_price = quote.sell_price

    # save any notes keyed.
    create_customer_note(request, quote.customer, quote, None)
    details_for_page['customer_notes'] = CustomerNote.objects.filter(quote=quote)

    # save any new parts added
    new_quote_part = None
    if quote_simple_add_part.is_valid():
        part = validate_and_create_part(request, quote_simple_add_part)
        if part is not None:
            quote_line = QuotePart.objects.filter(quote=quote).count() + 1
            new_quote_part = create_quote_part(quote_simple_add_part, quote.pk, part.pk, quote_line)
            messages.info(request, 'Part added to quote ' + str(new_quote_part))
            details_for_page['quoteSimpleAddPart'] = QuoteSimpleAddPartForm(empty_permitted=True)

    # get quote parts as they existed before update
    details_for_page['zipped_values'] = update_simple_quote_parts(request, quote, new_quote_part)

    if quote_form.is_valid():
        quote = quote_form.save()

    quote.recalculate_prices()
    # if sell price has changed blank keyed value
    if quote.keyed_sell_price and old_sell_price != quote.sell_price:
        quote.keyed_sell_price = None
        quote.quote_status = INITIAL
        quote.save()
        messages.info(request, 'Quote total reset due to changes to prices')

    # refresh the quote form based on saved values
    if quote_form.is_valid():
        details_for_page['quote_form'] = QuoteSimpleForm(instance=quote)

    return render(request, quote_page, add_standard_session_data(request, details_for_page))


def show_simple_quote_edit(request, quote):
    quote_page = 'epic/quote_edit_simple.html'
    quote_simple_add_part = QuoteSimpleAddPartForm(empty_permitted=True)
    customer_notes = CustomerNote.objects.filter(quote=quote)
    return render(request, quote_page,
                  add_standard_session_data(request, {'quote_form': QuoteSimpleForm(instance=quote), 'quote': quote,
                                                      'quoteSimpleAddPart': quote_simple_add_part,
                                                      'zipped_values': get_quote_parts_and_forms(quote),
                                                      'customer_notes': customer_notes}))


# requote based on original quote
def process_quote_requote(request, quote):
    quote_requote(request, quote)
    if quote.quote_status == INITIAL:
        return show_quote_edit(quote)
    else:
        messages.error(request, 'Quote cannot be edited' + str(quote))
        return HttpResponseRedirect(reverse('quotes'))


def show_quote_browse(request, quote):
    customer_notes = CustomerNote.objects.filter(quote=quote, customer_visible=True)

    if quote.is_bike():
        return render(request, 'epic/quote_issued_bike.html',
                      add_standard_session_data(request,
                                                {'quote': quote,
                                                 'quoteSections': quote_parts_for_bike_display(quote, False),
                                                 'customer_notes': customer_notes}))
    else:
        return render(request, 'epic/quote_issued_simple.html',
                      add_standard_session_data(request,
                                                {'quote': quote, 'quoteDetails': quote_parts_for_simple_display(quote),
                                                 'customer_notes': customer_notes}))  # amend a quote  save will reset to INITIAL if required


# show the quote ready to issue
def show_quote_issue(request, quote):
    if quote.can_be_issued:
        return show_quote_browse(request, quote)
    elif quote.quote_status == INITIAL:
        messages.error(request, 'Quote needs prices before it can be issued')
        return show_quote_edit(quote)
    else:
        messages.error(request, 'Quote cannot be Issued or edited' + str(quote))
        return show_quote_browse(request, quote)


def process_quote_action(request, quote):
    action_required = request.POST.get('action_required', '')

    if action_required == "Issue":
        return process_quote_issue(request, quote)
    elif action_required == "Re-Issue":
        return process_quote_issue(request, quote)
    elif action_required == "Order":
        quote.issue()
        deposit_taken = request.POST.get('deposit_taken', '')
        if quote.customerOrder:
            messages.error(request, "Quote already on order " + str(quote.customerOrder))
            return show_quote_browse(request, quote)

        return create_customer_order_from_quote(request, quote, deposit_taken)

    # shouldn't be here!
    messages.info(request, 'Invalid action ')
    return show_quote_browse(request, quote)


def process_quote_issue(request, quote):
    if quote.quote_status == INITIAL:
        quote.issue()
        if quote.customer.email:
            send_quote_email(request, quote)
        else:
            messages.success(request, 'Quote set to issued, no email for customer')
    else:
        if quote.customer.email:
            send_quote_email(request, quote)
        else:
            messages.success(request, 'Quote email not sent, no email for customer')

    return HttpResponseRedirect(reverse('quote_browse', args=(quote.id,)))


def show_quote_text(request, quote):
    customer_notes = CustomerNote.objects.filter(quote=quote, customer_visible=True)
    if quote.is_bike():
        return render(request, 'epic/quote_text.html',
                      add_standard_session_data(request,
                                                {'quote': quote,
                                                 'quoteSections': quote_parts_for_bike_display(quote, True),
                                                 'customer_notes': customer_notes, 'summary_view': True}))
    else:
        return render(request, 'epic/quote_text.html',
                      add_standard_session_data(request,
                                                {'quote': quote, 'quoteDetails': quote_parts_for_simple_display(quote),
                                                 'customer_notes': customer_notes, 'summary_view': True}))


# simple display of sections
def quote_parts_for_simple_display(quote):
    quote_part_objects = QuotePart.objects.filter(quote=quote)
    quote_part_details = []
    for quote_part in quote_part_objects:
        quote_part_details.append(QuotePartAttribute.objects.filter(quotePart=quote_part))
    # build a merged array
    zipped_values = zip(quote_part_objects, quote_part_details)
    return zipped_values


# create a new quote based on an existing quote
def copy_quote_detail(old_quote, request, frame):
    # get the quote you are basing it on and create a copy_quote
    quote_same_name = Quote.objects.filter(customer=old_quote.customer, quote_desc=old_quote.quote_desc).count()
    # copy quote details
    new_quote = Quote.objects.get(pk=old_quote.pk)
    new_quote.pk = None
    new_quote.version = quote_same_name + 1
    new_quote.quote_status = INITIAL
    new_quote.created_by = request.user
    new_quote.frame = frame
    if frame != old_quote.frame:
        new_quote.keyed_sell_price = None
    # save creates all the parts required for a bike
    new_quote.save()

    # get parts from old quote and copy across to new_quote
    old_quote_parts = QuotePart.objects.filter(quote=old_quote).prefetch_related('part', 'quotepartattribute_set',
                                                                                 'frame_part')

    if new_quote.is_bike():
        # replicate the changes from the first quote
        for old_quote_part in old_quote_parts:
            if old_quote_part.is_not_standard_part:
                try:
                    new_quote_part = QuotePart.objects.get(quote=new_quote, partType=old_quote_part.partType)
                    # already have a part of this type update it to reflect this one
                    new_quote_part.part = old_quote_part.part
                    new_quote_part.quantity = old_quote_part.quantity
                    new_quote_part.sell_price = old_quote_part.sell_price
                    new_quote_part.save()
                    old_quote_part_attributes = old_quote_part.get_attributes()
                    for attribute in old_quote_part_attributes:
                        try:
                            new_quote_part_attribute = QuotePartAttribute.objects.get(quotePart=new_quote_part,
                                                                                      partTypeAttribute=attribute.partTypeAttribute)
                            new_quote_part_attribute.attribute_value = attribute.attribute_value
                            new_quote_part_attribute.save()
                        except ObjectDoesNotExist:
                            pass

                except MultipleObjectsReturned:
                    messages.warning(request, 'Could not copy details for part: ' + str(old_quote_part.partType))

                except ObjectDoesNotExist:
                    if not old_quote_part.frame_part:
                        line_count = QuotePart.objects.filter(quote=new_quote).count() + 1
                        new_quote_part = old_quote_part
                        new_quote_part.quote = new_quote
                        new_quote_part.pk = None
                        new_quote_part.line = line_count
                        new_quote_part.save()

    else:
        # replicate items on first quote
        for old_quote_part in old_quote_parts:
            new_quote_part = old_quote_part
            new_quote_part.pk = None
            new_quote_part.quote = new_quote
            new_quote_part.save()

    new_quote.keyed_sell_price = None
    return new_quote


# simple display of sections
def quote_parts_for_bike_display(quote, for_customer):
    part_sections = get_part_section_list_from_cache()
    part_section_details = []
    part_section_counts = []

    for part_section in part_sections:
        quote_parts = []
        quote_part_details = []
        part_types = get_part_types_for_section_from_cache(part_section)

        for part_type in part_types:
            quote_part_objects = QuotePart.objects.filter(quote=quote, partType=part_type) \
                .prefetch_related('part',
                                  'part__brand',
                                  'quotepartattribute_set',
                                  'frame_part',
                                  'frame_part__part__brand')
            for quote_part in quote_part_objects:
                include_part = True
                if for_customer and not part_type.customer_facing:
                    include_part = False
                    if quote_part.is_not_standard_part:
                        include_part = True

                if include_part:
                    quote_parts.append(quote_part)
                    if quote_part.part:
                        quote_part_details.append(quote_part.get_attributes())
                    else:
                        quote_part_details.append([])

        part_section_detail = zip(quote_parts, quote_part_details)
        part_section_details.append(part_section_detail)
        part_section_counts.append(len(quote_parts))
    # build a merged array
    zipped_values = zip(part_sections, part_section_details, part_section_counts)
    return zipped_values


def update_quote_section_parts_and_forms(request, quote, new_quote_part):
    part_sections = get_part_section_list_from_cache()
    part_contents = []
    part_section_visibility = []

    for part_section in part_sections:
        part_types = get_part_types_for_section_from_cache(part_section)
        section_visible_tag = f'sectionVisible{part_section.id}'
        part_section_visible = request.POST[section_visible_tag]
        part_section_visibility.append(part_section_visible)
        section_part_types = []
        section_frame_parts = []
        section_frame_attributes = []
        section_forms = []
        for part_type in part_types:
            quote_part_objects = QuotePart.objects.filter(quote=quote, partType=part_type) \
                .prefetch_related('part',
                                  'part__brand',
                                  'frame_part',
                                  'frame_part__part__brand',
                                  'quotepartattribute_set',
                                  'quotepartattribute_set__partTypeAttribute')
            for quote_part in quote_part_objects:
                section_part_types.append(str(part_type))
                if quote_part.frame_part:
                    section_frame_parts.append(f"{quote_part.frame_part.part.brand} {quote_part.frame_part.part.part_name}")
                else:
                    section_frame_parts.append("")

                quote_part_attribute_forms = []

                if quote_part == new_quote_part:
                    quote_bike_change_part_form = build_quote_part_form_for_bike_quote(quote_part, part_type)
                else:
                    initial__q_p = {'can_be_substituted': part_type.can_be_substituted,
                                    'can_be_omitted': part_type.can_be_omitted}
                    # make sure flags are correct
                    if quote_part.part is None:
                        if quote_part.frame_part is None:
                            # No part and no equivalent part
                            initial__q_p['can_be_substituted'] = True
                            initial__q_p['can_be_omitted'] = False
                    else:
                        # part is specified
                        if quote_part.frame_part is None:
                            initial__q_p['can_be_substituted'] = True

                    quote_bike_change_part_form = QuoteBikeChangePartForm(request.POST, request.FILES,
                                                                          initial=initial__q_p,
                                                                          prefix="QP" + str(quote_part.id))
                    if quote_bike_change_part_form.is_valid():
                        update_quote_part_from_form(quote_part, quote_bike_change_part_form, part_type)
                        quote_bike_change_part_form = build_quote_part_form_for_bike_quote(quote_part, part_type)

                quote_part_attributes = quote_part.get_attributes()
                for quote_part_attribute in quote_part_attributes:
                    if quote_part != new_quote_part:
                        quote_part_attribute_forms.append(
                            save_quote_part_attribute_form(request, quote_part_attribute, quote_part))
                    else:
                        # this is a new line add the attribute forms required
                        quote_part_attribute_forms.append(build_quote_part_attribute_form(quote_part_attribute, True))

                section_frame_attributes.append(quote_part_attribute_forms)
                section_forms.append(quote_bike_change_part_form)

        zipped_parts = zip(section_part_types, section_frame_parts, section_frame_attributes, section_forms)
        part_contents.append(zipped_parts)
    return zip(part_sections, part_contents, part_section_visibility)


# build arrays for bike quote
def get_quote_section_parts_and_forms(quote: Quote):
    part_sections = get_part_section_list_from_cache()
    part_contents = []
    part_section_visibility = []

    for part_section in part_sections:
        part_types = get_part_types_for_section_from_cache(part_section)
        part_section_visible = '0'
        section_part_types = []
        section_frame_parts = []
        section_frame_attributes = []
        section_forms = []
        for part_type in part_types:
            quote_part_objects = QuotePart.objects.filter(quote=quote, partType=part_type) \
                .prefetch_related('part',
                                  'part__brand',
                                  'frame_part',
                                  'frame_part__part__brand',
                                  'quotepartattribute_set',
                                  'quotepartattribute_set__partTypeAttribute')

            for quote_part in quote_part_objects:
                section_part_types.append(str(part_type))
                if quote_part.frame_part:
                    section_frame_parts.append(f"{quote_part.frame_part.part.brand} {quote_part.frame_part.part.part_name}")
                else:
                    section_frame_parts.append("")

                if quote_part.is_not_standard_part:
                    part_section_visible = '1'

                quote_part_attributes = quote_part.get_attributes()
                quote_part_attribute_forms = []
                for quote_part_attribute in quote_part_attributes:
                    quote_part_attribute_forms.append(build_quote_part_attribute_form(quote_part_attribute, True))

                section_frame_attributes.append(quote_part_attribute_forms)

                section_forms.append(build_quote_part_form_for_bike_quote(quote_part, part_type))

        zipped_parts = zip(section_part_types, section_frame_parts, section_frame_attributes, section_forms)
        part_contents.append(zipped_parts)
        part_section_visibility.append(part_section_visible)
    return zip(part_sections, part_contents, part_section_visibility)


def build_quote_part_form_for_bike_quote(quote_part, part_type):
    initial__q_p = {'can_be_substituted': part_type.can_be_substituted, 'can_be_omitted': part_type.can_be_omitted}
    initial__q_p['new_part_type'] = part_type.pk
    if quote_part.part is None:
        if quote_part.frame_part is not None:
            # Bike part exists take defaults
            initial__q_p['not_required'] = True
            initial__q_p['trade_in_price'] = quote_part.trade_in_price
        else:
            # No part and no equivalent part
            initial__q_p['can_be_substituted'] = True
            initial__q_p['can_be_omitted'] = False
    else:
        # part is specified
        if quote_part.frame_part is None:
            initial__q_p['can_be_substituted'] = True

        elif quote_part.frame_part and quote_part.frame_part.part != quote_part.part:
            # replaces an original frame related part
            initial__q_p['trade_in_price'] = quote_part.trade_in_price
            initial__q_p['new_brand'] = quote_part.part.brand.id
            initial__q_p['new_part_name'] = quote_part.part.part_name
            initial__q_p['new_quantity'] = quote_part.quantity
            initial__q_p['new_sell_price'] = quote_part.sell_price
    return QuoteBikeChangePartForm(initial=initial__q_p, prefix="QP" + str(quote_part.id))


def build_quote_part_for_screen(quote_part):
    quote_part_details = [quote_part]
    quote_part_attributes = quote_part.get_attributes()
    quote_part_attribute_forms = []
    for quote_part_attribute in quote_part_attributes:
        quote_part_attribute_forms.append(build_quote_part_attribute_form(quote_part_attribute, True))
    quote_part_details.append(quote_part_attribute_forms)
    return quote_part_details


# build array of quote parts for use on simple quote screen
def get_quote_parts_and_forms(quote):
    quote_parts_for_screen = []
    quote_part_forms = []
    quote_part_objects = QuotePart.objects.filter(quote=quote) \
        .prefetch_related('part',
                          'part__brand',
                          'quotepartattribute_set',
                          'frame_part',
                          'frame_part__part__brand')
    for quote_part in quote_part_objects:
        # now put the combined details into the array
        quote_parts_for_screen.append(build_quote_part_for_screen(quote_part))
        quote_part_forms.append(QuotePartForm(instance=quote_part, prefix="QP" + str(quote_part.id)))

    # build a merged array
    zipped_values = zip(quote_parts_for_screen, quote_part_forms)
    return zipped_values


# create quote part
def create_quote_part(form, quote_pk, part_pk, quote_line):
    # now add the quote line
    data_dict = {"quote": quote_pk, "line": quote_line, "partType": form.cleaned_data['new_part_type'].pk,
                 "part": part_pk, "quantity": form.cleaned_data['new_quantity'],
                 "sell_price": form.cleaned_data['new_sell_price']}
    form = QuotePartBasicForm(data_dict)
    if form.is_valid():
        return form.save()
    else:
        return None


# update an existing quote part based on keyed values
def update_quote_part_from_form(quote_part, form, part_type):
    not_required = form.cleaned_data['not_required']
    trade_in_price = form.cleaned_data['trade_in_price']
    if not_required:
        if (quote_part.frame_part is None) and (
                QuotePart.objects.filter(quote=quote_part.quote, partType=part_type).count() > 1):
            quote_part.delete()
        else:
            quote_part.part = None
            quote_part.quantity = 0
            quote_part.sell_price = None
            quote_part.trade_in_price = trade_in_price
            quote_part.save()
    else:
        brand = None
        if form.cleaned_data['new_brand']:
            brand = Brand.objects.get(id=form.cleaned_data['new_brand'])
        quantity = form.cleaned_data['new_quantity']
        if quantity and quantity > 0:
            # values have changed
            part_type = part_type
            part_name = form.cleaned_data['new_part_name']
            part = find_or_create_part(brand, part_type, part_name)
            if part is not None:
                quote_part.part = part
                quote_part.quantity = quantity
                quote_part.sell_price = form.cleaned_data['new_sell_price']
                quote_part.trade_in_price = trade_in_price
                quote_part.save()

        else:
            # values have been removed reset row
            quote_part.trade_in_price = None
            if quote_part.frame_part:
                quote_part.part = quote_part.frame_part.part
                quote_part.quantity = 1
                quote_part.sell_price = None
                quote_part.save()
            else:
                if QuotePart.objects.filter(quote=quote_part.quote, partType=part_type).count() > 1:
                    quote_part.delete()
                else:
                    quote_part.part = None
                    quote_part.quantity = 0
                    quote_part.sell_price = None
                    quote_part.save()



def save_quote_part_attributes(quote, request):
    quote_part_objects = QuotePart.objects.filter(quote=quote)
    for quote_part in quote_part_objects:
        # get the attributes as they were at the start
        quote_part_attributes = quote_part.get_attributes()
        # refresh any quote parts
        for quote_part_attribute in quote_part_attributes:
            save_quote_part_attribute_form(request, quote_part_attribute, quote_part)
