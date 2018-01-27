from django.contrib import messages

from epic.email_helpers.apostle_email import create_apostle_email, send_apostle_email
from epic.email_helpers.quote import build_quote_detail_for_email
from epic.models import CustomerNote, OrderItem, Quote, OrderPayment


def send_order_email(request, customer_order):
    customer_order_email = customer_order.customer.email
    mail = create_apostle_email("order-details", str(customer_order.customer), customer_order_email)
    mail.order = build_customer_order_detail_for_email(customer_order)
    send_apostle_email(mail)
    messages.success(request, 'Customer Order email sent to ' + customer_order_email)


# post from browse customer_order page to issue customer_order
def build_customer_order_detail_for_email(customer_order):
    customer_order_for_email = {}
    quote_objects = Quote.objects.filter(customerOrder=customer_order)
    quote_details = []
    for quote in quote_objects:
        quote_details.append(build_quote_detail_for_email(quote))

    order_item_objects = OrderItem.objects.filter(customerOrder=customer_order, quotePart__isnull=True)
    order_item_details = []
    for order_item in order_item_objects:
        order_item_details.append({"part": str(order_item)})

    order_payments = []
    for order_payment in OrderPayment.objects.filter(customerOrder=customer_order):
        order_payments.append({'amount': str(order_payment.amount), 'taken_on': f"{order_payment.created_on:%b %d, %Y}",
                               'taken_by': str(order_payment.created_by)})
    notes = []
    for customer_note in CustomerNote.objects.filter(customerOrder=customer_order, customer_visible=True):
        notes.append({'note_text': customer_note.note_text, 'added_on': f"{customer_note.created_on:%b %d, %Y}",
                      'added_by': str(customer_note.created_by)})

    customer_order_for_email['id'] = str(customer_order)
    customer_order_for_email['order_total'] = str(customer_order.order_total)
    customer_order_for_email['amount_due'] = str(customer_order.amount_due)
    customer_order_for_email['date'] = f"{customer_order.created_date:%b %d, %Y}"
    customer_order_for_email['quotes'] = quote_details
    customer_order_for_email['items'] = order_item_details
    customer_order_for_email['order_payments'] = order_payments
    customer_order_for_email['notes'] = notes

    return customer_order_for_email
