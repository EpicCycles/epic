# general processing for Customer forms
import logging

from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib import messages

from epic.forms import CustomerForm, AddressFormSet, PhoneFormSet, FittingFormSet, CustomerQuoteForm, \
    ChangeCustomerForm, NewCustomerQuoteForm, AddressFormSimple, PhoneFormSimple
from epic.models import Quote
from epic.view_helpers.note_view_helper import create_customer_note
from epic.view_helpers.quote_view_helper import show_quote_edit


def add_customer_view(request):
    address_form_set = AddressFormSet()
    phone_form_set = PhoneFormSet()
    fitting_form_set = FittingFormSet()
    customer_quote_form = NewCustomerQuoteForm(prefix='new')

    variables = {'customer_form': CustomerForm(), 'address_form_set': address_form_set,
                 'phone_form_set': phone_form_set, 'fitting_form_set': fitting_form_set,
                 'customer_quote_form': customer_quote_form}
    return render(request, 'epic/customer_edit.html', variables)


def process_customer_add(request):
    customer_form = CustomerForm(request.POST)
    if customer_form.is_valid():

        new_customer = customer_form.save()
        address_form_set = AddressFormSet(request.POST, request.FILES, new_customer)
        phone_form_set = PhoneFormSet(request.POST, request.FILES, new_customer)
        fitting_form_set = FittingFormSet(request.POST, request.FILES, new_customer)
        customer_quote_form = NewCustomerQuoteForm(request.POST, prefix='new')

        if address_form_set.is_valid():
            address_form_set.save()
        if phone_form_set.is_valid():
            phone_form_set.save()
        if fitting_form_set.is_valid():
            fitting_form_set.save()
        if customer_quote_form.has_changed():
            if customer_quote_form.is_valid():
                quote = customer_quote_form.save(commit=False)
                quote.customer = new_customer
                quote.save()
                return show_quote_edit(quote)
            else:
                logging.getLogger("error_logger").error(customer_quote_form.errors.as_json())

        return HttpResponseRedirect(reverse('edit_customer', args=(new_customer.id,)))


def save_customer_from_popup(request):
    customer_form = CustomerForm(request.POST)
    address_form = AddressFormSimple(request.POST)
    phone_form = PhoneFormSimple(request.POST)
    new_customer = None

    if not (customer_form.is_valid() and address_form.is_valid() and phone_form.is_valid()):
        messages.error(request, 'Customer details not saved')
        return render(request, 'epic/customer_add_popup.html',
                      {'customer_form': customer_form, 'address_form': address_form, 'phone_form': phone_form})

    try:
        new_customer = customer_form.save()
        messages.info(request, "Customer saved")

        if len(address_form.cleaned_data) > 0:
            customer_address = address_form.save(commit=False)
            if customer_address:
                customer_address.customer = new_customer
                customer_address.save()
                messages.info(request, "Address saved")

        if len(phone_form.cleaned_data) > 0:
            customer_phone = phone_form.save(commit=False)
            if customer_phone:
                customer_phone.customer = new_customer
                customer_phone.save()
                messages.info(request, "Phone number saved")

    except Exception as e:
        messages.error(request, 'Error on save')
        return render(request, 'epic/customer_add_popup.html',
                      {'customer_form': customer_form, 'address_form': address_form, 'phone_form': phone_form})

    # all details saved no errors
    return render(request, 'epic/customer_add_popup.html',
                  {'new_customer': new_customer, 'customer_form': customer_form, 'address_form': address_form,
                   'phone_form': phone_form})


def show_customer_edit(request, customer):
    customer_form = ChangeCustomerForm(instance=customer)
    address_form_set = AddressFormSet(instance=customer)
    phone_form_set = PhoneFormSet(instance=customer)
    fitting_form_set = FittingFormSet(instance=customer)
    customer_quote_form = CustomerQuoteForm(prefix='new', initial={'customer': customer})
    existing_quotes = Quote.objects.filter(customer=customer)
    return render(request, 'epic/customer_edit.html',
                  {'customer': customer, 'customer_form': customer_form, 'address_form_set': address_form_set,
                   'phone_form_set': phone_form_set, 'fitting_form_set': fitting_form_set,
                   'customer_quote_form': customer_quote_form, 'existing_quotes': existing_quotes})


def show_add_customer_popup(request):
    customer_form = CustomerForm()
    address_form = AddressFormSimple()
    phone_form = PhoneFormSimple()

    return render(request, 'epic/customer_add_popup.html',
                  {'customer_form': customer_form, 'address_form': address_form, 'phone_form': phone_form})


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
                quote = customer_quote_form.save()
                return show_quote_edit(quote)
            else:
                logging.getLogger("error_logger").error(customer_quote_form.errors.as_json())

    existing_quotes = Quote.objects.filter(customer=customer)

    return render(request, 'epic/customer_edit.html',
                  {'customer': customer, 'customer_form': ChangeCustomerForm(instance=customer),
                   'address_form_set': address_form_set, 'phone_form_set': phone_form_set,
                   'fitting_form_set': fitting_form_set, 'customer_quote_form': customer_quote_form,
                   'existing_quotes': existing_quotes})
