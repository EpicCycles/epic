from django.http import HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import get_object_or_404, render
from django.views.generic.list import ListView
from django.db.models import Q
from django.shortcuts import render
from django.core.paginator import Paginator

## secutiy bits
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib.auth.mixins import LoginRequiredMixin

# import the logging library and the messages
import logging
from django.contrib import messages
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist

#models used in this code
from .models import Customer, Brand, Frame, FramePart, Part, PartType, Quote, PartSection
from django.contrib.auth.models import User
# forms and formsets used in the views
from .forms import *

@login_required
def quote_menu(request):
    # create list of brands to display for external links
    brands = Brand.objects.filter(link__startswith="http")
    return render(request, 'epic/quote_menu.html', {'brands': brands})

# this extends the mix in for login required rather than the @ method as that doesn'twork for ListViews
class CustomerList(LoginRequiredMixin, ListView):

    template_name = "customer_list.html"
    context_object_name = 'customer_list'
    # attributes for search form
    search_first_name = ''
    search_last_name = ''

    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super(CustomerList, self).get_context_data(**kwargs)
        # add values fetched from form to context to redisplay
        context['search_first_name'] = self.search_first_name
        context['search_last_name'] = self.search_last_name
        return context

    def get(self, request, *args, **kwargs):
        #get values for search from form
        self.search_first_name = request.GET.get('search_first_name', '')
        self.search_last_name = request.GET.get('search_last_name', '')
        return super(CustomerList, self).get(request, *args, **kwargs)

    def get_queryset(self):
        # define an empty search pattern
        where_filter = Q()

        # if filter added on first name add it to query set
        if self.search_first_name:
            where_filter &= Q(first_name__icontains=self.search_first_name)

        #if filter added on last name add it to query set
        if self.search_last_name:
            where_filter &= Q(last_name__icontains=self.search_last_name)

        #find objects matching any filter and order them
        objects = Customer.objects.filter(where_filter).order_by('last_name')
        return objects

# Get Quotes matching a search
# this extends the mix in for login required rather than the @ method as that doesn't work for ListViews
class QuoteList(LoginRequiredMixin, ListView):

    template_name = "quote_list.html"
    context_object_name = 'quote_list'
    # attributes for search form
    quoteSearchForm = QuoteSearchForm()

    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super(QuoteList, self).get_context_data(**kwargs)
        # add values fetched from form to context to redisplay
        context['quoteSearchForm'] = self.quoteSearchForm
        return context

    def get(self, request, *args, **kwargs):
        #get values for search from form
        self.quoteSearchForm = QuoteSearchForm(request.GET)
        return super(QuoteList, self).get(request, *args, **kwargs)

    def get_queryset(self):
        # define an empty search pattern
        where_filter = Q()

        # if filter added on quote_desc add it to query set
        if self.quoteSearchForm.is_valid():
            search_frame = self.quoteSearchForm.cleaned_data['search_frame']
            search_quote_desc = self.quoteSearchForm.cleaned_data['search_quote_desc']
            search_user = self.quoteSearchForm.cleaned_data['search_user']
            if search_frame:
                where_filter &= Q(frame__exact=search_frame)
            if search_quote_desc:
                where_filter &= Q(quote_desc__icontains=search_quote_desc)
            if search_user:
                where_filter &= Q(created_by__exact=search_user)

        #find objects matching any filter and order them
        objects = Quote.objects.filter(where_filter)
        return objects

# Get Quotes matching a search
# this extends the mix in for login required rather than the @ method as that doesn'twork for ListViews
class MyQuoteList(LoginRequiredMixin, ListView):
    template_name = "quote_list.html"
    context_object_name = 'quote_list'
    # attributes for search form
    quoteSearchForm = MyQuoteSearchForm()


    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super(MyQuoteList, self).get_context_data(**kwargs)

        context['quoteSearchForm'] = self.quoteSearchForm
        return context

    def get(self, request, *args, **kwargs):
        #get values for search from form
        self.quoteSearchForm = MyQuoteSearchForm(request.GET)
        return super(MyQuoteList, self).get(request, *args, **kwargs)

    def get_queryset(self):
        # define an empty search pattern
        where_filter = Q()

        # if filter added on quote_desc add it to query set
        if self.quoteSearchForm.is_valid():
            search_frame = self.quoteSearchForm.cleaned_data['search_frame']
            search_quote_desc = self.quoteSearchForm.cleaned_data['search_quote_desc']
            search_user = self.request.user
            if search_frame:
                where_filter &= Q(frame__exact=search_frame)
            if search_quote_desc:
                where_filter &= Q(quote_desc__icontains=search_quote_desc)
            if search_user:
                where_filter &= Q(created_by__exact=search_user)

        #find objects matching any filter and order them
        objects = Quote.objects.filter(where_filter)
        return objects

# QUote list with search form
@login_required
def my_quote_list(request):
    if request.method == "POST":
        # shouldn't be here
        return QuoteList.as_view()
    else:
        data_dict = {}
        data_dict["search_user"] = request.user.pk
        quoteSearchForm = QuoteSearchForm(data_dict)
        quote_list = Quote.objects.filter(created_by=request.user)
        paginator = Paginator(quote_list, 10) # Show 10 contacts per page
        return render(request, 'epic/quote_list.html', {'quote_list': paginator.page(1),'quoteSearchForm': quoteSearchForm})

@login_required
def add_customer(request):

    if request.method == "POST":
        # new customer to be added
        customerForm = CustomerForm(request.POST)
        if customerForm.is_valid():

            newCustomer = customerForm.save()
            addressFormSet = AddressFormSet(request.POST, request.FILES, newCustomer)
            phoneFormSet = PhoneFormSet(request.POST, request.FILES, newCustomer)
            fittingFormSet = FittingFormSet(request.POST, request.FILES, newCustomer)
            customerQuoteForm = CustomerQuoteForm(request.POST, prefix='new')
            if  addressFormSet.is_valid():
                addressFormSet.save()
            if phoneFormSet.is_valid():
                phoneFormSet.save()
            if fittingFormSet.is_valid():
                fittingFormSet.save()
            if customerQuoteForm.has_changed():
                if customerQuoteForm.is_valid():
                    quote = createCustomerQuote(newCustomer, customerQuoteForm, request.user)
                    if quote.quote_type == BIKE:
                        return HttpResponseRedirect(reverse('quote_edit_bike', args=(quote.id,)))
                    else:
                        return HttpResponseRedirect(reverse('quote_edit_simple', args=(quote.id,)))
            return HttpResponseRedirect(reverse('edit_customer', args=(newCustomer.id,)))

    else:
        addressFormSet = AddressFormSet()
        phoneFormSet = PhoneFormSet()
        fittingFormSet = FittingFormSet()
        customerQuoteForm = CustomerQuoteForm(prefix='new')

    return render(request, 'epic/maintain_customer.html', {'customerForm': CustomerForm(),'addressFormSet': addressFormSet, 'phoneFormSet': phoneFormSet, 'fittingFormSet':fittingFormSet,'customerQuoteForm':customerQuoteForm})

@login_required
def edit_customer(request, pk):
    customer = get_object_or_404(Customer, pk=pk)
    if request.method == "POST":
        customerForm = ChangeCustomerForm(request.POST,instance=customer)
        addressFormSet = AddressFormSet(request.POST, request.FILES, instance=customer)
        phoneFormSet = PhoneFormSet(request.POST, request.FILES, instance=customer)
        fittingFormSet = FittingFormSet(request.POST, request.FILES, instance=customer)
        customerQuoteForm = CustomerQuoteForm(request.POST, prefix='new')

        if customerForm.is_valid():

            customerForm.save()
            createCustomerNote(request, customer, None, None)
            if  addressFormSet.is_valid():
                addressFormSet.save()
                addressFormSet = AddressFormSet(instance=customer)
            if phoneFormSet.is_valid():
                phoneFormSet.save()
                phoneFormSet = PhoneFormSet(instance=customer)
            if fittingFormSet.is_valid():
                fittingFormSet.save()
                fittingFormSet = FittingFormSet(instance=customer)
            if customerQuoteForm.has_changed():
                if customerQuoteForm.is_valid():
                    createCustomerQuote(customer, customerQuoteForm, request.user)
                    customerQuoteForm = CustomerQuoteForm(prefix='new')
    else:
        addressFormSet = AddressFormSet(instance=customer)
        phoneFormSet = PhoneFormSet(instance=customer)
        fittingFormSet = FittingFormSet(instance=customer)
        customerQuoteForm = CustomerQuoteForm(prefix='new')

    existingQuotes = Quote.objects.filter(customer=customer)
    return render(request, 'epic/maintain_customer.html', {'customer':customer,'customerForm': ChangeCustomerForm(instance=customer),'addressFormSet': addressFormSet, 'phoneFormSet': phoneFormSet,'fittingFormSet':fittingFormSet, 'customerQuoteForm':customerQuoteForm, 'existingQuotes':existingQuotes})

# popup with all notes relating to a customer

def view_customer_notes(request, pk):
    customer = get_object_or_404(Customer, pk=pk)
    customerNotes = CustomerNote.objects.filter(customer=customer)
    return render(request, 'epic/view_notes.html', {'customer':customer,'customerNotes': customerNotes})

#Add a new quote - display basic form and when saved make a new quote
@login_required
def add_quote(request):

    if request.method == "POST":
        # new customer to be added
        quoteForm = QuoteForm(request.POST)
        if quoteForm.is_valid():
            try:
                newQuote = quoteForm.save()
                newQuote.created_by = request.user
                newQuote.save()
                createCustomerNote(request, newQuote.customer, newQuote, None)
            except Exception as e:
                logging.getLogger("error_logger").exception('Quote could not be saved' )
                return render(request, "epic/quote_start.html", {'quoteForm': quoteForm})

            if newQuote.quote_type == BIKE:
                # display the bike based quote edit page
                return HttpResponseRedirect(reverse('quote_edit_bike', args=(newQuote.id,)))
            else:
                # display the simple quote edit page
                return HttpResponseRedirect(reverse('quote_edit_simple', args=(newQuote.id,)))

        else:
            logging.getLogger("error_logger").error(quoteForm.errors.as_json())
            return render(request, "epic/quote_start.html", {'quoteForm': quoteForm})

        # Do something. Should generally end with a redirect. For example:
        return render(request, "epic/quote_start.html", quoteForm)
    quoteForm = QuoteForm()
    return render(request, 'epic/quote_start.html', {'quoteForm': quoteForm})

# create and order from a quote
@login_required
def quote_order(request, pk):
    return render(request, 'epic/quote_start.html', {'quoteForm': quoteForm})

#create a new quote based on an existing quote
@login_required
def copy_quote(request, pk):
    if request.method == "POST":
        # shouldnt be here!
        messages.info(request,'Invalid action ')
    else:
        # get the quote you are basing it on and create a copy_quote
        old_quote = get_object_or_404(Quote, pk=pk)
        quote_same_name = Quote.objects.filter(customer=old_quote.customer,quote_desc=old_quote.quote_desc).count()
        # copy quote details
        new_quote = old_quote
        new_quote.pk = None
        new_quote.version  = quote_same_name + 1
        new_quote.created_by = request.user
        new_quote.save()

        # update old quote to archived
        #old_quote.quote_status = ARCHIVED
        #old_quote.save()

        # get parts from old quote and copy across to new_quote
        old_quoteParts = QuotePart.objects.filter(quote=old_quote)

        if new_quote.quote_type == BIKE:
            new_quoteParts = QuotePart.objects.filter(quote=new_quote)
            line_count = len(new_quoteParts)
            # replicate the changes from the first quote
            for old_quotePart in old_quoteParts:
                try:
                    new_quotePart = new_quoteParts.get(quote=new_quote, partType=old_quotePart.partType)
                    # already have a part of this type update it to reflect this one
                    new_quotePart.part = old_quotePart.part
                    new_quotePart.quantity = old_quotePart.quantity
                    new_quotePart.cost_price = old_quotePart.cost_price
                    new_quotePart.sell_price = old_quotePart.sell_price
                    new_quotePart.save()
                except MultipleObjectsReturned :
                    messages.info(request,'Could not copy details for part: ' + old_quotePart.partType)
                except ObjectDoesNotExist:
                    line_count = line_count + 1
                    new_quotePart = old_quotePart
                    new_quotePart.quote = new_quote
                    new_quotePart.pk = None
                    new_quotePart.frame_part = None
                    new_quotePart.line = line_count
                    new_quotePart.save()
            # display the bike based quote edit page
            return HttpResponseRedirect(reverse('quote_edit_bike', args=(new_quote.id,)))
        else:
            # replicate items on first quote
            for old_quotePart in old_quoteParts:
                new_quotePart = old_quotePart
                new_quotePart.pk = None
                new_quotePart.quote = new_quote
                new_quotePart.save()
            # display the simple quote edit page
            return HttpResponseRedirect(reverse('quote_edit_simple', args=(new_quote.id,)))

# re-open and issued quote
@login_required
def quote_requote(request, pk):
    if request.method == "POST":
        # shouldnt be here!
        messages.info(request,'Invalid action ')
    else:
        # get the quote you are basing it on and create a copy_quote
        quote = get_object_or_404(Quote, pk=pk)
        quote.requote()
        if (quote.quote_status == INITIAL):
            if quote.quote_type == BIKE:
                # display the bike based quote edit page
                messages.error(request,'Quote needs prices before it can be issued')
                return HttpResponseRedirect(reverse('quote_edit_bike', args=(quote.id,)))
            else:
                # display the simple quote edit page
                messages.error(request,'Quote needs prices before it can be issued')
                return HttpResponseRedirect(reverse('quote_edit_simple', args=(quote.id,)))
        else:
            messages.error(request,'Quote cannot be edited' + str(quote))
            return HttpResponseRedirect(reverse('quotes'))
    # default return
    return HttpResponseRedirect(reverse('quotes'))

# finalise a quote by issuing it
@login_required
def quote_issue(request, pk):
    if request.method == "POST":
        # shouldnt be here!
        messages.info(request,'Invalid action ')
    else:
        # get the quote you are basing it on and create a copy_quote
        quote = get_object_or_404(Quote, pk=pk)
        quote.issue()
        if (quote.quote_status == ISSUED):
            if quote.quote_type == BIKE:
                return render(request, 'epic/quote_issued_bike.html', {'quote': quote, 'quoteSections':quotePartsForBikeDisplay(quote)})
            else:
                return render(request, 'epic/quote_issued_simple.html', {'quote': quote, 'quoteDetails':quotePartsForSimpleDisplay(quote)})
        elif (quote.quote_status == INITIAL):
            if quote.quote_type == BIKE:
                # display the bike based quote edit page
                messages.error(request,'Quote needs prices before it can be issued')
                return HttpResponseRedirect(reverse('quote_edit_bike', args=(quote.id,)))
            else:
                # display the simple quote edit page
                messages.error(request,'Quote needs prices before it can be issued')
                return HttpResponseRedirect(reverse('quote_edit_simple', args=(quote.id,)))
        else:
            messages.error(request,'Quote cannot be Issued or edited' + str(quote))
            return HttpResponseRedirect(reverse('quotes'))
    # default return
    return HttpResponseRedirect(reverse('quotes'))

@login_required
# edit a quote based on a specific frame
def quote_edit_bike(request, pk):
    quote = get_object_or_404(Quote, pk=pk)
    quote_page = 'epic/quote_edit_bike.html'
    customerFittings = Fitting.objects.filter(customer=quote.customer)
    customerNotes = CustomerNote.objects.filter(quote=quote)
    if request.method == "POST":
        # get back the form from the page to save changes
        quoteForm = QuoteBikeForm(request.POST,instance=quote)
        quoteSimpleAddPart = QuoteSimpleAddPartForm(request.POST)
        fittingForm = QuoteFittingForm(request.POST,prefix='fitting')

        if quoteForm.is_valid():
            quote = quoteForm.save()
            createCustomerNote(request, quote.customer, quote, None)
            customerNotes = CustomerNote.objects.filter(quote=quote)

            quotePartObjects = QuotePart.objects.filter(quote=quote)
            for quotePart in quotePartObjects:
                quoteBikeChangePartForm = QuoteBikeChangePartForm(request.POST, request.FILES, prefix="QP"+str(quotePart.id))
                if  quoteBikeChangePartForm.is_valid():
                    updateQuotePartFromForm(quotePart, quoteBikeChangePartForm, request)
                else:
                    # quote part formset not valid
                    messages.error(request,'Part failed validation' + str(quotePart))
                    return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote),'quote': quote,'quoteSections': getQuoteSectionPartsAndForms(quote), 'fittingForm': fittingForm, 'customerFittings':customerFittings,'quoteSimpleAddPart': quoteSimpleAddPart,'customerNotes':customerNotes})

            # get attributes updated for quote
            saveQuotePartAttributes(quote, request)

            if  quoteSimpleAddPart.is_valid():
                part = validateAndCreatePart(quoteSimpleAddPart, request)
                if part != None:
                    quote_line = len(quoteParts) + 1
                    createQuotePart(quoteSimpleAddPart, quote.pk, part.pk, quote_line)
            else:
                # quoteSimpleAddPart not valid
                messages.error(request,'New Part failed validation')
                return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote),'quote': quote, 'quoteSections': getQuoteSectionPartsAndForms(quote), 'fittingForm': fittingForm, 'customerFittings':customerFittings,'quoteSimpleAddPart': quoteSimpleAddPart,'customerNotes':customerNotes})

            if fittingForm.has_changed():
                if fittingForm.is_valid():
                    fitting = createFitting(quote.customer, fittingForm)

                    # update the fitting value on the quote and re-save
                    quote.fitting = fitting
                    quote.save()
                    customerFittings = Fitting.objects.filter(customer=quote.customer)
                    fittingForm = QuoteFittingForm(prefix='fitting')

                else:
                    # fittingForm not valid
                    logging.getLogger("error_logger").error(fittingForm.errors.as_json())
                    messages.error(request,'Fitting form failed validation')
                    return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote),'quote': quote,'quoteSections': getQuoteSectionPartsAndForms(quote), 'fittingForm': fittingForm, 'customerFittings':customerFittings,'quoteSimpleAddPart': quoteSimpleAddPart,'customerNotes':customerNotes})
            else:
                # get the currently selected fitting and add it to the quote.
                id_fitting = request.POST.get('id_fitting',None)
                if id_fitting != None:
                    fitting = Fitting.objects.get(pk=id_fitting)
                    # update the fitting value on the quote and re-save
                    quote.fitting = fitting
                    quote.save()

            old_sell_price = quote.sell_price
            quote.recalculate_prices()
            # if sell price has changed blank keyed value
            if old_sell_price != quote.sell_price:
                quote.keyed_sell_price = None
                quote.save()

            # Do something. Should generally end with a redirect. For example:
            return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote),'quote': quote,'quoteSections': getQuoteSectionPartsAndForms(quote), 'fittingForm': fittingForm, 'customerFittings':customerFittings,'quoteSimpleAddPart': QuoteSimpleAddPartForm(empty_permitted=True),'customerNotes':customerNotes})
        else:
            # quoteForm not valid
            logging.getLogger("error_logger").error(quoteForm.errors.as_json())
            return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote),'quote': quote,'quoteSections': getQuoteSectionPartsAndForms(quote), 'fittingForm': fittingForm, 'customerFittings':customerFittings,'quoteSimpleAddPart': quoteSimpleAddPart,'customerNotes':customerNotes})
    else:
        quoteSimpleAddPart = QuoteSimpleAddPartForm(empty_permitted=True)
        fittingForm = QuoteFittingForm(prefix='fitting')
        return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote),'quote': quote,'quoteSections': getQuoteSectionPartsAndForms(quote), 'fittingForm': fittingForm, 'customerFittings':customerFittings,'quoteSimpleAddPart': quoteSimpleAddPart,'customerNotes':customerNotes})

#
@login_required
# edit a quote based on a specific frame
def quote_edit_simple(request, pk):
    quote = get_object_or_404(Quote, pk=pk)
    quote.recalculate_prices()
    customer = quote.customer
    old_sell_price = 0 + quote.sell_price
    customerNotes = CustomerNote.objects.filter(quote=quote)
    quote_page = 'epic/quote_edit_simple.html'
    if request.method == "POST":
        # get back the form from the page to save changes
        quoteForm = QuoteSimpleForm(request.POST,instance=quote)

        #get quote parts as they existed before update
        quoteParts = QuotePart.objects.filter(quote=quote)
        quotePartForms = []

        #get back all the quote part forms from the page
        for quotePart in quoteParts:
            quotePartForm = QuotePartForm(request.POST, request.FILES, instance=quotePart,prefix="QP"+str(quotePart.id))
            quotePartForms.append(quotePartForm)

        zipped_values = zip(quoteParts, quotePartForms)
        quoteSimpleAddPart = QuoteSimpleAddPartForm(request.POST)
        if quoteForm.is_valid():
            quote = quoteForm.save()
            createCustomerNote(request, quote.customer, quote, None)
            customerNotes = CustomerNote.objects.filter(quote=quote)

            for quotePartForm in quotePartForms:
                if  quotePartForm.is_valid():
                    quotePartForm.save()
                else:
                    # quote part formset not valid
                    messages.error(request,'Part failed validation' + str(quotePart))
                    return render(request, quote_page, {'quoteForm': QuoteSimpleForm(instance=quote), 'quote': quote,'quoteSimpleAddPart': quoteSimpleAddPart,'zipped_values': zipped_values,'customerNotes':customerNotes})


            if  quoteSimpleAddPart.is_valid():
                part = validateAndCreatePart(quoteSimpleAddPart,request)
                if part != None:
                    quote_line = len(quoteParts) + 1
                    createQuotePart(quoteSimpleAddPart, quote.pk, part.pk, quote_line)
            else:
                # quoteSimpleAddPart not valid
                return render(request, quote_page, {'quoteForm': QuoteSimpleForm(instance=quote), 'quote': quote,'quoteSimpleAddPart': quoteSimpleAddPart,'zipped_values': zipped_values,'customerNotes':customerNotes})


            # save all ok get new simple part and refresh items

            for quotePart in quoteParts:
                #delete any quote parts no longer required.
                if quotePart.quantity == 0:
                    quotePart.delete()

            # get attributes updated for quote
            saveQuotePartAttributes(quote, request)

            quote.recalculate_prices()
            # if sell price has changed blank keyed value
            if old_sell_price != quote.sell_price:
                quote.keyed_sell_price = None
                quote.save()
            quoteSimpleAddPart = QuoteSimpleAddPartForm(empty_permitted=True)
            return render(request, quote_page, {'quoteForm': QuoteSimpleForm(instance=quote),'quote': quote,'quoteSimpleAddPart': quoteSimpleAddPart,'zipped_values': getQuotePartsAndForms(quote),'customerNotes':customerNotes})

        #quote form not valid
        else:
            logging.getLogger("error_logger").error(quoteForm.errors.as_json())
            return render(request, quote_page, {'quoteForm': QuoteSimpleForm(instance=quote), 'quote': quote,'quoteSimpleAddPart': quoteSimpleAddPart,'zipped_values': zipped_values,'customerNotes':customerNotes})

        # Do something. Should generally end with a redirect. For example:
        quoteSimpleAddPart = QuoteSimpleAddPartForm(empty_permitted=True)
        return render(request, quote_page, {'quoteForm': QuoteSimpleForm(instance=quote),'quote': quote,'quoteSimpleAddPart': quoteSimpleAddPart,'zipped_values': getQuotePartsAndForms(quote),'customerNotes':customerNotes})
    else:
        quoteSimpleAddPart = QuoteSimpleAddPartForm(empty_permitted=True)
        return render(request, quote_page, {'quoteForm': QuoteSimpleForm(instance=quote),'quote': quote,'quoteSimpleAddPart': quoteSimpleAddPart,'zipped_values': getQuotePartsAndForms(quote),'customerNotes':customerNotes})

@login_required
# based on code in http://thepythondjango.com/upload-process-csv-file-django/
def bike_upload(request):
    # create a dummy data field (could pass data here)
    data = {}
    if "GET" == request.method:
        return render(request, "epic/bike_upload.html", data)

    # if not GET, then proceed
    try:
        brand_name = request.POST.get('brand_name', '')
        try:
            bike_brand = Brand.objects.get(brand_name=str(brand_name).strip())
        except MultipleObjectsReturned :
            messages.error(request,'Brand Not unique - use Admin function to enure Brands are unique: ' + brand_name)
            return render(request, "epic/bike_upload.html", data)
        except ObjectDoesNotExist:
            messages.error(request,'Brand Not found: ' + brand_name)
            return render(request, "epic/bike_upload.html", data)

        bike_name = request.POST.get('bike_name', '')

        csv_file = request.FILES["csv_file"]

        if not csv_file.name.endswith('.csv'):
            messages.error(request,'File is not CSV type')
            return render(request, "epic/bike_upload.html", data)

        #if file is too large, return
        if csv_file.multiple_chunks():
            messages.error(request,"Uploaded file is too big (%.2f MB)." % (csv_file.size/(1000*1000),))
            return render(request, "epic/bike_upload.html", data)

        file_data = csv_file.read().decode("utf-8")

        #split the file into lines
        lines = file_data.split("\n")

        frames = []
        # get non web brands to look for part brands
        non_web_brands = Brand.objects.all()

        #loop over the lines and save them in db. If error , store as string and then display
        for i in range(len(lines)):
            if i == 0:
                #  first line is the ModelAdmin
                model_names = lines[i].split(",")
                for j in range(len(model_names)):
                    if j == 0:
                        frames.append("not a frame")
                    else:
                        model_name = model_names[j]
                        data_dict = {}
                        data_dict["brand"] = bike_brand.pk
                        data_dict["frame_name"] = bike_name
                        data_dict["model"] = model_name
                        try:
                            form = FrameForm(data_dict)
                            if form.is_valid():
                                frame = form.save()
                                frames.append(frame)
                            else:
                                logging.getLogger("error_logger").error(form.errors.as_json())
                                return render(request, "epic/bike_upload.html", data)
                        except Exception as e:
                            logging.getLogger("error_logger").error(form.errors.as_json())
                            return render(request, "epic/bike_upload.html", data)
            else:
                # attribute line
                attributes = lines[i].split(",")
                # get the partType for the lilne
                # this is the part name - look it up - fail if not found
                try:
                    shortName = str(attributes[0]).strip()
                    partType = PartType.objects.get(shortName=shortName)
                except MultipleObjectsReturned :
                    messages.error(request,'PartType Not unique - use Admin function to enure PartTypes are unique: ' + attributes[0])
                    return render(request, "epic/bike_upload.html", data)
                except ObjectDoesNotExist:
                    messages.error(request,'PartType Not found' + attributes[0])
                    return render(request, "epic/bike_upload.html", data)

                for j in range(len(attributes)):
                    #ignore the first column - already used
                    if j > 0:
                        # look for brand for part attributes
                        part_name = str(attributes[j]).strip()
                        if len(part_name) > 0:
                            part_brand = findBrandForString(part_name, non_web_brands, bike_brand, request)

                            # take the brand name out of the part name
                            part_name = part_name.strip(part_brand.brand_name)
                            part_name = part_name.strip()

                            #now look to see if Part exists, if not add it
                            part_possibles = Part.objects.filter(partType=partType,brand=part_brand,part_name=part_name)
                            if len(part_possibles) == 0:
                                # create a new one and add it
                                data_dict = {}
                                data_dict["brand"] = part_brand.pk
                                data_dict["partType"] = partType.pk
                                data_dict["part_name"] = part_name
                                try:
                                    form = PartForm(data_dict)
                                    if form.is_valid():
                                        new_part = form.save()
                                        part_possibles = Part.objects.filter(partType=partType,brand=part_brand,part_name=part_name)
                                    else:
                                        messages.error(request,'Part save failed')
                                        logging.getLogger("error_logger").error(form.errors.as_json())
                                        return render(request, "epic/bike_upload.html", data)
                                except Exception as e:
                                    logging.getLogger("error_logger").error(form.errors.as_json())
                                    return render(request, "epic/bike_upload.html", data)

                            data_dict = {}
                            data_dict["frame"] = frames[j].pk
                            data_dict["part"] = part_possibles[0].pk
                            try:
                                form = FramePartForm(data_dict)
                                if form.is_valid():
                                    form.save()
                                else:
                                    logging.getLogger("error_logger").error(form.errors.as_json())
                                    return render(request, "epic/bike_upload.html", data)
                            except Exception as e:
                                logging.getLogger("error_logger").error(form.errors.as_json())
                                return render(request, "epic/bike_upload.html", data)

        messages.add_message(request, messages.INFO, 'Bike added:' + bike_name)
    except Exception as e:
        logging.getLogger("error_logger").error("Unable to upload file. "+repr(e))
        messages.error(request,"Unable to upload file. "+repr(e))
        return render(request, "epic/bike_upload.html", data)
    return quote_menu(request)

def logout_view(request):
    logout(request)
    # Redirect to a success page.

# simple display ofsections
def quotePartsForSimpleDisplay(quote):
    quotePartObjects = QuotePart.objects.filter(quote=quote)
    quotePartDetails = []
    for quotePart in quotePartObjects:
        quotePartDetails.append(QuotePartAttribute.objects.filter(quotePart=quotePart))
    # build a merged array
    zipped_values = zip(quotePartObjects, quotePartDetails)
    return zipped_values

# simple display ofsections
def quotePartsForBikeDisplay(quote):
    partSections = PartSection.objects.all()
    partSectionDetails = []

    for partSection in partSections:
        quoteParts = []
        quotePartDetails = []
        partTypes = PartType.objects.filter(includeInSection=partSection)
        for partType in partTypes:
            quotePartObjects = QuotePart.objects.filter(quote=quote,partType=partType)
            for quotePart in quotePartObjects:
                quoteParts.append(quotePart)
                quotePartDetails.append(QuotePartAttribute.objects.filter(quotePart=quotePart))
        partSectionDetails.append(zip(quoteParts,quotePartDetails))
    # build a merged array
    zipped_values = zip(partSections, partSectionDetails)
    return zipped_values

# build arrays for bike quote
def getQuoteSectionPartsAndForms(quote):
    partSections = PartSection.objects.all()
    partContents = []
    for partSection in partSections:
        partTypes = PartType.objects.filter(includeInSection=partSection)
        sectionParts = []
        sectionForms = []
        for partType in partTypes:
            quotePartObjects = QuotePart.objects.filter(quote=quote,partType=partType)
            for quotePart in quotePartObjects:
                quotePartDetails = []
                quotePartDetails.append(quotePart)
                quotePartAttributes = QuotePartAttribute.objects.filter(quotePart=quotePart)
                quotePartAttributeForms = []
                for quotePartAttribute in quotePartAttributes:
                    quotePartAttributeForms.append(QuotePartAttributeForm(initial={'attribute_name':str(quotePartAttribute.partTypeAttribute),'attribute_value':quotePartAttribute.attribute_value},prefix="QPA"+str(quotePartAttribute.id)))
                quotePartDetails.append(quotePartAttributeForms)
                sectionParts.append(quotePartDetails)
                if quotePart.part == None:
                    if (quotePart.frame_part != None):
                        sectionForms.append(QuoteBikeChangePartForm(initial={'not_required':True},prefix="QP"+str(quotePart.id)))
                    else:
                        sectionForms.append(QuoteBikeChangePartForm(prefix="QP"+str(quotePart.id)))
                elif (quotePart.frame_part != None) and (quotePart.part == quotePart.frame_part.part):
                    sectionForms.append(QuoteBikeChangePartForm(prefix="QP"+str(quotePart.id)))
                else:
                    new_brand = quotePart.part.brand.brand_name
                    new_part_name = quotePart.part.part_name
                    new_quantity = quotePart.quantity
                    new_cost_price = quotePart.cost_price
                    new_sell_price = quotePart.sell_price
                    sectionForms.append(QuoteBikeChangePartForm(initial={'new_brand':new_brand,'new_part_name':new_part_name,'new_quantity':new_quantity,'new_cost_price':new_cost_price,'new_sell_price':new_sell_price},prefix="QP"+str(quotePart.id)))

        zipped_parts = zip(sectionParts, sectionForms)
        partContents.append(zipped_parts)
    return zip(partSections,partContents)

# build array of quote parts for use on simple quote screen
def getQuotePartsAndForms(quote):
    quoteParts = []
    quotePartForms = []
    quotePartObjects = QuotePart.objects.filter(quote=quote)
    for quotePart in quotePartObjects:
        quotePartDetails = []
        quotePartDetails.append(quotePart)
        quotePartAttributes = QuotePartAttribute.objects.filter(quotePart=quotePart)
        quotePartAttributeForms = []
        for quotePartAttribute in quotePartAttributes:
            quotePartAttributeForms.append(QuotePartAttributeForm(initial={'attribute_name':str(quotePartAttribute.partTypeAttribute),'attribute_value':quotePartAttribute.attribute_value},prefix="QPA"+str(quotePartAttribute.id)))
        quotePartDetails.append(quotePartAttributeForms)
        # now put the combined details into the array
        quoteParts.append(quotePartDetails)
        quotePartForms.append(QuoteBikePartForm(instance=quotePart,prefix="QP"+str(quotePart.id)))

    # build a merged array
    zipped_values = zip(quoteParts, quotePartForms)
    return zipped_values

def findBrandForString(search_string, brand_list, default_brand, request):
    for brand in brand_list:
        check_prefix = str(brand.brand_name).lower()
        if search_string.lower().startswith(check_prefix):
            return brand
    return default_brand

# another try at creating the part
def validateAndCreatePart(form, request):
    if form.cleaned_data['new_partType'] != None:
        brand = form.cleaned_data['new_brand']
        if brand == None:
            #look for a brand matching what has been entered for new_brand_add
            brand_name = form.cleaned_data['new_brand_add']
            brand = findBrandForName(brand_name, request)
            if brand == None:
                return

        partType = form.cleaned_data['new_partType']
        part_name = form.cleaned_data['new_part_name']
        return findOrCreatePart(brand, partType, part_name)

    else:
        return None
# create quote part
def createQuotePart(form, quote_pk, part_pk, quote_line):

        # now add the quote line
        data_dict = {}
        data_dict["quote"] = quote_pk
        data_dict["line"] = quote_line
        data_dict["partType"] = form.cleaned_data['new_partType'].pk
        data_dict["part"] = part_pk
        data_dict["quantity"] = form.cleaned_data['new_quantity']
        data_dict["cost_price"] = form.cleaned_data['new_cost_price']
        data_dict["sell_price"] = form.cleaned_data['new_sell_price']
        form = QuotePartBasicForm(data_dict)
        if form.is_valid():
            new_quotePart = form.save()
        else:
            raise forms.ValidationError('QuotePartBasicForm  save failed')

# create a new quote from form details and customer
def createCustomerQuote(customer, form, user):
    if form.cleaned_data['quote_type'] != '':
        quote_desc = form.cleaned_data['quote_desc']
        quote_type = form.cleaned_data['quote_type']
        frame = form.cleaned_data['frame']
        quote = Quote(customer=customer, quote_desc=quote_desc, quote_type=quote_type, created_by=user)
        quote.save()
        return quote
    else:
        return None

#add a note to with details as specified
def createCustomerNote(request, customer, quote, customerOrder):
    note_type = request.POST.get('note_type', '')
    note_contents = request.POST.get('note_contents', '')

    if note_contents != '':

        note_text = note_contents
        created_by = request.user
        customer_visible = (note_type == "customer")

        customerNote = CustomerNote(customer = customer,quote=quote,customerOrder=customerOrder,note_text=note_text,created_by=created_by,customer_visible=customer_visible)
        customerNote.save()

# create a new fitting object from form details
def createFitting(customer, form):
    if form.cleaned_data['fitting_type'] != None:
        fitting_type = form.cleaned_data['fitting_type']
        saddle_height = form.cleaned_data['saddle_height']
        bar_height = form.cleaned_data['bar_height']
        reach = form.cleaned_data['reach']
        notes = form.cleaned_data['notes']
        fitting = Fitting(customer=customer, fitting_type=fitting_type, saddle_height=saddle_height, bar_height=bar_height, reach=reach, notes=notes)
        fitting.save()
        return fitting
    else:
        return None

# update an existing quote part based on keyed values
def updateQuotePartFromForm(quotePart, form, request):
    not_required = form.cleaned_data['not_required']
    if not_required == True:
        if (quotePart.frame_part == None) and (QuotePart.objects.filter(quote=quotePart.quote, partType=quotePart.partType).count() > 1):
            quotePart.delete()
        else:
            quotePart.part = None
            quotePart.quantity = 0
            quotePart.cost_price = None
            quotePart.sell_price = None
            quotePart.save()
    else:
        brand_name = form.cleaned_data['new_brand']
        quantity = form.cleaned_data['new_quantity']
        if (brand_name == '') or (quantity == 0):
            # values have been removed reset row
            if quotePart.frame_part == None:
                if (QuotePart.objects.filter(quote=quotePart.quote, partType=quotePart.partType).count() > 1):
                    quotePart.delete()
                else:
                    quotePart.part = None
                    quotePart.quantity = 0
                    quotePart.cost_price = None
                    quotePart.sell_price = None
                    quotePart.save()
            else:
                quotePart.part = quotePart.frame_part.part
                quotePart.quantity = 1
                quotePart.cost_price = None
                quotePart.sell_price = None
                quotePart.save()
        else:
            # values have changed
            brand = findBrandForName(brand_name, request)
            partType = quotePart.partType
            part_name = form.cleaned_data['new_part_name']
            part = findOrCreatePart(brand, partType, part_name)
            if part != None:
                quotePart.part = part
                quotePart.quantity = quantity
                quotePart.cost_price = form.cleaned_data['new_cost_price']
                quotePart.sell_price = form.cleaned_data['new_sell_price']
                quotePart.save()

def saveQuotePartAttributes(quote, request):
    quotePartObjects = QuotePart.objects.filter(quote=quote)
    for quotePart in quotePartObjects:
        #get the attributes as they were at the start
        quotePartAttributes = QuotePartAttribute.objects.filter(quotePart=quotePart)
        # refresh any quote parts
        for quotePartAttribute in quotePartAttributes:
            quotePartAttributeForm = QuotePartAttributeForm(request.POST, request.FILES, prefix="QPA"+str(quotePartAttribute.id))
            if quotePartAttributeForm.is_valid():
                if quotePartAttributeForm.cleaned_data['attribute_value'] != quotePartAttribute.attribute_value:
                    quotePartAttribute.attribute_value = quotePartAttributeForm.cleaned_data['attribute_value']
                    quotePartAttribute.save()
            else:
                logging.getLogger("error_logger").error(quotePartAttributeForm.errors.as_json())

# common finr brand
def findBrandForName(brand_name, request):
    try:
        brand = Brand.objects.get(brand_name=str(brand_name).strip())
        return brand
    except MultipleObjectsReturned :
        messages.error(request,'Brand Not unique - use Admin function to ensure Brands are unique: ' + brand_name)
        return None
    except ObjectDoesNotExist:
        # create a new Brand
        brand = Brand(brand_name=brand_name)
        brand.save()
        return brand

# given values try and create a part
def findOrCreatePart(brand, partType, part_name):
    part_possibles = Part.objects.filter(partType=partType,brand=brand,part_name=part_name)
    if len(part_possibles) == 0:
        # create a new one and add it
        data_dict = {}
        data_dict["brand"] = brand.pk
        data_dict["partType"] = partType.pk
        data_dict["part_name"] = part_name
        form = PartForm(data_dict)
        if form.is_valid():
            return form.save()
        else:
            raise forms.ValidationError('Part not valid: Brand:' + str(brand) + ', part type:' + str(partType) + ', part name:' + str(part_name))
    else:
        return part_possibles[0]
