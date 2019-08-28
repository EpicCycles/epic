from epic.helpers.note_helper import create_note_for_requote, create_note_for_quote_archive, \
    create_note_for_quote_charge
from epic.models.bike_models import Bike, BikePart
from epic.models.brand_models import SupplierProduct
from epic.models.quote_models import INITIAL, ARCHIVED, Quote, QuotePart, Customer, QuoteAnswer, QuoteCharge


def check_charges(user, quote_answer: QuoteAnswer):
    if quote_answer.answer is True:
        if quote_answer.question.charge:
            if not QuoteCharge.objects.filter(quote=quote_answer.quote, charge=quote_answer.question.charge).exists():
                quote_charge = QuoteCharge(quote=quote_answer.quote, charge=quote_answer.question.charge,
                                           price=quote_answer.question.charge.price)
                quote_charge.save()
                create_note_for_quote_charge(quote_charge, user, 'Auto added')


def quote_requote(request, quote: Quote):
    """

    Args:
        request (HttpRequest)
        quote (Quote):
    """
    quote.quote_status = INITIAL
    quote.save()

    create_note_for_requote(quote, request.user)


def quote_archive(request, quote):
    if quote.quote_status == ARCHIVED:
        pass
    else:
        quote.quote_status = ARCHIVED
        quote.save()

        create_note_for_quote_archive(quote, request.user)


# create a new quote based on an existing quote
def copy_quote_part_to_new_quote(quote_part, new_quote, bike_parts):
    quote_part.id = None
    quote_part.quote = new_quote

    if new_quote.bike:
        bike_part = bike_parts.filter(part__partType=quote_part.partType).first()

        if quote_part.not_required:
            if bike_part:
                quote_part.trade_in_price = bike_part.part.trade_in_price
            else:
                return

    if quote_part.part:
        supplier_product = SupplierProduct.objects.filter(part=quote_part.part).first()
        if supplier_product:
            if new_quote.bike:
                quote_part.part_price = supplier_product.fitted_price
            else:
                quote_part.ticket_price = supplier_product.ticket_price
                if new_quote.club_member:
                    quote_part.club_price = supplier_product.club_price
    quote_part.save()


def copy_quote_with_changes(old_quote, user, quote_desc, bike, customer):
    # get the quote you are basing it on and create a copy_quote
    copy_customer = old_quote.customer
    copy_fitting = old_quote.fitting
    copy_quote_desc = old_quote.quote_desc
    if customer:
        if type(customer) == Customer:
            copy_customer = customer
            copy_fitting = None
        else:
            raise TypeError('Customer object expected')

    if quote_desc:
        copy_quote_desc = quote_desc

    # copy quote details
    new_quote = Quote.objects.get(pk=old_quote.pk)
    new_quote.pk = None
    new_quote.customer = copy_customer
    new_quote.club_member = copy_customer.club_member
    new_quote.fitting = copy_fitting
    new_quote.quote_status = INITIAL
    new_quote.created_by = user
    new_quote.quote_desc = copy_quote_desc

    quote_same_name = Quote.objects.filter(customer=copy_customer, quote_desc=copy_quote_desc).count()
    new_quote.version = quote_same_name + 1

    if bike:
        if new_quote.bike:
            if type(bike) == Bike:
                new_quote.bike = bike
                new_quote.bike_price = None
                new_quote.colour = None
                new_quote.frame_size = None
            else:
                raise TypeError('Bike object expected')
        else:
            raise ValueError('Bike change requested for non Bike quote')
    # save creates all the parts required for a bike
    new_quote.save()

    # get parts from old quote and copy across to new_quote
    old_quote_parts = QuotePart.objects.filter(quote=old_quote)
    bike_parts = BikePart.objects.filter(bike=new_quote.bike)
    for old_quote_part in old_quote_parts:
        copy_quote_part_to_new_quote(old_quote_part, new_quote, bike_parts)

    new_quote.recalculate_price()
    return new_quote
