from django.contrib import messages

from epic.helpers.note_helper import create_note_for_requote, create_note_for_quote_archive
from epic.models import INITIAL, ARCHIVED, Quote, QuotePart, Customer, Frame


def quote_requote(request, quote: Quote):
    """

    Args:
        request (HttpRequest)
        quote (Quote):
    """
    quote.quote_status = INITIAL
    quote.save()

    create_note_for_requote(quote, request.user)
    messages.info(request, f'Quote status reset to initial - {str(quote)}')


def quote_requote_reset_prices(request, quote):

    quote_parts = quote.quotepart_set.all()
    for quote_part in quote_parts:
        quote_part.trade_in_price = None
        quote_part.sell_price = None
        quote_part.save()

    quote.keyed_sell_price = None
    if quote.frame:
        quote.frame_sell_price = quote.frame.sell_price

    else:
        quote.frame_sell_price = None

    quote.quote_status = INITIAL
    quote.save()

    create_note_for_requote(quote, request.user)
    messages.info(request, f'Quote status reset to initial and all prices reset - {str(quote)}')


def quote_archive(request, quote):
    if quote.quote_status == ARCHIVED:
        pass
    else:
        quote.quote_status = ARCHIVED
        quote.save()

        create_note_for_quote_archive(quote, request.user)
        messages.info(request, f'Quote archived - {str(quote)}')


# create a new quote based on an existing quote
def copy_quote_with_changes(old_quote, request, frame, customer):
    # get the quote you are basing it on and create a copy_quote
    copy_customer = old_quote.customer
    copy_fitting = old_quote.fitting
    if customer:
        if type(customer) == Customer:
            copy_customer = customer
            copy_fitting = None
        else:
            raise TypeError('Customer object expected')

    quote_same_name = Quote.objects.filter(customer=copy_customer, quote_desc=old_quote.quote_desc).count()
    # copy quote details
    new_quote = Quote.objects.get(pk=old_quote.pk)
    new_quote.pk = None
    new_quote.customer = copy_customer
    new_quote.fitting = copy_fitting
    new_quote.version = quote_same_name + 1
    new_quote.quote_status = INITIAL
    new_quote.created_by = request.user
    if frame:
        if new_quote.is_bike():
            if type(frame) == Frame:
                new_quote.frame = frame
                new_quote.keyed_sell_price = None
                new_quote.frame_sell_price = frame.sell_price
                new_quote.colour = None
                new_quote.colour_price = None
                new_quote.frame_size = None
            else:
                raise TypeError('Frame object expected')
        else:
            raise ValueError('Frame change requested for non Bike quote')
    # save creates all the parts required for a bike
    new_quote.save()

    # get parts from old quote and copy across to new_quote
    old_quote_parts = QuotePart.objects.filter(quote=old_quote)
    for old_quote_part in old_quote_parts:
        QuotePart.objects.copy_quote_part_to_new_quote(new_quote, old_quote_part)

    return new_quote

