from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

import logging

from epic.forms import QuoteForm
from epic.view_helpers.note_view_helper import create_customer_note


def show_add_quote(request):
    quoteForm = QuoteForm()
    return render(request, 'epic/quote_start.html', {'quoteForm': quoteForm})


def create_new_quote(request):
    # new quote to be added
    quoteForm = QuoteForm(request.POST)
    if quoteForm.is_valid():
        try:
            newQuote = quoteForm.save()
            newQuote.created_by = request.user
            newQuote.save()
            create_customer_note(request, newQuote.customer, newQuote, None)
        except Exception as e:
            logging.getLogger("error_logger").exception('Quote could not be saved')
            return render(request, "epic/quote_start.html", {'quoteForm': quoteForm})

        if newQuote.is_bike():
            # display the bike based quote edit page
            return HttpResponseRedirect(reverse('quote_edit_bike', args=(newQuote.id,)))
        else:
            # display the simple quote edit page
            return HttpResponseRedirect(reverse('quote_edit_simple', args=(newQuote.id,)))

    else:
        logging.getLogger("error_logger").error(quoteForm.errors.as_json())
        return render(request, "epic/quote_start.html", {'quoteForm': quoteForm})
