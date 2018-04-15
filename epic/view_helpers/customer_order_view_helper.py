import logging

from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib import messages

from epic.email_helpers.customer_order import send_order_email
from epic.forms import CustomerOrderForm, OrderPaymentForm, OrderFrameForm, OrderItemForm
from epic.helpers.customer_order_helper import cancel_customer_order, record_payment, create_customer_order_for_quote, \
    add_quote_elements_to_order
from epic.helpers.quote_helper import quote_requote, quote_archive, quote_order
from epic.models import OrderItem, OrderFrame, OrderPayment, CustomerNote, Quote, ARCHIVED, ORDERED
from epic.view_helpers.menu_view_helper import add_standard_session_data
from epic.view_helpers.note_view_helper import create_customer_note


def create_customer_order_from_quote(request, quote, deposit_taken):
    customer_order = create_customer_order_for_quote(request, quote, deposit_taken)
    quote_order(request, quote, customer_order)
    if quote.customer.email:
        send_order_email(request, customer_order)
    else:
        messages.success(request, 'Order email not sent, no email for customer')

    # display order page
    return HttpResponseRedirect(reverse('order_edit', args=(customer_order.id,)))


def edit_customer_order(request, customer_order):
    order_payments = OrderPayment.objects.filter(customerOrder=customer_order)
    order_payment_form = OrderPaymentForm(initial={'amount_due': customer_order.amount_due})
    customer_notes = CustomerNote.objects.filter(customerOrder=customer_order)
    other_quotes = Quote.objects.filter(customer=customer_order.customer).exclude(quote_status__in=(ARCHIVED, ORDERED))

    return render(request, 'epic/order_edit.html',
                  {'customer_order': customer_order, 'customer_order_form': CustomerOrderForm(instance=customer_order),
                   'order_frame_forms': build_order_frame_forms(customer_order),
                   'order_item_forms': build_order_item_forms(customer_order), 'order_payment_form': order_payment_form,
                   'order_payments': order_payments, 'customer_notes': customer_notes, 'other_quotes': other_quotes})


def cancel_order_and_requote(request, customer_order):
    """

    Args:
        request : HTTPRequest
        customer_order : CustomerOrder

    Returns: HTTPResponse

    """
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
        messages.warning(request,
                         "Supplier Orders have been placed these must be cancelled before the Customer Order can be cancelled")
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
        messages.warning(request,
                         "Supplier Orders have been placed these must be cancelled before the Customer Order can be cancelled")
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

        except Exception:
            logging.getLogger("error_logger").exception('Payment could not be saved')
    else:
        logging.getLogger("error_logger").error(order_payment_form.errors.as_json())

    # save any note keyed
    create_customer_note(request, customer_order.customer, None, customer_order)

    # get back the other quotes that can be added to the order and add them.
    add_quotes = request.POST.getlist('add_quote')
    added_quotes = []
    for quote_id in add_quotes:
        quote = Quote.objects.get(id=quote_id)
        if (quote and quote.can_be_ordered):
            add_quote_elements_to_order(customer_order, quote)
            quote_order(request, quote, customer_order)
            added_quotes.append(quote)

    # get back the order frame forms and save
    order_frame_forms = process_order_frame_changes(request, customer_order, added_quotes)
    order_item_forms = process_order_item_changes(request, customer_order, added_quotes)

    order_payments = OrderPayment.objects.filter(customerOrder=customer_order)
    customer_notes = CustomerNote.objects.filter(customerOrder=customer_order)

    return render(request, 'epic/order_edit.html',
                  add_standard_session_data(request, {'customer_order': customer_order,
                                                      'customer_order_form': CustomerOrderForm(instance=customer_order),
                                                      'order_frame_forms': build_order_frame_forms(customer_order),
                                                      'order_item_forms': build_order_item_forms(customer_order),
                                                      'order_payment_form': order_payment_form,
                                                      'order_payments': order_payments,
                                                      'customer_notes': customer_notes}))


def process_order_frame_changes(request, customer_order, added_quotes):
    order_frame_objects = OrderFrame.objects.filter(customerOrder=customer_order)
    if order_frame_objects:
        order_frame_forms = []
        order_frame_details = []
        # step 1 process ones already on page
        existing_frames = order_frame_objects.exclude(quote__in=added_quotes)
        for order_frame in existing_frames:
            order_frame_form = OrderFrameForm(request.POST, request.FILES, instance=order_frame,
                                              prefix="OF" + str(order_frame.id))
            if order_frame_form.is_valid():
                try:
                    order_frame_form.save()
                except Exception:
                    logging.getLogger("error_logger").exception('Order Frame updates could not be saved')
            else:
                logging.getLogger("error_logger").error(order_frame_form.errors.as_json())

            order_frame_forms.append(order_frame_form)
            order_frame_details.append(order_frame.view_order_frame)

        new_frames = order_frame_objects.filter(quote__in=added_quotes)
        for order_frame in new_frames:
            order_frame_forms.append(OrderFrameForm(instance=order_frame, prefix="OF" + str(order_frame.id)))
            order_frame_details.append(order_frame.view_order_frame)

        zipped_values = zip(order_frame_details, order_frame_forms)
        return zipped_values

    return None


def process_order_item_changes(request, customer_order, added_quotes):
    order_item_objects = OrderItem.objects.filter(customerOrder=customer_order)
    if order_item_objects:
        order_item_details = []
        order_item_forms = []
        for order_item in order_item_objects:
            if (order_item.quotePart):
                order_item_details.append(order_item.quotePart.summary())
            else:
                order_item_details.append(str(order_item.quotePart))

            if order_item.quotePart.quote in added_quotes:
                order_item_form = OrderItemForm(instance=order_item, prefix="OI" + str(order_item.id))
                order_item_forms.append(order_item_form)
            else:
                order_item_form = OrderItemForm(request.POST, request.FILES, instance=order_item,
                                                prefix="OI" + str(order_item.id))
                if order_item_form.is_valid():
                    try:
                        order_item_form.save()

                    except Exception as e:
                        logging.getLogger("error_logger").exception('Order Item updates could not be saved')
                else:
                    logging.getLogger("error_logger").error(order_item_form.errors.as_json())
                order_item_forms.append(order_item_form)

        zipped_values = zip(order_item_details, order_item_forms)
        return zipped_values

    return None


# build array of forms for customer order item details
def build_order_frame_forms(customer_order):
    order_frame_objects = OrderFrame.objects.filter(customerOrder=customer_order)
    if order_frame_objects:
        order_frame_forms = []
        order_frame_details = []
        for order_frame in order_frame_objects:
            order_frame_forms.append(OrderFrameForm(instance=order_frame, prefix="OF" + str(order_frame.id)))
            order_frame_details.append(order_frame.view_order_frame)
        zipped_values = zip(order_frame_details, order_frame_forms)
        return zipped_values
    return None


# build array of forms for customer order item details
def build_order_item_forms(customer_order):
    order_item_objects = OrderItem.objects.filter(customerOrder=customer_order)
    if order_item_objects:
        order_item_details = []
        order_item_forms = []
        for order_item in order_item_objects:
            order_item_form = OrderItemForm(instance=order_item, prefix="OI" + str(order_item.id))
            order_item_forms.append(order_item_form)
            if (order_item.quotePart):
                order_item_details.append(order_item.quotePart.summary())
            else:
                order_item_details.append(str(order_item.quotePart))
        zipped_values = zip(order_item_details, order_item_forms)
        return zipped_values
    return None
