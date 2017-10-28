# add a note to with details as specified
from django.shortcuts import render

from epic.models import CustomerNote


def create_customer_note(request, customer, quote, customer_order):
    note_type = request.POST.get('note_type', '')
    note_contents = request.POST.get('note_contents', '')

    if note_contents != '':
        note_text = note_contents
        created_by = request.user
        customer_visible = (note_type == "customer")

        customerNote = CustomerNote(customer=customer, quote=quote, customerOrder=customer_order, note_text=note_text,
                                    created_by=created_by, customer_visible=customer_visible)
        customerNote.save()

def show_notes_popup(request, customer):
    customer_notes = CustomerNote.objects.filter(customer=customer)
    return render(request, 'epic/view_notes.html', {'customer': customer, 'customer_notes': customer_notes})