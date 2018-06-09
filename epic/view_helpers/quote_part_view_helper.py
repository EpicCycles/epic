from django.shortcuts import render

from epic.forms import QuotePartForm
from epic.models import QuotePart
from epic.view_helpers.attribute_view_helper import build_quote_part_attribute_form
from epic.view_helpers.menu_view_helper import add_standard_session_data
from epic.view_helpers.quote_view_helper import build_quote_part_form


def save_quote_part(request, quote):
    is_bike = quote.is_bike()

    initial__q_p = {'is_bike': is_bike, 'part_type': None}
    quote_part_form = QuotePartForm(request.POST, initial=initial__q_p)
    details_for_page = add_standard_session_data(request, {'quote_part_form': quote_part_form})

    if quote_part_form.is_valid():
        quote_part = QuotePart.objects.create_quote_part(quote, quote_part_form)
        quote_part.save()

        if quote_part:
            # part has been saved
            quote_format_part_form = build_quote_part_form(quote_part, is_bike)
            quote_part_attributes = quote_part.get_attributes()
            quote_part_attribute_forms = []
            for quote_part_attribute in quote_part_attributes:
                quote_part_attribute_forms.append(build_quote_part_attribute_form(quote_part_attribute, True))

            details_for_page['saved_part'] = quote_format_part_form
            details_for_page['saved_part_attributes'] = quote_part_attribute_forms
            details_for_page['quote_part_form'] =  QuotePartForm(initial=initial__q_p)

    return render(request, 'epic/part/quote_part_add_popup.html', details_for_page)



def show_quote_part_popup(request, quote):
    initial__q_p = {'is_bike': quote.is_bike(), 'part_type': None}
    details_for_page = add_standard_session_data(request, {'quote_part_form': QuotePartForm(initial=initial__q_p)})
    return render(request, 'epic/part/quote_part_add_popup.html', details_for_page)
