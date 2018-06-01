from epic.models import CustomerNote


def create_note_for_requote(quote, user):
    note_text = "Quote set back to Initial"
    customer_note = CustomerNote(customer=quote.customer, quote=quote, note_text=note_text, created_by=user,
                                customer_visible=False)
    customer_note.save()


def create_note_for_quote_archive(quote, user):
    note_text = "Quote Archived"
    customerNote = CustomerNote(customer=quote.customer, quote=quote, note_text=note_text, created_by=user,
                                customer_visible=False)
    customerNote.save()


def create_note_for_quote_order(quote, user):
    note_text = "Quote added to order"
    customer_note = CustomerNote(customer=quote.customer, quote=quote, note_text=note_text, created_by=user,
                                customer_visible=False)
    customer_note.save()


def create_note_customer_order_cancel(customer_order, user):

    note_text = "Customer Order Cancelled"
    customer_note = CustomerNote(customer=customer_order.customer, customerOrder=customer_order, note_text=note_text,
                                created_by=user, customer_visible=False)
    customer_note.save()


def create_note_customer_order_create(customer_order, user):

    note_text = "Customer Order Created"
    customer_note = CustomerNote(customer=customer_order.customer, customerOrder=customer_order, note_text=note_text,
                                created_by=user, customer_visible=False)
    customer_note.save()