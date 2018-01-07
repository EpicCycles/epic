import logging

from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib import messages

from epic.forms import CustomerOrderForm, OrderPaymentForm, OrderFrameForm, OrderItemForm
from epic.helpers.customer_order_helper import cancel_customer_order, record_payment, create_customer_order_for_quote
from epic.helpers.quote_helper import quote_requote, quote_archive, quote_order
from epic.models import OrderItem,  OrderFrame,  OrderPayment, CustomerNote,  Quote
from epic.view_helpers.note_view_helper import create_customer_note


def create_customer_order_from_quote(request, quote, deposit_taken):
    customer_order = create_customer_order_for_quote(request, quote, deposit_taken)
    quote_order(request, quote, customer_order)

    # display order page
    return HttpResponseRedirect(reverse('order_edit', args=(customer_order.id,)))


def edit_customer_order(request, customer_order):
    order_payments = OrderPayment.objects.filter(customerOrder=customer_order)
    order_payment_form = OrderPaymentForm(initial={'amount_due': customer_order.amount_due})
    customer_notes = CustomerNote.objects.filter(customerOrder=customer_order)
    return render(request, 'epic/order_edit.html',
                  {'customer_order': customer_order, 'customer_order_form': CustomerOrderForm(instance=customer_order),
                   'order_frame_forms': build_order_frame_forms(customer_order),
                   'order_item_forms': build_order_item_forms(customer_order), 'order_payment_form': order_payment_form,
                   'order_payments': order_payments, 'customer_notes': customer_notes})


def cancel_order_and_requote(request, customer_order):
    if customer_order.can_be_cancelled():
        quotes_for_order = Quote.objects.filter(customerOrder=customer_order)
        show_quote = None
        for quote in quotes_for_order:
            show_quote = quote
            quote_requote(request, quote)

        cancel_customer_order(request, customer_order)
        if show_quote:
            return HttpResponseRedirect(reverse('quote_edit', args=(show_quote.pk,)))
        else:
            return HttpResponseRedirect(reverse('order_list'))
    else:
        messages.warning(request, 'Supplier Orders have been placed these must be cancelled before the Customer Order can be cancelled')
        return HttpResponseRedirect(reverse('order_edit', args=(customer_order.pk,)))


def cancel_order_and_quote(request, customer_order):
    if customer_order.can_be_cancelled():
        quotes_for_order = Quote.objects.filter(customerOrder=customer_order)
        for quote in quotes_for_order:
            quote_archive(request, quote)
            quote.archive()

        cancel_customer_order(request, customer_order)
        return HttpResponseRedirect(reverse('order_list'))
    else:
        messages.warning(request, 'Supplier Orders have been placed these must be cancelled before the Customer Order can be cancelled')
        return HttpResponseRedirect(reverse('order_edit', args=(customer_order.pk,)))


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
                record_payment(customer_order, payment_amount, request)
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
        order_item_form = OrderItemForm(request.POST, request.FILES, instance=orderItem,
                                        prefix="OI" + str(orderItem.id))
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
            orderFrameDetails.append(orderFrame.view_order_frame)
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
