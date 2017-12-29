import json
from datetime import date, datetime

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
    Customer, FramePart, FITTING_TYPE_CHOICES
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

    return HttpResponseRedirect(reverse('quote_edit_bike', args=(new_quote.id,)))


def new_quote_change_customer(request):
    new_customer_id = request.POST.get('new_customer_id', '')
    customer = get_object_or_404(Customer, pk=new_customer_id)
    quoteForm = QuoteForm(request.POST, initial={'customer': customer})

    return show_new_quote_form(request, quoteForm, customer)


def show_new_quote_form(request, quoteForm, customer):
    details_for_page = {'quoteForm': quoteForm, }
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
    quoteForm = QuoteForm(request.POST)
    if quoteForm.is_valid():
        try:
            newQuote = quoteForm.save()
            newQuote.created_by = request.user
            newQuote.save()
            create_customer_note(request, newQuote.customer, newQuote, None)
        except Exception as e:
            logging.getLogger("error_logger").exception('Quote could not be saved')
            return show_new_quote_form(request, quoteForm, quoteForm.customer)

        return show_quote_edit(request, newQuote)

    else:
        logging.getLogger("error_logger").error(quoteForm.errors.as_json())
        return show_new_quote_form(request, quoteForm, quoteForm.customer)


def show_quote_edit(request, quote):
    if quote.is_bike():
        # display the bike based quote edit page
        return HttpResponseRedirect(reverse('quote_edit_bike', args=(quote.id,)))
    else:
        # display the simple quote edit page
        return HttpResponseRedirect(reverse('quote_edit_simple', args=(quote.id,)))


def process_bike_quote_changes(request, quote):
    # get back the form from the page to save changes
    quote_page = 'epic/quote_edit_bike.html'

    quoteForm = QuoteBikeForm(request.POST, instance=quote)
    quoteSimpleAddPart = QuoteSimpleAddPartForm(request.POST)
    fittingForm = QuoteFittingForm(request.POST, prefix='fitting')
    details_for_page = {'quote': quote, 'quoteForm': quoteForm, 'quoteSimpleAddPart': quoteSimpleAddPart,
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
            details_for_page['quoteSimpleAddPart'] = QuoteSimpleAddPartForm(empty_permitted=True)

    if fittingForm.has_changed():
        if fittingForm.is_valid():
            fitting = create_fitting(quote.customer, fittingForm)

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

    if quoteForm.is_valid():
        quote = quoteForm.save()

    quote.recalculate_prices()
    # if sell price has changed blank keyed value and reset quote status
    if old_sell_price != quote.sell_price:
        quote.keyed_sell_price = None
        quote.quote_status = INITIAL
        quote.save()

    return render(request, quote_page, details_for_page)


def show_bike_quote_edit(request, quote):
    if quote.quote_desc == COPIED:
        quote.quote_desc = None

    quoteSimpleAddPart = QuoteSimpleAddPartForm(empty_permitted=True)
    quote_page = 'epic/quote_edit_bike.html'
    customerFittings = Fitting.objects.filter(customer=quote.customer)
    customer_notes = CustomerNote.objects.filter(quote=quote)
    fittingForm = QuoteFittingForm(prefix='fitting')
    return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote), 'quote': quote,
                                        'quoteSections': get_quote_section_parts_and_forms(quote),
                                        'fittingForm': fittingForm, 'customerFittings': customerFittings,
                                        'quoteSimpleAddPart': quoteSimpleAddPart, 'customer_notes': customer_notes})


def show_bike_quote_edit_new_customer(request, quote, new_customer_id):
    customer = get_object_or_404(Customer, pk=new_customer_id)
    # update the quote with the new customer and an appropriate version
    quote.customer = customer
    quote.version = 1
    quote.save()
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
    quoteSimpleAddPart = QuoteSimpleAddPartForm(request.POST)
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
                                                    'quoteSimpleAddPart': quoteSimpleAddPart,
                                                    'zipped_values': zipped_values, 'customer_notes': customer_notes})

        if quoteSimpleAddPart.is_valid():
            part = validate_and_create_part(request, quoteSimpleAddPart)
            if part is not None:
                quote_line = len(quote_parts) + 1
                create_quote_part(quoteSimpleAddPart, quote.pk, part.pk, quote_line)
        else:
            # quoteSimpleAddPart not valid
            return render(request, quote_page, {'quote_form': QuoteSimpleForm(instance=quote), 'quote': quote,
                                                'quoteSimpleAddPart': quoteSimpleAddPart,
                                                'zipped_values': zipped_values, 'customer_notes': customer_notes})

        # save all ok get new simple part and refresh items

        for quote_part in quote_parts:
            # delete any quote parts no longer required.
            if quote_part.quantity == 0:
                quote_part.delete()

        # get attributes updated for quote
        save_quote_part_attributes(quote, request)

        quote.recalculate_prices()
        # if sell price has changed blank keyed value
        if old_sell_price != quote.sell_price:
            quote.keyed_sell_price = None
            quote.quote_status = INITIAL
            quote.save()
        quoteSimpleAddPart = QuoteSimpleAddPartForm(empty_permitted=True)
        return render(request, quote_page, {'quote_form': QuoteSimpleForm(instance=quote), 'quote': quote,
                                            'quoteSimpleAddPart': quoteSimpleAddPart,
                                            'zipped_values': get_quote_parts_and_forms(quote),
                                            'customer_notes': customer_notes})

    # quote form not valid
    else:
        logging.getLogger("error_logger").error(quote_form.errors.as_json())
        return render(request, quote_page, {'quote_form': QuoteSimpleForm(instance=quote), 'quote': quote,
                                            'quoteSimpleAddPart': quoteSimpleAddPart, 'zipped_values': zipped_values,
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
        return show_quote_edit(request, quote)
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
        return show_quote_edit(request, quote)
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
                    if quotePart.notStandard():
                        include_part = True

                if include_part:
                    if quote.is_bike():
                        items.append({'name': quotePart.summaryBikePart(), 'qty': str(quotePart.quantity)})
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
        mail = apostle.Mail("quote-details", {"name": str(quote.customer), "email": "anna.weaverhr6@gmail.com",
                                              "from_address": "appdev.epiccycles@gmail.com"})
        mail.quote = quote_detail
        queue = apostle.Queue()
        queue.add(mail)
        queue.deliver()
        messages.info(request, 'Quote has been issued')

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
    old_quoteParts = QuotePart.objects.filter(quote=old_quote)

    if new_quote.is_bike():
        # replicate the changes from the first quote
        for old_quotePart in old_quoteParts:
            if old_quotePart.notStandard():
                try:
                    new_quotePart = QuotePart.objects.get(quote=new_quote, partType=old_quotePart.partType)
                    # already have a part of this type update it to reflect this one
                    new_quotePart.part = old_quotePart.part
                    new_quotePart.quantity = old_quotePart.quantity
                    new_quotePart.sell_price = old_quotePart.sell_price
                    new_quotePart.save()
                    old_quote_part_attributes = QuotePartAttribute.objects.filter(quotePart=old_quotePart)
                    for attribute in old_quote_part_attributes:
                        try:
                            new_quote_part_attribute = QuotePartAttribute.objects.get(quotePart=new_quotePart,
                                                                                      partTypeAttribute=attribute.partTypeAttribute)
                            new_quote_part_attribute.attribute_value = attribute.attribute_value
                            new_quote_part_attribute.save()
                        except ObjectDoesNotExist:
                            pass

                except MultipleObjectsReturned:
                    messages.info(request, 'Could not copy details for part: ' + old_quotePart.partType)
                except ObjectDoesNotExist:
                    if not old_quotePart.frame_part:
                        line_count = QuotePart.objects.filter(quote=new_quote).count() + 1
                        new_quotePart = old_quotePart
                        new_quotePart.quote = new_quote
                        new_quotePart.pk = None
                        new_quotePart.line = line_count
                        new_quotePart.save()


    else:
        # replicate items on first quote
        for old_quotePart in old_quoteParts:
            new_quotePart = old_quotePart
            new_quotePart.pk = None
            new_quotePart.quote = new_quote
            new_quotePart.save()

    new_quote.keyed_sell_price = None
    return new_quote


# simple display of sections
def quote_parts_for_bike_display(quote, for_customer):
    partSections = PartSection.objects.all()
    partSectionDetails = []

    for partSection in partSections:
        quoteParts = []
        quotePartDetails = []
        partTypes = PartType.objects.filter(includeInSection=partSection)

        for partType in partTypes:
            quotePartObjects = QuotePart.objects.filter(quote=quote, partType=partType)
            for quotePart in quotePartObjects:
                include_part = True
                if for_customer and not partType.customer_facing:
                    include_part = False
                    if quotePart.notStandard():
                        include_part = True

                if include_part:
                    quoteParts.append(quotePart)
                    quotePartDetails.append(QuotePartAttribute.objects.filter(quotePart=quotePart))
        partSectionDetails.append(zip(quoteParts, quotePartDetails))
    # build a merged array
    zipped_values = zip(partSections, partSectionDetails)
    return zipped_values


def update_quote_section_parts_and_forms(request, quote, new_quote_part):
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
                quotePartAttributeForms = []

                initial_QP = {'can_be_substituted': partType.can_be_substituted,
                              'can_be_omitted': partType.can_be_omitted}

                if (quotePart == new_quote_part):
                    initial_QP = {'new_brand': quotePart.part.brand,
                                  'new_part_name': quotePart.part.part_name, 'new_quantity': quotePart.quantity,
                                  'new_sell_price': quotePart.sell_price}
                    initial_QP['can_be_substituted'] = True
                    initial_QP['can_be_omitted'] = False
                    quoteBikeChangePartForm = QuoteBikeChangePartForm(initial=initial_QP,
                                                                      prefix="QP" + str(quotePart.id))
                else:
                    # make sure flags are correct
                    if quotePart.part is None:
                        if quotePart.frame_part is None:
                            # No part and no equivalent part
                            initial_QP['can_be_substituted'] = True
                            initial_QP['can_be_omitted'] = False
                    else:
                        # part is specified
                        if quotePart.frame_part is None:
                            initial_QP['can_be_substituted'] = True

                    quoteBikeChangePartForm = QuoteBikeChangePartForm(request.POST, request.FILES, initial=initial_QP,
                                                                      prefix="QP" + str(quotePart.id))
                    if quoteBikeChangePartForm.is_valid():
                        update_quote_part_from_form(quotePart, quoteBikeChangePartForm, request)

                quotePartAttributes = QuotePartAttribute.objects.filter(quotePart=quotePart)
                for quotePartAttribute in quotePartAttributes:
                    if quotePart == new_quote_part:
                        quotePartAttributeForms.append(QuotePartAttributeForm(
                            initial={'attribute_name': str(quotePartAttribute.partTypeAttribute),
                                     'attribute_value': quotePartAttribute.attribute_value},
                            prefix="QPA" + str(quotePartAttribute.id)))
                    else:
                        quotePartAttributeForm = QuotePartAttributeForm(request.POST, request.FILES,
                                                                        prefix="QPA" + str(quotePartAttribute.id))
                        save_quote_part_attribute_form(quotePartAttribute, quotePartAttributeForm)
                        quotePartAttributeForms.append(quotePartAttributeForm)

                quotePartDetails.append(quotePartAttributeForms)
                sectionParts.append(quotePartDetails)
                sectionForms.append(quoteBikeChangePartForm)

        zipped_parts = zip(sectionParts, sectionForms)
        partContents.append(zipped_parts)
    return zip(partSections, partContents)


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
                        initial_QP['new_brand'] = quotePart.part.brand.brand_name
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
def update_quote_part_from_form(quote_part, form, request):
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
            partType = quote_part.partType
            part_name = form.cleaned_data['new_part_name']
            part = find_or_create_part(brand, partType, part_name)
            if part is not None:
                quote_part.part = part
                quote_part.quantity = quantity
                quote_part.sell_price = form.cleaned_data['new_sell_price']
                quote_part.trade_in_price = trade_in_price
                quote_part.save()


def save_quote_part_attributes(quote, request):
    quotePartObjects = QuotePart.objects.filter(quote=quote)
    for quotePart in quotePartObjects:
        # get the attributes as they were at the start
        quotePartAttributes = QuotePartAttribute.objects.filter(quotePart=quotePart)
        # refresh any quote parts
        for quotePartAttribute in quotePartAttributes:
            quotePartAttributeForm = QuotePartAttributeForm(request.POST, request.FILES,
                                                            prefix="QPA" + str(quotePartAttribute.id))
            save_quote_part_attribute_form(quotePartAttribute, quotePartAttributeForm)


def save_quote_part_attribute_form(quotePartAttribute, quotePartAttributeForm):
    if quotePartAttributeForm.is_valid():
        if quotePartAttributeForm.has_changed():
            quotePartAttribute.attribute_value = quotePartAttributeForm.cleaned_data['attribute_value']
            quotePartAttribute.save()
    else:
        logging.getLogger("error_logger").error(quotePartAttributeForm.errors.as_json())
