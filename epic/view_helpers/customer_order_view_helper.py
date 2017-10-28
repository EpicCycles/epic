import logging

from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from epic.forms import CustomerOrderForm, OrderPaymentForm, OrderFrameForm, OrderItemForm
from epic.models import OrderItem, QuotePart, OrderFrame, CustomerOrder, OrderPayment, CustomerNote, ORDERED
from epic.view_helpers.note_view_helper import create_customer_note


def create_customer_order_from_quote(quote):
    customerOrder = CustomerOrder.objects.create_customerOrder(quote)
    customerOrder.save()
    quote.quote_status = ORDERED
    quote.save()

    if quote.is_bike():
        # create frame element and part elements and forms for them
        orderFrame = OrderFrame.objects.create_orderFrame(quote.frame, customerOrder, quote)
        orderFrame.save()

    # create part elements and forms for them
    quotePartObjects = QuotePart.objects.filter(quote=quote)
    for quotePart in quotePartObjects:
        if quotePart.part and quotePart.notStandard():
            orderItem = OrderItem.objects.create_orderItem(quotePart.part, customerOrder, quotePart)
            orderItem.save()

    # calculate the order balance
    customerOrder.calculate_balance()
    customerOrder.save()
    # display order page
    return HttpResponseRedirect(reverse('order_edit', args=(customerOrder.id,)))


def edit_customer_order(request, customer_order):
    order_payments = OrderPayment.objects.filter(customerOrder=customer_order)
    order_payment_form = OrderPaymentForm(initial={'amount_due': customer_order.amount_due})
    customer_notes = CustomerNote.objects.filter(customerOrder=customer_order)
    return render(request, 'epic/order_edit.html',
                  {'customer_order': customer_order, 'customer_order_form': CustomerOrderForm(instance=customer_order),
                   'order_frame_forms': build_order_frame_forms(customer_order),
                   'order_item_forms': build_order_item_forms(customer_order), 'order_payment_form': order_payment_form,
                   'order_payments': order_payments, 'customer_notes': customer_notes})


def process_customer_order_edits(request, customer_order):
    customer_order_form = CustomerOrderForm(request.POST, instance=customer_order)
    if customer_order_form.is_valid():
        try:
            customer_order_form.save()
        except Exception as e:
            logging.getLogger("error_logger").exception('Order changes could not be saved')
    else:
        logging.getLogger("error_logger").error(customer_order_form.errors.as_json())

    order_payment_form = OrderPaymentForm(request.POST)
    if order_payment_form.is_valid():
        try:
            payment_amount = order_payment_form.cleaned_data['payment_amount']
            if payment_amount:
                order_payment = OrderPayment.objects.create_orderPayment(customer_order, payment_amount, request.user)
                order_payment.save()
                customer_order.calculate_balance()
                customer_order.save()
                order_payment_form = OrderPaymentForm(initial={'amount_due': customer_order.amount_due})

        except Exception as e:
            logging.getLogger("error_logger").exception('Payment could not be saved')
    else:
        logging.getLogger("error_logger").error(order_payment_form.errors.as_json())

    # save any note keyed
    create_customer_note(request, customer_order.customer, None, customer_order)

    # get back the order frame forms and save
    orderFrameObjects = OrderFrame.objects.filter(customerOrder=customer_order)
    for orderFrame in orderFrameObjects:
        orderFrameForm = OrderFrameForm(request.POST, request.FILES, instance=orderFrame,
                                        prefix="OF" + str(orderFrame.id))
        if orderFrameForm.is_valid():
            try:
                orderFrameForm.save()

            except Exception as e:
                logging.getLogger("error_logger").exception('Order Frame updates could not be saved')
        else:
            logging.getLogger("error_logger").error(orderFrameForm.errors.as_json())

    # get back the order item forms and save.
    orderItemObjects = OrderItem.objects.filter(customerOrder=customer_order)
    for orderItem in orderItemObjects:
        order_item_form = OrderItemForm(request.POST, request.FILES, instance=orderItem, prefix="OI" + str(orderItem.id))
        if order_item_form.is_valid():
            try:
                order_item_form.save()

            except Exception as e:
                logging.getLogger("error_logger").exception('Order Item updates could not be saved')
        else:
            logging.getLogger("error_logger").error(order_item_form.errors.as_json())

    order_payments = OrderPayment.objects.filter(customerOrder=customer_order)
    customer_notes = CustomerNote.objects.filter(customerOrder=customer_order)
    return render(request, 'epic/order_edit.html',
                  {'customer_order': customer_order, 'customer_order_form': CustomerOrderForm(instance=customer_order),
                   'order_frame_forms': build_order_frame_forms(customer_order),
                   'order_item_forms': build_order_item_forms(customer_order), 'order_payment_form': order_payment_form,
                   'order_payments': order_payments, 'customer_notes': customer_notes})


# helpers for customer order views

# build array of forms for customer order item details
def build_order_frame_forms(customer_order):
    orderFrameObjects = OrderFrame.objects.filter(customerOrder=customer_order)
    if orderFrameObjects:
        order_frame_forms = []
        orderFrameDetails = []
        for orderFrame in orderFrameObjects:
            order_frame_forms.append(OrderFrameForm(instance=orderFrame, prefix="OF" + str(orderFrame.id)))
            orderFrameDetails.append(orderFrame.viewOrderFrame())
        zipped_values = zip(orderFrameDetails, order_frame_forms)
        return zipped_values
    return None


# build array of forms for customer order item details
def build_order_item_forms(customer_order):
    orderItemObjects = OrderItem.objects.filter(customerOrder=customer_order)
    if orderItemObjects:
        orderItemDetails = []
        order_item_forms = []
        for orderItem in orderItemObjects:
            order_item_form = OrderItemForm(instance=orderItem, prefix="OI" + str(orderItem.id))
            order_item_forms.append(order_item_form)
            orderItemDetails.append(orderItem.quotePart.summary())
        zipped_values = zip(orderItemDetails, order_item_forms)
        return zipped_values
    return None
