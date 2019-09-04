from epic.models.note_models import CustomerNote


def create_note_for_quote_part(quote_part, user, action):
    note_text = f'Quote part {action} for {quote_part.partType}'
    customer_note = CustomerNote(customer=quote_part.quote.customer,
                                 quote=quote_part.quote,
                                 note_text=note_text,
                                 created_by=user,
                                 system_generated=True)
    customer_note.save()


def create_note_for_quote_charge(quote_charge, user, action):
    note_text = f'Quote charge {action} for {quote_charge.charge.charge_name} with price £{quote_charge.price}'
    customer_note = CustomerNote(customer=quote_charge.quote.customer,
                                 quote=quote_charge.quote,
                                 note_text=note_text,
                                 created_by=user,
                                 system_generated=True)
    customer_note.save()


def create_note_for_quote_answer(quote_answer, user, action):
    note_text = f'Answer provided {action} for {quote_answer.question.question} with reply {quote_answer.answer}'
    customer_note = CustomerNote(customer=quote_answer.quote.customer,
                                 quote=quote_answer.quote,
                                 note_text=note_text,
                                 created_by=user,
                                 system_generated=True)
    customer_note.save()


def create_note_for_requote(quote, user):
    note_text = "Quote set back to Initial"
    customer_note = CustomerNote(customer=quote.customer, quote=quote, note_text=note_text, created_by=user,
                                 system_generated=True)
    customer_note.save()


def create_note_for_issue(quote, user):
    note_text = f'Quote issued at price £{quote.quote_price}'
    customer_note = CustomerNote(customer=quote.customer, quote=quote, note_text=note_text, created_by=user,
                                 system_generated=True)
    customer_note.save()


def create_note_for_new_quote(quote, user, old_quote_desc):
    note_text = "Quote created"
    if old_quote_desc:
        note_text = note_text + ' based on ' + old_quote_desc
    customer_note = CustomerNote(customer=quote.customer, quote=quote, note_text=note_text, created_by=user,
                                 system_generated=True)
    customer_note.save()


def create_note_for_saved_quote(quote, user):
    note_text = "Quote updated"
    customer_note = CustomerNote(customer=quote.customer, quote=quote, note_text=note_text, created_by=user,
                                 system_generated=True)
    customer_note.save()


def create_note_for_quote_archive(quote, user):
    note_text = "Quote Archived"
    customer_note = CustomerNote(customer=quote.customer, quote=quote, note_text=note_text, created_by=user,
                                 system_generated=True)
    customer_note.save()


def create_note_for_quote_order(quote, user):
    note_text = "Quote added to order"
    customer_note = CustomerNote(customer=quote.customer, quote=quote, note_text=note_text, created_by=user,
                                 system_generated=True)
    customer_note.save()


def create_note_customer_order_cancel(customer_order, user):
    note_text = "Customer Order Cancelled"
    customer_note = CustomerNote(customer=customer_order.customer, customerOrder=customer_order, note_text=note_text,
                                 created_by=user, system_generated=True)
    customer_note.save()


def create_note_customer_order_create(customer_order, user):
    note_text = "Customer Order Created"
    customer_note = CustomerNote(customer=customer_order.customer, customerOrder=customer_order, note_text=note_text,
                                 created_by=user, system_generated=True)
    customer_note.save()
