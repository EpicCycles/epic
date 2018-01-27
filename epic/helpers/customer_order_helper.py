from datetime import datetime

from django.contrib import messages

from epic.helpers.note_helper import create_note_customer_order_cancel, create_note_customer_order_create
from epic.models import OrderPayment, CustomerOrder, OrderFrame, QuotePart, OrderItem


def cancel_customer_order(request, customer_order):
    """

    :type customer_order: CustomerOrder
    """
    customer_order.cancelled_date = datetime.today()
    customer_order.save()
    messages.info(request, f'Order cancelled - {str(customer_order)}')

    create_note_customer_order_cancel(customer_order, request.user)


def create_customer_order_for_quote(request, quote, deposit_taken):
    customer_order = CustomerOrder.objects.create_customer_order(quote)
    customer_order.save()

    if (deposit_taken):
        record_payment(customer_order, deposit_taken, request)

    add_quote_elements_to_order(customer_order, quote)

    create_note_customer_order_create(customer_order, request.user)

    return customer_order


def add_quote_elements_to_order(customer_order, quote):
    if quote.is_bike():
        # create frame element and part elements and forms for them
        order_frame = OrderFrame.objects.create_order_frame(quote.frame, customer_order, quote)
        order_frame.save()
    # create part elements and forms for them
    quote_part_objects = QuotePart.objects.filter(quote=quote)
    for quote_part in quote_part_objects:
        if quote_part.part and quote_part.is_not_standard_part():
            order_item = OrderItem.objects.create_order_item(quote_part.part, customer_order, quote_part)
            order_item.save()

 

def record_payment(customer_order, deposit_taken, request):
    order_payment = OrderPayment.objects.create_order_payment(customer_order, deposit_taken, request.user)
    order_payment.save()
    customer_order.calculate_balance()
    customer_order.save()
