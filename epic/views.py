from django.http import HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import get_object_or_404, render
from django.views.generic.list import ListView
from django.db.models import Q
from django.shortcuts import render
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

    paginate_by = 20

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

# Get QUotes matching a search
# this extends the mix in for login required rather than the @ method as that doesn'twork for ListViews
class QuoteList(LoginRequiredMixin, ListView):

    template_name = "quote_list.html"
    context_object_name = 'quote_list'
    # attributes for search form
    search_quote_desc = ''

    paginate_by = 20

    def get_context_data(self, **kwargs):
        context = super(QuoteList, self).get_context_data(**kwargs)
        # add values fetched from form to context to redisplay
        context['search_quote_desc'] = self.search_quote_desc
        return context

    def get(self, request, *args, **kwargs):
        #get values for search from form
        self.search_quote_desc = request.GET.get('search_quote_desc', '')
        return super(QuoteList, self).get(request, *args, **kwargs)

    def get_queryset(self):
        # define an empty search pattern
        where_filter = Q()

        # if filter added on quote_desc add it to query set
        if self.search_quote_desc:
            where_filter &= Q(quote_desc__icontains=self.search_quote_desc)

        #find objects matching any filter and order them
        objects = Quote.objects.filter(where_filter)
        return objects

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
            if  addressFormSet.is_valid():
                addressFormSet.save()
            if phoneFormSet.is_valid():
                phoneFormSet.save()
            if fittingFormSet.is_valid():
                fittingFormSet.save()

            # Do something. Should generally end with a redirect. For example:
            #return HttpResponseRedirect(success_url)
            return HttpResponseRedirect(reverse('quote_menu'))
    else:
        addressFormSet = AddressFormSet()
        phoneFormSet = PhoneFormSet()
        fittingFormSet = FittingFormSet()
    return render(request, 'epic/maintain_customer.html', {'customerForm': CustomerForm(),'addressFormSet': addressFormSet, 'phoneFormSet': phoneFormSet, 'fittingFormSet':fittingFormSet})

@login_required
def edit_customer(request, pk):
    customer = get_object_or_404(Customer, pk=pk)
    if request.method == "POST":
        customerForm = ChangeCustomerForm(request.POST,instance=customer)
        addressFormSet = AddressFormSet(request.POST, request.FILES, instance=customer)
        phoneFormSet = PhoneFormSet(request.POST, request.FILES, instance=customer)
        fittingFormSet = FittingFormSet(request.POST, request.FILES, instance=customer)

        if customerForm.is_valid():

            customerForm.save()
            if  addressFormSet.is_valid():
                addressFormSet.save()
            if phoneFormSet.is_valid():
                phoneFormSet.save()
            if fittingFormSet.is_valid():
                fittingFormSet.save()

            messages.info(request,'Customer changes saved. ')
    else:
        addressFormSet = AddressFormSet(instance=customer)
        phoneFormSet = PhoneFormSet(instance=customer)
        fittingFormSet = FittingFormSet(instance=customer)
    return render(request, 'epic/maintain_customer.html', {'customerForm': ChangeCustomerForm(instance=customer),'addressFormSet': addressFormSet, 'phoneFormSet': phoneFormSet,'fittingFormSet':fittingFormSet})
#

#incplcomete view for
@login_required
def add_quote(request):

    if request.method == "POST":
        # new customer to be added
        quoteForm = QuoteForm(request.POST)
        if quoteForm.is_valid():

            newQuote = quoteForm.save()
            if newQuote.quote_type == Quote.BIKE:
                # create lines for quote
                quote_line = 0
                partSections = PartSection.objects.all()
                for partSection in partSections:
                    partTypes = PartType.objects.filter(includeInSection=partSection)
                    for partType in partTypes:
                        # add the part typte to the list
                        quote_line +=1
                        data_dict = {}
                        data_dict["quote"] = newQuote.pk
                        data_dict["line"] = quote_line
                        data_dict["partType"] = partType.pk
                        try:
                            form = QuoteBikePartForm(data_dict)
                            if form.is_valid():
                                frame = form.save()
                            else:
                                logging.getLogger("error_logger").error(quoteForm.errors.as_json())
                                return render(request, "epic/quote_start.html", {'quoteForm': quoteForm})
                        except Exception as e:
                            logging.getLogger("error_logger").error(quoteForm.errors.as_json())
                            return render(request, "epic/quote_start.html", {'quoteForm': quoteForm})
                # now add frame specific parts
                frameParts = FramePart.objects.filter(frame=newQuote.frame)
                for framePart in frameParts:
                    try:
                        quotePart = QuotePart.objects.get(quote=newQuote,partType=framePart.partType)
                        try:
                            form = QuoteBikePartForm(instance=quotePart)
                            form.part = framePart.part
                            form.frame_part = framePart
                            if form.is_valid():
                                frame = form.save()
                            else:
                                logging.getLogger("error_logger").error(quoteForm.errors.as_json())
                                return render(request, "epic/quote_start.html", {'quoteForm': quoteForm})
                        except Exception as e:
                            logging.getLogger("error_logger").error(quoteForm.errors.as_json())
                            return render(request, "epic/quote_start.html", {'quoteForm': quoteForm})
                    except MultipleObjectsReturned :
                        messages.error(request,'Bike has multiple options for Part Type: ' + framePart.partType)
                        return render(request, "epic/quote_start.html", {'quoteForm': quoteForm})
                    except ObjectDoesNotExist:
                        # this is fine bike may just not have this part
                        pass
                # display the bike based quote edit page
                quoteBikePartFormSet = QuoteBikePartFormSet(instance=newQuote)
                if quote.fitting == None:
                    fittingForm = QuoteFittingForm()
                else:
                    fittingForm = QuoteFittingForm(instance=quote.fitting)
                return render(request, 'epic/quote_edit_bike.html', {'quoteForm': QuoteBikeForm(instance=newQuote),'quoteBikePartFormSet': quoteBikePartFormSet, 'fittingForm': fittingForm})
            else:
                # display the simple quote edit page
                quotePartFormSet = QuotePartFormSet(instance=newQuote)
                return render(request, 'epic/quote_edit_simple.html', {'quoteForm': QuoteSimpleForm(instance=newQuote),'quotePartFormSet': quotePartFormSet})
        else:
            logging.getLogger("error_logger").error(quoteForm.errors.as_json())
            return render(request, "epic/quote_start.html", {'quoteForm': quoteForm})



        # Do something. Should generally end with a redirect. For example:
        #return HttpResponseRedirect(success_url)
        return render(request, "epic/quote_start.html", quoteForm)
    quoteForm = QuoteForm()
    return render(request, 'epic/quote_start.html', {'quoteForm': quoteForm})


#incplcomete view for
@login_required
def copy_quote(request, pk):
    return HttpResponseRedirect(reverse('quote_menu'))

#incplcomete view for
#incplcomete view for
@login_required
def add_cust_quote(request, pk):
    return HttpResponseRedirect(reverse('quote_menu'))

@login_required
# edit a quote based on a specific frame
def quote_edit_bike(request, pk):
    quote = get_object_or_404(Quote, pk=pk)
    quote_page = 'quote_edit_bike.html'
    if request.method == "POST":
        # new customer to be added
        quoteForm = QuoteForm(request.POST,instance=quote)
        if quoteForm.is_valid():

            quote = quoteForm.save()
            quoteBikePartFormSet = QuoteBikePartFormSet(request.POST, request.FILES, instance=quote)
            if  quoteBikePartFormSet.is_valid():
                quoteBikePartFormSet.save()

            fittingForm = QuoteFittingForm(request.POST)
            if fittingForm.has_changed():
                fittingForm.customer = quote.customer
                if fittingForm.is_valid():
                    fitting = fittingForm.save()

                    # update the fitting value on the quote and re-save
                    quote.fitting = fitting
                    quote = quoteForm.save()

            # Do something. Should generally end with a redirect. For example:
            return render(request, 'epic/quote_edit_bike.html', {'quoteForm': QuoteBikeForm(instance=quote),'quoteBikePartFormSet': quoteBikePartFormSet, 'fittingForm': fittingForm})
    else:
        quoteBikePartFormSet = QuoteBikePartFormSet(instance=quote)
        if quote.fitting == None:
            fittingForm = QuoteFittingForm()
        else:
            fittingForm = QuoteFittingForm(instance=quote.fitting)
        return render(request, 'epic/quote_edit_bike.html', {'quoteForm': QuoteBikeForm(instance=quote),'quoteBikePartFormSet': quoteBikePartFormSet, 'fittingForm': fittingForm})

#
@login_required
# edit a quote based on a specific frame
def quote_edit_simple(request, pk):
    quote = get_object_or_404(Quote, pk=pk)
    quote_page = 'quote_edit_bike.html'
    if request.method == "POST":
        # new customer to be added
        quoteForm = QuoteForm(request.POST,instance=quote)
        if quoteForm.is_valid():

            quote = quoteForm.save()
            quotePartFormSet = QuotePartFormSet(request.POST, request.FILES, instance=quote)
            if  quotePartFormSet.is_valid():
                quotePartFormSet.save()

            # Do something. Should generally end with a redirect. For example:
            return render(request, 'epic/quote_edit_simple.html', {'quoteForm': QuoteSimpleForm(instance=quote),'quotePartFormSet': quotePartFormSet})
    else:
        quotePartFormSet = QuotePartFormSet(instance=quote)
        return render(request, 'epic/quote_edit_simple.html', {'quoteForm': QuoteSimpleForm(instance=quote),'quotePartFormSet': quotePartFormSet})

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

def findBrandForString(search_string, brand_list, default_brand, request):
    for brand in brand_list:
        check_prefix = str(brand.brand_name).lower()
        if search_string.lower().startswith(check_prefix):
            #messages.info(request, 'found ' + check_prefix)
            return brand
    return default_brand
