# general processing for Customer forms
import logging

from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from epic.forms import CustomerForm, AddressFormSet, PhoneFormSet, FittingFormSet, CustomerQuoteForm, ChangeCustomerForm
from epic.models import Fitting, CustomerNote, Quote
from epic.view_helpers.note_view_helper import create_customer_note


def add_customer_view(request):
    address_form_set = AddressFormSet()
    phone_form_set = PhoneFormSet()
    fitting_form_set = FittingFormSet()
    customer_quote_form = CustomerQuoteForm(prefix='new')
    variables = {'customer_form': CustomerForm(), 'address_form_set': address_form_set,
                 'phone_form_set': phone_form_set, 'fitting_form_set': fitting_form_set,
                 'customer_quote_form': customer_quote_form}
    return render(request, 'epic/maintain_customer.html', variables)


def process_customer_add(request):
    customer_form = CustomerForm(request.POST)
    if customer_form.is_valid():

        new_customer = customer_form.save()
        address_form_set = AddressFormSet(request.POST, request.FILES, new_customer)
        phone_form_set = PhoneFormSet(request.POST, request.FILES, new_customer)
        fitting_form_set = FittingFormSet(request.POST, request.FILES, new_customer)
        customer_quote_form = CustomerQuoteForm(request.POST, prefix='new')
        if address_form_set.is_valid():
            address_form_set.save()
        if phone_form_set.is_valid():
            phone_form_set.save()
        if fitting_form_set.is_valid():
            fitting_form_set.save()
        if customer_quote_form.has_changed():
            if customer_quote_form.is_valid():
                quote = create_customer_quote(new_customer, customer_quote_form, request.user)
                if quote.is_bike():
                    return HttpResponseRedirect(reverse('quote_edit_bike', args=(quote.id,)))
                else:
                    return HttpResponseRedirect(reverse('quote_edit_simple', args=(quote.id,)))

        return HttpResponseRedirect(reverse('edit_customer', args=(new_customer.id,)))


def show_customer_edit(request, customer):
    address_form_set = AddressFormSet(instance=customer)
    phone_form_set = PhoneFormSet(instance=customer)
    fitting_form_set = FittingFormSet(instance=customer)
    customer_quote_form = CustomerQuoteForm(prefix='new')

    existing_quotes = Quote.objects.filter(customer=customer)
    return render(request, 'epic/maintain_customer.html',
                  {'customer': customer, 'customer_form': ChangeCustomerForm(instance=customer),
                   'address_form_set': address_form_set, 'phone_form_set': phone_form_set,
                   'fitting_form_set': fitting_form_set, 'customer_quote_form': customer_quote_form,
                   'existing_quotes': existing_quotes})


def process_customer_edit(request, customer):
    customer_form = ChangeCustomerForm(request.POST, instance=customer)
    address_form_set = AddressFormSet(request.POST, request.FILES, instance=customer)
    phone_form_set = PhoneFormSet(request.POST, request.FILES, instance=customer)
    fitting_form_set = FittingFormSet(request.POST, request.FILES, instance=customer)
    customer_quote_form = CustomerQuoteForm(request.POST, prefix='new')

    if customer_form.is_valid():

        customer_form.save()
        create_customer_note(request, customer, None, None)
        if address_form_set.is_valid():
            address_form_set.save()
            address_form_set = AddressFormSet(instance=customer)

        if phone_form_set.is_valid():
            phone_form_set.save()
            phone_form_set = PhoneFormSet(instance=customer)

        if fitting_form_set.is_valid():
            fitting_form_set.save()
            fitting_form_set = FittingFormSet(instance=customer)

        if customer_quote_form.has_changed():
            if customer_quote_form.is_valid():
                create_customer_quote(customer, customer_quote_form, request.user)
                customer_quote_form = CustomerQuoteForm(prefix='new')
            else:
                logging.getLogger("error_logger").error(customer_quote_form.errors.as_json())

    existing_quotes = Quote.objects.filter(customer=customer)
    return render(request, 'epic/maintain_customer.html',
                  {'customer': customer, 'customer_form': ChangeCustomerForm(instance=customer),
                   'address_form_set': address_form_set, 'phone_form_set': phone_form_set,
                   'fitting_form_set': fitting_form_set, 'customer_quote_form': customer_quote_form,
                   'existing_quotes': existing_quotes})


# create a new quote from form details and customer
def create_customer_quote(customer, form, user):
    if form.cleaned_data['quote_type'] != '':
        quote_desc = form.cleaned_data['quote_desc']
        quote_type = form.cleaned_data['quote_type']
        frame = form.cleaned_data['frame']
        quote = Quote(customer=customer, quote_desc=quote_desc, quote_type=quote_type, created_by=user, frame=frame)
        quote.save()
        return quote
    else:
        return None
