import logging

from django.contrib import messages
from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.urls import reverse

from epic.forms import QuoteForm, QuotePartForm, QuoteFittingForm
from epic.helpers.quote_helper import quote_requote, copy_quote_with_changes
from epic.model_helpers.frame_helper import get_frames_for_js, frame_display
from epic.model_helpers.part_helper import find_or_create_part
from epic.model_helpers.quote_helper import quote_display
from epic.models import QuotePart, CustomerNote, INITIAL, Fitting, Quote, Customer, Frame, Brand
from epic.view_helpers.attribute_view_helper import build_quote_part_attribute_form, save_quote_part_attribute_form
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


def copy_quote_and_display(request, pk, frame_id, customer_id):
    # get the quote you are basing it on and create a copy_quote
    old_quote = get_object_or_404(Quote, pk=pk)
    new_frame = None
    new_customer = None
    if frame_id:
        new_frame = get_object_or_404(Frame, id=frame_id)
    if customer_id:
        new_customer = get_object_or_404(Customer, id=customer_id)

    new_quote = copy_quote_with_changes(old_quote, request, new_frame, new_customer)
    new_quote.quote_desc = COPIED
    new_quote.save()
    message_text = 'Quote created as copy of ' + str(old_quote)
    customer_note = CustomerNote(customer=new_quote.customer, quote=new_quote, note_text=message_text,
                                 created_by=request.user, customer_visible=False)
    customer_note.save()
    messages.success(request, message_text)
    return HttpResponseRedirect(reverse('quote_edit', args=(new_quote.id,)))


def show_new_quote_form(request, quote_form, customer):
    details_for_page = {'quote_form': quote_form, 'frames_for_js': get_frames_for_js()}
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

    return render(request, "epic/quotes/quote.html", add_standard_session_data(request, details_for_page))


def create_new_quote(request):
    # new quote to be added
    quote_form = QuoteForm(request.POST)
    if quote_form.is_valid():
        try:
            new_quote = quote_form.save()
            new_quote.created_by = request.user
            new_quote.save()
            messages.success(request, 'Quote started')

            create_customer_note(request, new_quote.customer, new_quote)
        except Exception:
            logging.getLogger("error_logger").exception('Quote could not be saved')
            return show_new_quote_form(request, quote_form, quote_form.cleaned_data['customer'])
        messages.info(request, 'Quote Created ' + str(new_quote))

        return HttpResponseRedirect(reverse('quote_edit', args=(new_quote.id,)))


    else:
        logging.getLogger("error_logger").error(quote_form.errors.as_json())
        if 'customer' in quote_form.cleaned_data:
            return show_new_quote_form(request, quote_form, quote_form.cleaned_data['customer'])
        else:
            return show_new_quote_form(request, quote_form, None)


def show_quote_edit(request, quote):
    if quote.quote_desc == COPIED:
        quote.quote_desc = None

    details_for_page = {'quote': quote, 'customer': quote.customer, 'quote_form': QuoteForm(instance=quote),
                        'customer_notes': CustomerNote.objects.filter(quote=quote),
                        'quote_parts': build_quote_parts(quote)}
    if quote.is_bike():
        # add the bike specific parts
        details_for_page['customer_fittings'] = Fitting.objects.filter(customer=quote.customer)
        details_for_page['fittingForm'] = QuoteFittingForm(prefix='fitting')
        details_for_page['bike_summary'] = frame_display(quote.frame)

    return render(request, "epic/quotes/quote.html", add_standard_session_data(request, details_for_page))


def build_quote_parts(quote):
    is_bike = quote.is_bike()
    quote_part_forms = []
    quote_part_attribute_sets = []

    quote_parts = QuotePart.objects.filter(quote=quote) \
        .prefetch_related('part',
                          'part__brand',
                          'part__partType',
                          'quotepartattribute_set',
                          'quotepartattribute_set__partTypeAttribute')
    for quote_part in quote_parts:
        quote_part_forms.append(build_quote_part_form(quote_part, is_bike))
        quote_part_attribute_forms = []
        for quote_part_attribute in quote_part.get_attributes():
            quote_part_attribute_forms.append(build_quote_part_attribute_form(quote_part_attribute, True))
        quote_part_attribute_sets.append(quote_part_attribute_forms)

    return zip(quote_part_forms, quote_part_attribute_sets)


def build_quote_part_form(quote_part, is_bike):
    initial__q_p = {'part_type': quote_part.partType, 'quantity': quote_part.quantity,
                    'sell_price': quote_part.sell_price, 'is_bike': is_bike}
    if quote_part.part:
        initial__q_p['brand'] = quote_part.part.brand.id
        initial__q_p['part_name'] = quote_part.part.part_name

    if is_bike:
        initial__q_p['replacement_part'] = quote_part.replacement_part
        initial__q_p['trade_in_price'] = quote_part.trade_in_price

    return QuotePartForm(initial=initial__q_p, prefix="QP" + str(quote_part.id), )


def process_quote_changes(request, quote):
    # get back the form from the page to save changes
    quote_page = 'epic/quotes/quote.html'
    is_bike = quote.is_bike()
    old_sell_price = quote.sell_price
    old_keyed_price = quote.keyed_sell_price

    quote_form = QuoteForm(request.POST, instance=quote)
    details_for_page = {'quote': quote, 'quote_form': quote_form}
    if is_bike:
        fitting_form = QuoteFittingForm(request.POST, prefix='fitting')
        details_for_page['fittingForm'] = fitting_form
        details_for_page['bike_summary'] = frame_display(quote.frame)
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

    create_customer_note(request, quote.customer, quote)
    details_for_page['customer_notes'] = CustomerNote.objects.filter(quote=quote)
    details_for_page['quote_parts'] = update_quote_parts_and_forms(request, quote)

    if quote_form.is_valid():
        quote = quote_form.save()

    quote.recalculate_prices()
    # if sell price has changed blank keyed value and reset quote status
    if old_sell_price != quote.sell_price:
        if quote.keyed_sell_price and quote.keyed_sell_price == old_keyed_price:
            quote.keyed_sell_price = None
            quote.quote_status = INITIAL
            messages.info(request, 'Quote total reset due to price changes ')
        quote.save()

    # refresh the quote form based on saved values
    if quote_form.is_valid():
        details_for_page['quote_form'] = QuoteForm(instance=quote)

    return render(request, quote_page, add_standard_session_data(request, details_for_page))


# requote based on original quote
def process_quote_requote(request, quote):
    quote_requote(request, quote)
    if quote.quote_status == INITIAL:
        return HttpResponseRedirect(reverse('quote_edit', args=(quote.id,)))
    else:
        messages.error(request, 'Quote cannot be edited' + str(quote))
        return HttpResponseRedirect(reverse('quotes'))


def show_quote_browse(request, quote):
    return render(request, 'epic/quotes/quote_issued.html',
                  add_standard_session_data(request,
                                            {'quote': quote, 'quote_details': quote_display(quote, False),
                                             'customer_notes': CustomerNote.objects.filter(quote=quote,
                                                                                           customer_visible=True)}))


# show the quote ready to issue
def show_quote_issue(request, quote: Quote):
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

    # shouldn't be here!
    messages.info(request, 'Invalid action ')
    return show_quote_browse(request, quote)


def process_quote_issue(request, quote):
    if quote.quote_status == INITIAL:
        quote.issue()
        messages.success(request, 'Quote set to issued')
    else:
        messages.success(request, 'Quote already issued.')

    return HttpResponseRedirect(reverse('quote_browse', args=(quote.id,)))


def show_quote_text(request, quote):
    customer_notes = CustomerNote.objects.filter(quote=quote, customer_visible=True)
    details_for_page = {'quote': quote, 'customer_notes': customer_notes, 'quote_details': quote_display(quote, True)}
    return render(request, 'epic/quotes/quote_text.html', details_for_page)


def update_quote_parts_and_forms(request, quote):
    quote_part_forms = []
    quote_part_attribute_sets = []
    is_bike = quote.is_bike()

    quote_part_objects = QuotePart.objects.filter(quote=quote) \
        .prefetch_related('part',
                          'part__brand',
                          'part__partType',
                          'quotepartattribute_set',
                          'quotepartattribute_set__partTypeAttribute')

    for quote_part in quote_part_objects:
        quote_part_attribute_forms = []
        process_attributes = True
        part_saved = False
        initial__q_p = {'is_bike': is_bike, 'part_type': quote_part.partType}

        quote_part_form = QuotePartForm(request.POST, request.FILES, prefix="QP" + str(quote_part.id),
                                        initial=initial__q_p)
        if quote_part_form.is_valid():
            quote_part_updated = update_quote_part_from_form(quote_part, quote_part_form)
            if quote_part_updated:
                quote_part_form = build_quote_part_form(quote_part_updated, is_bike)
                part_saved = True
                quote_part_forms.append(quote_part_form)
            else:
                # part has been deleted do not process attributes
                process_attributes = False
        else:
            quote_part_forms.append(quote_part_form)

        if process_attributes:
            quote_part_attributes = quote_part.get_attributes()
            for quote_part_attribute in quote_part_attributes:
                quote_part_attribute_forms.append(
                    save_quote_part_attribute_form(request, quote_part_attribute, quote_part))

            if part_saved:
                quote_part.is_incomplete = quote_part_updated.check_incomplete()
                quote_part.save()

            quote_part_attribute_sets.append(quote_part_attribute_forms)

    return zip(quote_part_forms, quote_part_attribute_sets)


def update_quote_part_from_form(quote_part: QuotePart, quote_part_form: QuotePartForm):
    save_me = False
    if quote_part_form.cleaned_data['brand']:
        brand = Brand.objects.get(id=quote_part_form.cleaned_data['brand'])
        part = find_or_create_part(brand, quote_part_form.cleaned_data['part_type'],
                                   quote_part_form.cleaned_data['part_name'])
        quote_part.part = part
        quote_part.quantity = quote_part_form.cleaned_data['quantity']
        quote_part.sell_price = quote_part_form.cleaned_data['sell_price']

        save_me = True
    else:
        quote_part.part = None
        quote_part.quantity = None
        quote_part.sell_price = None

    if quote_part_form.cleaned_data['trade_in_price'] is not None:
        quote_part.replacement_part = True
        quote_part.trade_in_price = quote_part_form.cleaned_data['trade_in_price']
        save_me = True

    if save_me:
        return quote_part
    else:
        quote_part.get_attributes().delete()
        quote_part.delete()
        return None


def save_quote_part_attributes(quote, request):
    quote_part_objects = QuotePart.objects.filter(quote=quote)
    for quote_part in quote_part_objects:
        # get the attributes as they were at the start
        quote_part_attributes = quote_part.get_attributes()
        # refresh any quote parts
        for quote_part_attribute in quote_part_attributes:
            save_quote_part_attribute_form(request, quote_part_attribute, quote_part)
