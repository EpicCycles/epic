from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.forms import forms
from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.contrib import messages

import logging

from epic.forms import QuoteForm, QuotePartAttributeForm, QuotePartBasicForm, QuoteBikePartForm, \
    QuoteBikeChangePartForm, QuoteSimpleAddPartForm, QuoteSimpleForm, QuotePartForm, QuoteFittingForm, QuoteBikeForm
from epic.model_helpers.brand_helper import find_brand_for_name
from epic.model_helpers.part_helper import find_or_create_part, validate_and_create_part
from epic.models import QuotePart, QuotePartAttribute, PartType, PartSection, CustomerNote, INITIAL, Fitting, Quote
from epic.view_helpers.fitting_view_helper import create_fitting
from epic.view_helpers.note_view_helper import create_customer_note


def show_add_quote(request):
    quoteForm = QuoteForm()
    return render(request, 'epic/quote_start.html', {'quoteForm': quoteForm})


def copy_quote_and_display(request, pk):
    # get the quote you are basing it on and create a copy_quote
    old_quote = get_object_or_404(Quote, pk=pk)
    quote_same_name = Quote.objects.filter(customer=old_quote.customer, quote_desc=old_quote.quote_desc).count()
    # copy quote details
    new_quote = old_quote
    new_quote.pk = None
    new_quote.version = quote_same_name + 1
    new_quote.quote_status = INITIAL
    new_quote.created_by = request.user
    new_quote.save()

    # update old quote to archived
    # old_quote.quote_status = ARCHIVED
    # old_quote.save()

    # get parts from old quote and copy across to new_quote
    old_quoteParts = QuotePart.objects.filter(quote=old_quote)

    if new_quote.is_bike():
        line_count = 1
        # replicate the changes from the first quote
        for old_quotePart in old_quoteParts:
            try:
                new_quotePart = QuotePart.objects.get(quote=new_quote, partType=old_quotePart.partType)
                # already have a part of this type update it to reflect this one
                new_quotePart.part = old_quotePart.part
                new_quotePart.quantity = old_quotePart.quantity
                new_quotePart.cost_price = old_quotePart.cost_price
                new_quotePart.sell_price = old_quotePart.sell_price
                new_quotePart.save()
            except MultipleObjectsReturned:
                messages.info(request, 'Could not copy details for part: ' + old_quotePart.partType)
            except ObjectDoesNotExist:
                line_count = line_count + 1
                new_quotePart = old_quotePart
                new_quotePart.quote = new_quote
                new_quotePart.pk = None
                new_quotePart.line = line_count
                new_quotePart.save()
        # display the bike based quote copy page
        return HttpResponseRedirect(reverse('quote_copy_bike', args=(new_quote.id,)))
    else:
        # replicate items on first quote
        for old_quotePart in old_quoteParts:
            new_quotePart = old_quotePart
            new_quotePart.pk = None
            new_quotePart.quote = new_quote
            new_quotePart.save()
        # display the simple quote edit page
        return HttpResponseRedirect(reverse('quote_edit_simple', args=(new_quote.id,)))


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
            return render(request, "epic/quote_start.html", {'quoteForm': quoteForm})

        if newQuote.is_bike():
            # display the bike based quote edit page
            return HttpResponseRedirect(reverse('quote_edit_bike', args=(newQuote.id,)))
        else:
            # display the simple quote edit page
            return HttpResponseRedirect(reverse('quote_edit_simple', args=(newQuote.id,)))

    else:
        logging.getLogger("error_logger").error(quoteForm.errors.as_json())
        return render(request, "epic/quote_start.html", {'quoteForm': quoteForm})


def process_bike_quote_changes(request, quote):
    # get back the form from the page to save changes
    quote_page = 'epic/quote_edit_bike.html'

    quoteForm = QuoteBikeForm(request.POST, instance=quote)
    quoteSimpleAddPart = QuoteSimpleAddPartForm(request.POST)
    fittingForm = QuoteFittingForm(request.POST, prefix='fitting')
    old_sell_price = quote.sell_price

    if quoteForm.is_valid():
        quote = quoteForm.save()
        create_customer_note(request, quote.customer, quote, None)

        quotePartObjects = QuotePart.objects.filter(quote=quote)
        for quotePart in quotePartObjects:
            if quotePart.partType.can_be_omitted or quotePart.partType.can_be_substituted:

                quoteBikeChangePartForm = QuoteBikeChangePartForm(request.POST, request.FILES,
                                                                  prefix="QP" + str(quotePart.id))
                if quoteBikeChangePartForm.is_valid():
                    update_quote_part_from_form(quotePart, quoteBikeChangePartForm, request)
                else:
                    # quote part formset not valid
                    messages.error(request, 'Part failed validation' + str(quotePart))
                    return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote), 'quote': quote,
                                                        'quoteSections': get_quote_section_parts_and_forms(quote),
                                                        'fittingForm': fittingForm,
                                                        'customerFittings': Fitting.objects.filter(customer=quote.customer),
                                                        'quoteSimpleAddPart': quoteSimpleAddPart,
                                                        'customer_notes': CustomerNote.objects.filter(quote=quote)})

        # get attributes updated for quote
        save_quote_part_attributes(quote, request)

        if quoteSimpleAddPart.is_valid():
            part = validate_and_create_part(request, quoteSimpleAddPart)
            if part is not None:
                quote_line = len(quotePartObjects) + 1
                create_quote_part(quoteSimpleAddPart, quote.pk, part.pk, quote_line)
        else:
            # quoteSimpleAddPart not valid
            messages.error(request, 'New Part failed validation')
            return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote), 'quote': quote,
                                                'quoteSections': get_quote_section_parts_and_forms(quote),
                                                'fittingForm': fittingForm,
                                                'customerFittings': Fitting.objects.filter(customer=quote.customer),
                                                'quoteSimpleAddPart': quoteSimpleAddPart,
                                                'customer_notes': CustomerNote.objects.filter(quote=quote)})

        if fittingForm.has_changed():
            if fittingForm.is_valid():
                fitting = create_fitting(quote.customer, fittingForm)

                # update the fitting value on the quote and re-save
                quote.fitting = fitting
                quote.save()
                fittingForm = QuoteFittingForm(prefix='fitting')

            else:
                # fittingForm not valid
                logging.getLogger("error_logger").error(fittingForm.errors.as_json())
                messages.error(request, 'Fitting form failed validation')
                return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote), 'quote': quote,
                                                    'quoteSections': get_quote_section_parts_and_forms(quote),
                                                    'fittingForm': fittingForm,
                                                    'customerFittings': Fitting.objects.filter(customer=quote.customer),
                                                    'quoteSimpleAddPart': quoteSimpleAddPart,
                                                    'customer_notes': CustomerNote.objects.filter(quote=quote)})
        else:
            # get the currently selected fitting and add it to the quote.
            id_fitting = request.POST.get('id_fitting', None)
            if id_fitting is not None:
                fitting = Fitting.objects.get(pk=id_fitting)
                # update the fitting value on the quote and re-save
                quote.fitting = fitting
                quote.save()

        quote.recalculate_prices()
        # if sell price has changed blank keyed value and reset quote status
        if old_sell_price != quote.sell_price:
            quote.keyed_sell_price = None
            quote.quote_status = INITIAL
            quote.save()

        # Do something. Should generally end with a redirect. For example:
        return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote), 'quote': quote,
                                            'quoteSections': get_quote_section_parts_and_forms(quote),
                                            'fittingForm': fittingForm,
                                            'customerFittings': Fitting.objects.filter(customer=quote.customer),
                                            'quoteSimpleAddPart': QuoteSimpleAddPartForm(empty_permitted=True),
                                            'customer_notes': CustomerNote.objects.filter(quote=quote)})
    else:
        # quoteForm not valid
        logging.getLogger("error_logger").error(quoteForm.errors.as_json())
        return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote), 'quote': quote,
                                            'quoteSections': get_quote_section_parts_and_forms(quote),
                                            'fittingForm': fittingForm,
                                            'customerFittings': Fitting.objects.filter(customer=quote.customer),
                                            'quoteSimpleAddPart': quoteSimpleAddPart,
                                            'customer_notes': CustomerNote.objects.filter(quote=quote)})


def show_bike_quote_edit(request, quote):
    quoteSimpleAddPart = QuoteSimpleAddPartForm(empty_permitted=True)
    quote_page = 'epic/quote_edit_bike.html'
    customerFittings = Fitting.objects.filter(customer=quote.customer)
    customer_notes = CustomerNote.objects.filter(quote=quote)
    fittingForm = QuoteFittingForm(prefix='fitting')
    return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote), 'quote': quote,
                                        'quoteSections': get_quote_section_parts_and_forms(quote),
                                        'fittingForm': fittingForm, 'customerFittings': customerFittings,
                                        'quoteSimpleAddPart': quoteSimpleAddPart, 'customer_notes': customer_notes})

    #


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


# simple display ofsections
def quote_parts_for_simple_display(quote):
    quotePartObjects = QuotePart.objects.filter(quote=quote)
    quotePartDetails = []
    for quotePart in quotePartObjects:
        quotePartDetails.append(QuotePartAttribute.objects.filter(quotePart=quotePart))
    # build a merged array
    zipped_values = zip(quotePartObjects, quotePartDetails)
    return zipped_values


# simple display ofsections
def quote_parts_for_bike_display(quote):
    partSections = PartSection.objects.all()
    partSectionDetails = []

    for partSection in partSections:
        quoteParts = []
        quotePartDetails = []
        partTypes = PartType.objects.filter(includeInSection=partSection)
        for partType in partTypes:
            quotePartObjects = QuotePart.objects.filter(quote=quote, partType=partType)
            for quotePart in quotePartObjects:
                quoteParts.append(quotePart)
                quotePartDetails.append(QuotePartAttribute.objects.filter(quotePart=quotePart))
        partSectionDetails.append(zip(quoteParts, quotePartDetails))
    # build a merged array
    zipped_values = zip(partSections, partSectionDetails)
    return zipped_values

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
            can_be_substituted = partType.can_be_substituted
            can_be_omitted = partType.can_be_omitted

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
                if quotePart.part is None:
                    if quotePart.frame_part is not None:
                        # Bike part exists take defaults
                        sectionForms.append(
                            QuoteBikeChangePartForm(initial={'not_required': True},
                                                    prefix="QP" + str(quotePart.id),
                                                    can_be_substituted=can_be_substituted,
                                                    can_be_omitted=can_be_omitted))
                    else:
                        # No part and noequivalent part
                        sectionForms.append(QuoteBikeChangePartForm(initial={},
                                                                    prefix="QP" + str(quotePart.id),
                                                                    can_be_substituted=True,
                                                                    can_be_omitted=True))
                else:
                    # part is specified
                    if quotePart.frame_part is not None:
                        # replaces an original frame related part
                        sectionForms.append(QuoteBikeChangePartForm(initial={},
                                                                prefix="QP" + str(quotePart.id),
                                                                can_be_substituted=can_be_substituted,
                                                                can_be_omitted=can_be_omitted))
                    else:
                        # part with no equivalent bike part
                        new_brand = quotePart.part.brand.brand_name
                        new_part_name = quotePart.part.part_name
                        new_quantity = quotePart.quantity
                        new_cost_price = quotePart.cost_price
                        new_sell_price = quotePart.sell_price
                        sectionForms.append(QuoteBikeChangePartForm(
                            initial={'new_brand': new_brand, 'new_part_name': new_part_name, 'new_quantity': new_quantity,
                                     'new_cost_price': new_cost_price, 'new_sell_price': new_sell_price},
                            prefix="QP" + str(quotePart.id),
                            can_be_substituted=True,
                            can_be_omitted=False))

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
                 "cost_price": form.cleaned_data['new_cost_price'], "sell_price": form.cleaned_data['new_sell_price']}
    form = QuotePartBasicForm(data_dict)
    if form.is_valid():
        form.save()
    else:
        raise forms.ValidationError('QuotePartBasicForm  save failed')


# update an existing quote part based on keyed values
def update_quote_part_from_form(quote_part, form, request):
    not_required = form.cleaned_data['not_required']
    if not_required:
        if (quote_part.frame_part is None) and (
                    QuotePart.objects.filter(quote=quote_part.quote, partType=quote_part.partType).count() > 1):
            quote_part.delete()
        else:
            quote_part.part = None
            quote_part.quantity = 0
            quote_part.cost_price = None
            quote_part.sell_price = None
            quote_part.save()
    else:
        brand_name = form.cleaned_data['new_brand']
        quantity = form.cleaned_data['new_quantity']
        if (brand_name == '') or (quantity == 0):
            # values have been removed reset row
            if quote_part.frame_part is None:
                if QuotePart.objects.filter(quote=quote_part.quote, partType=quote_part.partType).count() > 1:
                    quote_part.delete()
                else:
                    quote_part.part = None
                    quote_part.quantity = 0
                    quote_part.cost_price = None
                    quote_part.sell_price = None
                    quote_part.save()
            else:
                quote_part.part = quote_part.frame_part.part
                quote_part.quantity = 1
                quote_part.cost_price = None
                quote_part.sell_price = None
                quote_part.save()
        else:
            # values have changed
            brand = find_brand_for_name(brand_name, request)
            partType = quote_part.partType
            part_name = form.cleaned_data['new_part_name']
            part = find_or_create_part(brand, partType, part_name)
            if part is not None:
                quote_part.part = part
                quote_part.quantity = quantity
                quote_part.cost_price = form.cleaned_data['new_cost_price']
                quote_part.sell_price = form.cleaned_data['new_sell_price']
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
            if quotePartAttributeForm.is_valid():
                if quotePartAttributeForm.cleaned_data['attribute_value'] != quotePartAttribute.attribute_value:
                    quotePartAttribute.attribute_value = quotePartAttributeForm.cleaned_data['attribute_value']
                    quotePartAttribute.save()
            else:
                logging.getLogger("error_logger").error(quotePartAttributeForm.errors.as_json())
