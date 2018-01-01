import apostle
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.contrib import messages

import logging

from epic.forms import QuoteForm, QuotePartAttributeForm, QuotePartBasicForm, QuoteBikePartForm, \
    QuoteBikeChangePartForm, QuoteSimpleAddPartForm, QuoteSimpleForm, QuotePartForm, QuoteFittingForm, QuoteBikeForm
from epic.model_helpers.part_helper import find_or_create_part, validate_and_create_part
from epic.models import QuotePart, QuotePartAttribute, PartType, PartSection, CustomerNote, INITIAL, Fitting, Quote, \
    Customer, FramePart, FITTING_TYPE_CHOICES, FrameExclusion, Frame
from epic.view_helpers.fitting_view_helper import create_fitting
from epic.view_helpers.note_view_helper import create_customer_note

COPIED = "Replace Me"


def show_add_quote(request):
    quoteForm = QuoteForm()
    return show_new_quote_form(request, quoteForm, None)


def show_add_quote_for_customer(request, customer):
    quoteForm = QuoteForm(initial={'customer': customer})
    return show_new_quote_form(request, quoteForm, customer)


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
    new_quote.recalculate_prices()
    new_quote.keyed_sell_price = None
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

    return render(request, "epic/quote_start.html", details_for_page)


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
        print(quote_form.cleaned_data)
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
    quoteSimpleAddPart = QuoteSimpleAddPartForm(request.POST)
    fittingForm = QuoteFittingForm(request.POST, prefix='fitting')
    details_for_page = {'quote': quote, 'quote_form': quote_form, 'quoteSimpleAddPart': quoteSimpleAddPart,
                        'fittingForm': fittingForm}

    old_sell_price = quote.sell_price
    create_customer_note(request, quote.customer, quote, None)
    details_for_page['customer_notes'] = CustomerNote.objects.filter(quote=quote)

    # add any new parts
    new_quote_part = None
    if quoteSimpleAddPart.is_valid():
        part = validate_and_create_part(request, quoteSimpleAddPart)
        if part is not None:
            quote_line = QuotePart.objects.filter(quote=quote).count() + 1
            new_quote_part = create_quote_part(quoteSimpleAddPart, quote.pk, part.pk, quote_line)
            messages.info(request, 'Part added to quote ' + str(new_quote_part))

            details_for_page['quoteSimpleAddPart'] = QuoteSimpleAddPartForm(empty_permitted=True)

    if fittingForm.has_changed():
        if fittingForm.is_valid():
            fitting = create_fitting(quote.customer, fittingForm)
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

    # get attributes updated for quote
    save_quote_part_attributes(quote, request)

    if quote_form.is_valid():
        quote = quote_form.save()

    quote.recalculate_prices()
    # if sell price has changed blank keyed value and reset quote status
    if old_sell_price != quote.sell_price:
        quote.keyed_sell_price = None
        quote.quote_status = INITIAL
        messages.info(request, 'Quote total reset due to price changes ')
        quote.save()

    # refresh the quote form based on saved values
    if quote_form.is_valid():
        details_for_page['quote_form'] = QuoteBikeForm(instance=quote)

    return render(request, quote_page, details_for_page)


def show_bike_quote_edit(request, quote):
    if quote.quote_desc == COPIED:
        quote.quote_desc = None

    quoteSimpleAddPart = QuoteSimpleAddPartForm(empty_permitted=True)
    quote_page = 'epic/quote_edit_bike.html'
    customerFittings = Fitting.objects.filter(customer=quote.customer)
    customer_notes = CustomerNote.objects.filter(quote=quote)
    fittingForm = QuoteFittingForm(prefix='fitting')
    return render(request, quote_page, {'quote_form': QuoteBikeForm(instance=quote), 'quote': quote,
                                        'quoteSections': get_quote_section_parts_and_forms(quote),
                                        'fittingForm': fittingForm, 'customerFittings': customerFittings,
                                        'quoteSimpleAddPart': quoteSimpleAddPart, 'customer_notes': customer_notes})


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
    quote.colour_price = None
    quote.keyed_sell_price = None
    quote.save()
    messages.success(request, 'Quote frame changed from ' + str(old_frame) + ' to ' + str(
        frame) + ' price, colour and any trade in values removed.')

    # go through quote parts and find equivalents for new frame
    quote_parts = quote.quotepart_set.all()
    quote_part_count = quote_parts.count()
    for partType in PartType.objects.all():
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
                    quotePart = QuotePart(quote=quote, line=quote_part_count, partType=partType, quantity=1,
                                          part=new_frame_part.part, frame_part=new_frame_part)
                    quotePart.save()

    quote.quote_desc = None
    return show_bike_quote_edit(request, quote)


def process_simple_quote_changes(request, quote):
    quote.recalculate_prices()
    old_sell_price = 0 + quote.sell_price
    quote_page = 'epic/quote_edit_simple.html'
    # get back the form from the page to save changes
    quote_form = QuoteSimpleForm(request.POST, instance=quote)

    # get quote parts as they existed before update
    quote_parts = QuotePart.objects.filter(quote=quote)
    quote_part_forms = []

    # get back all the quote part forms from the page
    for quote_part in quote_parts:
        quote_part_form = QuotePartForm(request.POST, request.FILES, instance=quote_part,
                                        prefix="QP" + str(quote_part.id))
        quote_part_forms.append(quote_part_form)

    zipped_values = zip(quote_parts, quote_part_forms)
    quote_simple_add_part = QuoteSimpleAddPartForm(request.POST)
    if quote_form.is_valid():
        quote = quote_form.save()
        create_customer_note(request, quote.customer, quote, None)
        customer_notes = CustomerNote.objects.filter(quote=quote)

        for quote_part_form in quote_part_forms:
            if quote_part_form.is_valid():
                quote_part_form.save()
            else:
                # quote part formset not valid
                messages.error(request, 'Part failed validation')
                logging.getLogger("error_logger").error(quote_part_form.errors.as_json())
                return render(request, quote_page, {'quote_form': QuoteSimpleForm(instance=quote), 'quote': quote,
                                                    'quote_simple_add_part': quote_simple_add_part,
                                                    'zipped_values': zipped_values, 'customer_notes': customer_notes})

        if quote_simple_add_part.is_valid():
            part = validate_and_create_part(request, quote_simple_add_part)
            if part is not None:
                quote_line = len(quote_parts) + 1
                create_quote_part(quote_simple_add_part, quote.pk, part.pk, quote_line)
                messages.info(request, 'Part added to quote' + str(part))

        else:
            # quote_simple_add_part not valid
            return render(request, quote_page, {'quote_form': QuoteSimpleForm(instance=quote), 'quote': quote,
                                                'quote_simple_add_part': quote_simple_add_part,
                                                'zipped_values': zipped_values, 'customer_notes': customer_notes})

        # save all ok get new simple part and refresh items

        for quote_part in quote_parts:
            # delete any quote parts no longer required.
            if quote_part.quantity == 0:
                messages.info(request, 'Part removed from quote' + str(quote_part))
                quote_part.delete()

        # get attributes updated for quote
        save_quote_part_attributes(quote, request)

        quote.recalculate_prices()
        # if sell price has changed blank keyed value
        if old_sell_price != quote.sell_price:
            quote.keyed_sell_price = None
            quote.quote_status = INITIAL
            quote.save()
            messages.info(request, 'Quote total removed due to changes to prices')

        quote_simple_add_part = QuoteSimpleAddPartForm(empty_permitted=True)
        return render(request, quote_page, {'quote_form': QuoteSimpleForm(instance=quote), 'quote': quote,
                                            'quote_simple_add_part': quote_simple_add_part,
                                            'zipped_values': get_quote_parts_and_forms(quote),
                                            'customer_notes': customer_notes})

    # quote form not valid
    else:
        logging.getLogger("error_logger").error(quote_form.errors.as_json())
        return render(request, quote_page, {'quote_form': QuoteSimpleForm(instance=quote), 'quote': quote,
                                            'quote_simple_add_part': quote_simple_add_part, 'zipped_values': zipped_values,
                                            'customer_notes': CustomerNote.objects.filter(quote=quote)})


def show_simple_quote_edit(request, quote):
    quote_page = 'epic/quote_edit_simple.html'
    quoteSimpleAddPart = QuoteSimpleAddPartForm(empty_permitted=True)
    customer_notes = CustomerNote.objects.filter(quote=quote)
    return render(request, quote_page, {'quote_form': QuoteSimpleForm(instance=quote), 'quote': quote,
                                        'quoteSimpleAddPart': quoteSimpleAddPart,
                                        'zipped_values': get_quote_parts_and_forms(quote),
                                        'customer_notes': customer_notes})


# requote based on original quote
def process_quote_requote(request, quote):
    quote.requote()
    if quote.quote_status == INITIAL:
        return show_quote_edit(quote)
    else:
        messages.error(request, 'Quote cannot be edited' + str(quote))
        return HttpResponseRedirect(reverse('quotes'))


def show_quote_browse(request, quote):
    customer_notes = CustomerNote.objects.filter(quote=quote, customer_visible=True)

    if quote.is_bike():
        return render(request, 'epic/quote_issued_bike.html',
                      {'quote': quote, 'quoteSections': quote_parts_for_bike_display(quote, False),
                       'customer_notes': customer_notes})
    else:
        return render(request, 'epic/quote_issued_simple.html',
                      {'quote': quote, 'quoteDetails': quote_parts_for_simple_display(quote),
                       'customer_notes': customer_notes})  # amend a quote  save will reset to INITIAL if required


# show the quote ready to issue
def show_quote_issue(request, quote):
    if quote.can_be_issued():
        return show_quote_browse(request, quote)
    elif quote.quote_status == INITIAL:
        messages.error(request, 'Quote needs prices before it can be issued')
        return show_quote_edit(quote)
    else:
        messages.error(request, 'Quote cannot be Issued or edited' + str(quote))
        return show_quote_browse(request, quote)


# post from browse quote page to issue quote
def build_quote_detail_for_email(quote):
    # todo additional details formatting
    quote_for_email = {}
    if quote.is_bike():
        quote_for_email['bike'] = str(quote.frame)
        if quote.fitting:
            quote_for_email['fitting'] = {'source': dict(FITTING_TYPE_CHOICES).get(quote.fitting.fitting_type),
                                          'saddle_height': quote.fitting.saddle_height,
                                          'bar_height': quote.fitting.bar_height, 'reach': quote.fitting.reach}

    partSections = PartSection.objects.all()
    items = []
    for partSection in partSections:
        partTypes = PartType.objects.filter(includeInSection=partSection)

        for partType in partTypes:
            quotePartObjects = QuotePart.objects.filter(quote=quote, partType=partType)
            for quotePart in quotePartObjects:
                include_part = True
                if not partType.customer_facing:
                    include_part = False
                    if quotePart.is_not_standard_part():
                        include_part = True

                if include_part:
                    if quote.is_bike():
                        items.append({'name': quotePart.get_bike_part_summary(), 'qty': str(quotePart.quantity)})
                    else:
                        items.append({'name': quotePart.summary(), 'qty': str(quotePart.quantity)})
    quote_for_email['id'] = str(quote)
    quote_for_email['cost'] = str(quote.keyed_sell_price)
    quote_for_email['date'] = f"{quote.issued_date:%b %d, %Y}"
    quote_for_email['items'] = items
    return quote_for_email


def process_quote_issue(request, quote):
    if quote.quote_status == INITIAL:
        quote.issue()
        quote_detail = build_quote_detail_for_email(quote)
        apostle.domain_key = "130b06ec68e5d0805ffd8d57db463f0d99f85627"
        quote_email = "anna.weaverhr6@gmail.com"
        mail = apostle.Mail("quote-details", {"name": str(quote.customer), "email": quote_email,
                                              "from_address": "appdev.epiccycles@gmail.com"})
        mail.quote = quote_detail
        queue = apostle.Queue()
        queue.add(mail)
        queue.deliver()
        messages.success(request, 'Quote email sent to ' + quote_email)

    return HttpResponseRedirect(reverse('quote_browse', args=(quote.id,)))


def show_quote_text(request, quote):
    customer_notes = CustomerNote.objects.filter(quote=quote, customer_visible=True)
    if quote.is_bike():
        return render(request, 'epic/quote_text.html',
                      {'quote': quote, 'quoteSections': quote_parts_for_bike_display(quote, True),
                       'customer_notes': customer_notes, 'summary_view': True})
    else:
        return render(request, 'epic/quote_text.html',
                      {'quote': quote, 'quoteDetails': quote_parts_for_simple_display(quote),
                       'customer_notes': customer_notes, 'summary_view': True})


# simple display of sections
def quote_parts_for_simple_display(quote):
    quotePartObjects = QuotePart.objects.filter(quote=quote)
    quotePartDetails = []
    for quotePart in quotePartObjects:
        quotePartDetails.append(QuotePartAttribute.objects.filter(quotePart=quotePart))
    # build a merged array
    zipped_values = zip(quotePartObjects, quotePartDetails)
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
    old_quote_parts = QuotePart.objects.filter(quote=old_quote)

    if new_quote.is_bike():
        # replicate the changes from the first quote
        for old_quote_part in old_quote_parts:
            if old_quote_part.is_not_standard_part():
                try:
                    new_quote_part = QuotePart.objects.get(quote=new_quote, partType=old_quote_part.partType)
                    # already have a part of this type update it to reflect this one
                    new_quote_part.part = old_quote_part.part
                    new_quote_part.quantity = old_quote_part.quantity
                    new_quote_part.sell_price = old_quote_part.sell_price
                    new_quote_part.save()
                    old_quote_part_attributes = QuotePartAttribute.objects.filter(quotePart=old_quote_part)
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
    part_sections = PartSection.objects.all()
    part_section_details = []

    for part_section in part_sections:
        quote_parts = []
        quote_part_details = []
        part_types = PartType.objects.filter(includeInSection=part_section)

        for part_type in part_types:
            quote_part_objects = QuotePart.objects.filter(quote=quote, partType=part_type)
            for quote_part in quote_part_objects:
                include_part = True
                if for_customer and not part_type.customer_facing:
                    include_part = False
                    if quote_part.is_not_standard_part():
                        include_part = True

                if include_part:
                    quote_parts.append(quote_part)
                    quote_part_details.append(QuotePartAttribute.objects.filter(quotePart=quote_part))
        part_section_details.append(zip(quote_parts, quote_part_details))
    # build a merged array
    zipped_values = zip(part_sections, part_section_details)
    return zipped_values


def update_quote_section_parts_and_forms(request, quote, new_quote_part):
    part_sections = PartSection.objects.all()
    part_contents = []
    for part_section in part_sections:
        part_types = PartType.objects.filter(includeInSection=part_section)
        section_parts = []
        section_forms = []
        for part_type in part_types:
            quote_part_objects = QuotePart.objects.filter(quote=quote, partType=part_type)
            for quote_part in quote_part_objects:
                quote_part_details = [quote_part]
                quote_part_attribute_forms = []

                initial_QP = {'can_be_substituted': part_type.can_be_substituted,
                              'can_be_omitted': part_type.can_be_omitted}

                if quote_part == new_quote_part:
                    initial_QP = {'new_brand': quote_part.part.brand, 'new_part_name': quote_part.part.part_name,
                                  'new_quantity': quote_part.quantity, 'new_sell_price': quote_part.sell_price,
                                  'can_be_substituted': True, 'can_be_omitted': False}
                    quote_bike_change_part_form = QuoteBikeChangePartForm(initial=initial_QP,
                                                                          prefix="QP" + str(quote_part.id))
                else:
                    # make sure flags are correct
                    if quote_part.part is None:
                        if quote_part.frame_part is None:
                            # No part and no equivalent part
                            initial_QP['can_be_substituted'] = True
                            initial_QP['can_be_omitted'] = False
                    else:
                        # part is specified
                        if quote_part.frame_part is None:
                            initial_QP['can_be_substituted'] = True

                    quote_bike_change_part_form = QuoteBikeChangePartForm(request.POST, request.FILES,
                                                                          initial=initial_QP,
                                                                          prefix="QP" + str(quote_part.id))
                    if quote_bike_change_part_form.is_valid():
                        update_quote_part_from_form(quote_part, quote_bike_change_part_form)

                quotePartAttributes = QuotePartAttribute.objects.filter(quotePart=quote_part)
                for quotePartAttribute in quotePartAttributes:
                    if quote_part != new_quote_part:
                        quotePartAttributeForm = QuotePartAttributeForm(request.POST, request.FILES,
                                                                        prefix="QPA" + str(quotePartAttribute.id))
                        save_quote_part_attribute_form(quotePartAttribute, quotePartAttributeForm)
                        quote_part_attribute_forms.append(quotePartAttributeForm)
                    quote_part_attribute_forms.append(QuotePartAttributeForm(
                        initial={'attribute_name': str(quotePartAttribute.partTypeAttribute),
                                 'attribute_value': quotePartAttribute.attribute_value},
                        prefix="QPA" + str(quotePartAttribute.id)))

                quote_part_details.append(quote_part_attribute_forms)
                section_parts.append(quote_part_details)
                section_forms.append(quote_bike_change_part_form)

        zipped_parts = zip(section_parts, section_forms)
        part_contents.append(zipped_parts)
    return zip(part_sections, part_contents)


# build arrays for bike quote
def get_quote_section_parts_and_forms(quote):
    partSections = PartSection.objects.all()
    partContents = []
    for partSection in partSections:
        partTypes = PartType.objects.filter(includeInSection=partSection)
        sectionParts = []
        sectionForms = []
        for partType in partTypes:
            quotePartObjects = QuotePart.objects.filter(quote=quote, partType=partType)

            for quotePart in quotePartObjects:
                quotePartDetails = [quotePart]
                quotePartAttributes = QuotePartAttribute.objects.filter(quotePart=quotePart)
                quotePartAttributeForms = []
                for quotePartAttribute in quotePartAttributes:
                    quotePartAttributeForms.append(QuotePartAttributeForm(
                        initial={'attribute_name': str(quotePartAttribute.partTypeAttribute),
                                 'attribute_value': quotePartAttribute.attribute_value},
                        prefix="QPA" + str(quotePartAttribute.id)))

                quotePartDetails.append(quotePartAttributeForms)
                sectionParts.append(quotePartDetails)
                initial_QP = {'can_be_substituted': partType.can_be_substituted,
                              'can_be_omitted': partType.can_be_omitted}
                if quotePart.part is None:
                    if quotePart.frame_part is not None:
                        # Bike part exists take defaults
                        initial_QP['not_required'] = True
                        initial_QP['trade_in_price'] = quotePart.trade_in_price
                    else:
                        # No part and no equivalent part
                        initial_QP['can_be_substituted'] = True
                        initial_QP['can_be_omitted'] = False
                else:
                    # part is specified
                    if quotePart.frame_part is None:
                        initial_QP['new_brand'] = quotePart.part.brand
                        initial_QP['new_part_name'] = quotePart.part.part_name
                        initial_QP['new_quantity'] = quotePart.quantity
                        initial_QP['new_sell_price'] = quotePart.sell_price
                        initial_QP['can_be_substituted'] = True
                    elif quotePart.frame_part.part != quotePart.part:
                        # replaces an original frame related part
                        initial_QP['new_brand'] = quotePart.part.brand
                        initial_QP['new_part_name'] = quotePart.part.part_name
                        initial_QP['new_quantity'] = quotePart.quantity
                        initial_QP['new_sell_price'] = quotePart.sell_price
                        initial_QP['trade_in_price'] = quotePart.trade_in_price
                sectionForms.append(QuoteBikeChangePartForm(initial=initial_QP, prefix="QP" + str(quotePart.id)))

        zipped_parts = zip(sectionParts, sectionForms)
        partContents.append(zipped_parts)
    return zip(partSections, partContents)


# build array of quote parts for use on simple quote screen
def get_quote_parts_and_forms(quote):
    quoteParts = []
    quotePartForms = []
    quotePartObjects = QuotePart.objects.filter(quote=quote)
    for quotePart in quotePartObjects:
        quotePartDetails = [quotePart]
        quotePartAttributes = QuotePartAttribute.objects.filter(quotePart=quotePart)
        quotePartAttributeForms = []
        for quotePartAttribute in quotePartAttributes:
            quotePartAttributeForms.append(QuotePartAttributeForm(
                initial={'attribute_name': str(quotePartAttribute.partTypeAttribute),
                         'attribute_value': quotePartAttribute.attribute_value},
                prefix="QPA" + str(quotePartAttribute.id)))
        quotePartDetails.append(quotePartAttributeForms)
        # now put the combined details into the array
        quoteParts.append(quotePartDetails)
        quotePartForms.append(QuoteBikePartForm(instance=quotePart, prefix="QP" + str(quotePart.id)))

    # build a merged array
    zipped_values = zip(quoteParts, quotePartForms)
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
def update_quote_part_from_form(quote_part, form):
    not_required = form.cleaned_data['not_required']
    trade_in_price = form.cleaned_data['trade_in_price']
    if not_required:
        if (quote_part.frame_part is None) and (
                QuotePart.objects.filter(quote=quote_part.quote, partType=quote_part.partType).count() > 1):
            quote_part.delete()
        else:
            quote_part.part = None
            quote_part.quantity = 0
            quote_part.sell_price = None
            quote_part.trade_in_price = trade_in_price
            quote_part.save()
    else:
        brand = form.cleaned_data['new_brand']
        quantity = form.cleaned_data['new_quantity']

        if brand is None or (quantity == 0):
            # values have been removed reset row
            quote_part.trade_in_price = None
            if quote_part.frame_part is None:
                if QuotePart.objects.filter(quote=quote_part.quote, partType=quote_part.partType).count() > 1:
                    quote_part.delete()
                else:
                    quote_part.part = None
                    quote_part.quantity = 0
                    quote_part.sell_price = None
                    quote_part.save()
            else:
                quote_part.part = quote_part.frame_part.part
                quote_part.quantity = 1
                quote_part.sell_price = None
                quote_part.save()
        else:
            # values have changed
            part_type = quote_part.partType
            part_name = form.cleaned_data['new_part_name']
            part = find_or_create_part(brand, part_type, part_name)
            if part is not None:
                quote_part.part = part
                quote_part.quantity = quantity
                quote_part.sell_price = form.cleaned_data['new_sell_price']
                quote_part.trade_in_price = trade_in_price
                quote_part.save()


def save_quote_part_attributes(quote, request):
    quote_part_objects = QuotePart.objects.filter(quote=quote)
    for quote_part in quote_part_objects:
        # get the attributes as they were at the start
        quote_part_attributes = QuotePartAttribute.objects.filter(quotePart=quote_part)
        # refresh any quote parts
        for quote_part_attribute in quote_part_attributes:
            quote_part_attribute_form = QuotePartAttributeForm(request.POST, request.FILES,
                                                               prefix="QPA" + str(quote_part_attribute.id))
            save_quote_part_attribute_form(quote_part_attribute, quote_part_attribute_form)


def save_quote_part_attribute_form(quote_part_attribute, quote_part_attribute_form):
    if quote_part_attribute_form.is_valid():
        if quote_part_attribute_form.has_changed():
            quote_part_attribute.attribute_value = quote_part_attribute_form.cleaned_data['attribute_value']
            quote_part_attribute.save()
    else:
        logging.getLogger("error_logger").error(quote_part_attribute_form.errors.as_json())
