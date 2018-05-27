from django.contrib import messages

from epic.helpers.note_helper import create_note_for_requote, create_note_for_quote_archive, create_note_for_quote_order
from epic.models import INITIAL, ARCHIVED, ORDERED, Quote, QuotePart


def quote_requote(request, quote):
    """
    set a quote to Initial so that it can be reviewed
    :param request:
    :Quote quote:
    """
    quote.quote_status = INITIAL
    quote.customerOrder = None
    quote.save()

    create_note_for_requote(quote, request.user)
    messages.info(request, f'Quote status reset to initial - {str(quote)}')


def quote_requote_reset_prices(request, quote):
    quote.sell_price = None
    quote.keyed_sell_price = None
    quote.frame_cost_price = None
    quote.frame_sell_price = None
    quote.quote_status = INITIAL
    quote.customerOrder = None
    quote.save()

    quote_parts = quote.quotepart_set.all()
    for quote_part in quote_parts:
        quote_part.trade_in_price = None
        if quote_part.quantity is not None:
            quote_part.sell_price = None
            quote_part.cost_price = None
            quote_part.save()

    create_note_for_requote(quote, request.user)
    messages.info(request, f'Quote status reset to initial and all prices reset - {str(quote)}')


def quote_archive(request, quote):
    if quote.quote_status == ARCHIVED:
        pass
    else:
        quote.quote_status = ARCHIVED
        quote.customerOrder = None
        quote.save()

        create_note_for_quote_archive(quote, request.user)
        messages.info(request, f'Quote archived - {str(quote)}')


def quote_order(request, quote, customer_order):
    quote.quote_status = ORDERED
    quote.customerOrder = customer_order
    quote.save()

    create_note_for_quote_order(quote, request.user)
    messages.info(request, f'Quote added to order - {str(quote)}')


# create a new quote based on an existing quote
def copy_quote_with_changes(old_quote, request, frame, customer):
    # get the quote you are basing it on and create a copy_quote
    quote_same_name = Quote.objects.filter(customer=old_quote.customer, quote_desc=old_quote.quote_desc).count()
    # copy quote details
    new_quote = Quote.objects.get(pk=old_quote.pk)
    new_quote.pk = None
    if customer:
        new_quote.customer = customer
    new_quote.version = quote_same_name + 1
    new_quote.quote_status = INITIAL
    new_quote.created_by = request.user
    if frame:
        new_quote.frame = frame
        new_quote.keyed_sell_price = None
        new_quote.frame_sell_price = frame.sell_price
        new_quote.colour = None
        new_quote.colour_price = None
        new_quote.frame_size = None
    # save creates all the parts required for a bike
    new_quote.save()

    # get parts from old quote and copy across to new_quote
    old_quote_parts = QuotePart.objects.filter(quote=old_quote)
    for old_quote_part in old_quote_parts:
        QuotePart.objects.copy_quote_part_to_new_quote(new_quote, old_quote_part)

    return new_quote

