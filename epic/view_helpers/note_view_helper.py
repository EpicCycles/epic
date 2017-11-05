# add a note to with details as specified
from django.shortcuts import render

from epic.models import CustomerNote


def create_customer_note(request, customer, quote, customer_order):
    note_contents_epic = request.POST.get('note_contents_epic', '')
    note_contents_cust = request.POST.get('note_contents_cust', '')

    if note_contents_epic != '':
        note_text = note_contents_epic
        created_by = request.user
        customer_visible = False

        customerNote = CustomerNote(customer=customer, quote=quote, customerOrder=customer_order, note_text=note_text,
                                    created_by=created_by, customer_visible=customer_visible)
        customerNote.save()
    if note_contents_cust != '':
        note_text = note_contents_cust
        created_by = request.user
        customer_visible = True

        customerNote = CustomerNote(customer=customer, quote=quote, customerOrder=customer_order, note_text=note_text,
                                    created_by=created_by, customer_visible=customer_visible)
        customerNote.save()

def show_notes_popup(request, customer):
    customer_notes = CustomerNote.objects.filter(customer=customer)
    return render(request, 'epic/view_notes.html', {'customer': customer, 'customer_notes': customer_notes})