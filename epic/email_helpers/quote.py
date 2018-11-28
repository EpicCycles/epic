from django.contrib import messages

from epic.form_helpers.choices import get_part_section_list_from_cache, get_part_types_for_section_from_cache


# post from browse quote page to issue quote
from epic.models.customer_models import FITTING_TYPE_CHOICES, CustomerNote
from epic.models.quote_models import QuotePart


def build_quote_detail_for_email(quote):
    # todo additional details formatting
    quote_for_email = {}
    if quote.is_bike():
        quote_for_email['bike'] = str(quote.frame)
        if quote.fitting:
            quote_for_email['fitting'] = {'source': dict(FITTING_TYPE_CHOICES).get(quote.fitting.fitting_type),
                                          'saddle_height': quote.fitting.saddle_height,
                                          'bar_height': quote.fitting.bar_height, 'reach': quote.fitting.reach}

    part_sections = get_part_section_list_from_cache()
    items = []
    notes = []
    for part_section in part_sections:
        partTypes = get_part_types_for_section_from_cache(part_section)

        for partType in partTypes:
            quotePartObjects = QuotePart.objects.filter(quote=quote, partType=partType)
            for quotePart in quotePartObjects:
                include_part = False
                if quotePart.is_not_standard_part:
                    include_part = True
                else:
                    if partType.customer_facing and quotePart.part is not None:
                        include_part = True

                if include_part:
                    if quote.is_bike():
                        items.append({'name': quotePart.get_bike_part_summary(), 'qty': str(quotePart.quantity)})
                    else:
                        items.append({'name': quotePart.summary(), 'qty': str(quotePart.quantity)})
    for customer_note in CustomerNote.objects.filter(quote=quote, customer_visible=True):
        notes.append({'note_text': customer_note.note_text, 'added_on': f"{customer_note.created_on:%b %d, %Y}",
                      'added_by': str(customer_note.created_by)})

    quote_for_email['id'] = str(quote)
    quote_for_email['cost'] = str(quote.keyed_sell_price)
    quote_for_email['date'] = f"{quote.issued_date:%b %d, %Y}"
    quote_for_email['items'] = items
    quote_for_email['notes'] = notes

    return quote_for_email
