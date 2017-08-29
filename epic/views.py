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
                frameParts = FramePart.objects.filter(frame=newQuote.frame)

                for partSection in partSections:
                    partTypes = PartType.objects.filter(includeInSection=partSection)
                    for partType in partTypes:
                        # add the part typte to the list
                        quote_line +=1
                        data_dict = {}
                        data_dict["quote"] = newQuote.pk
                        data_dict["line"] = quote_line
                        data_dict["partType"] = partType.pk
                        data_dict["quantity"] = 0

                        # add any parts specified
                        for framePart in frameParts:
                            if framePart.part.partType == partType:
                                data_dict["part"] = framePart.part.pk
                                data_dict["frame_part"] = framePart.pk
                                data_dict["quantity"] = 1
                                data_dict["cost_price"] = 0
                                data_dict["sell_price"] = 0

                        try:
                            form = QuotePartBasicForm(data_dict)
                            if form.is_valid():
                                try:
                                    frame = form.save()
                                except Exception as e:
                                    logging.getLogger("error_logger").exception('Quote add for Part Type failed: ' )
                                    return render(request, "epic/quote_start.html", {'quoteForm': quoteForm})
                            else:
                                logging.getLogger("error_logger").error(form.errors.as_json())
                                return render(request, "epic/quote_start.html", {'quoteForm': quoteForm})
                        except Exception as e:
                            logging.getLogger("error_logger").exception('QUote add for Part Type failed: ' )
                            return render(request, "epic/quote_start.html", {'quoteForm': quoteForm})

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
    quote.recalculate_prices()
    customer = quote.customer
    old_sell_price = 0 + quote.sell_price
    quote_page = 'epic/quote_edit_bike.html'
    if request.method == "POST":
        # get back the form from the page to save changes
        quoteForm = QuoteBikeForm(request.POST,instance=quote)
        quoteSimpleAddPart = QuoteSimpleAddPartForm(request.POST)
        fittingForm = QuoteFittingForm(request.POST)

        #get quote parts as they existed before update
        quoteParts = QuotePart.objects.filter(quote=quote)
        quotePartUpdates = []

        #get back all the quote part forms from the page
        partSections = PartSection.objects.all()
        partContents = []
        for partSection in partSections:
            partTypes = PartType.objects.filter(includeInSection=partSection)
            sectionParts = []
            sectionForms = []
            for partType in partTypes:
                quotePartObjects = QuotePart.objects.filter(quote=quote,partType=partType)
                for quotePart in quotePartObjects:
                    sectionParts.append(quotePart)
                    sectionForm = QuoteBikeChangePartForm(request.POST, request.FILES,prefix=str(quotePart.id))
                    sectionForms.append(sectionForm)
                    quotePartUpdates.append(sectionForm)

            zipped_parts = zip(sectionParts, sectionForms)
            partContents.append(zipped_parts)
        quoteSections = zip(partSections,partContents)

        if quoteForm.is_valid():
            quote = quoteForm.save()
            validate_zipped = zip(quoteParts, quotePartUpdates)
            for quotePart, quoteBikeChangePartForm in validate_zipped:
                if  quoteBikeChangePartForm.is_valid():
                    if quoteBikeChangePartForm.has_changed():
                        updateQuotePartFromForm(quotePart, quoteBikeChangePartForm)
                else:
                    # quote part formset not valid
                    messages.info(request,'Part failed validation' + str(quotePart))
                    return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote),'customer': customer,'quoteSections': getQuoteSectionPartsAndForms(quote), 'fittingForm': fittingForm,'quoteSimpleAddPart': quoteSimpleAddPart})

            if  quoteSimpleAddPart.is_valid():
                part = validateAndCreatePart(quoteSimpleAddPart, request)
                if part != None:
                    quote_line = len(quoteParts) + 1
                    createQuotePart(quoteSimpleAddPart, quote.pk, part.pk, quote_line)
            else:
                # quoteSimpleAddPart not valid
                messages.info(request,'New Part failed validation')
                return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote),'customer': customer,'quoteSections': getQuoteSectionPartsAndForms(quote), 'fittingForm': fittingForm,'quoteSimpleAddPart': quoteSimpleAddPart})

            if fittingForm.has_changed():
                fittingForm.customer = quote.customer
                if fittingForm.is_valid():
                    fitting = fittingForm.save()

                    # update the fitting value on the quote and re-save
                    quote.fitting = fitting
                    quote.save()
                else:
                    # fittingForm not valid
                    messages.info(request,'Fitting form failed validation')
                    return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote),'customer': customer,'quoteSections': getQuoteSectionPartsAndForms(quote), 'fittingForm': fittingForm,'quoteSimpleAddPart': quoteSimpleAddPart})

            # Do something. Should generally end with a redirect. For example:
            return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote),'customer': customer,'quoteSections': getQuoteSectionPartsAndForms(quote), 'fittingForm': fittingForm,'quoteSimpleAddPart': QuoteSimpleAddPartForm(empty_permitted=True)})
        else:
            # quoteForm not valid
            return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote),'customer': customer,'quoteSections': getQuoteSectionPartsAndForms(quote), 'fittingForm': fittingForm,'quoteSimpleAddPart': quoteSimpleAddPart})
    else:
        quoteSimpleAddPart = QuoteSimpleAddPartForm(empty_permitted=True)
        if quote.fitting == None:
            fittingForm = QuoteFittingForm()
            return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote),'customer': customer,'quoteSections': getQuoteSectionPartsAndForms(quote), 'fittingForm': fittingForm,'quoteSimpleAddPart': quoteSimpleAddPart})
        else:
            fittingForm = QuoteFittingForm(instance=quote.fitting)
            return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote),'customer': customer,'quoteSections': getQuoteSectionPartsAndForms(quote), 'fittingForm': fittingForm,'quoteSimpleAddPart': quoteSimpleAddPart})

        # catch all return
        return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote),'customer': customer,'quoteSections': getQuoteSectionPartsAndForms(quote), 'fittingForm': QuoteFittingForm(),'quoteSimpleAddPart': quoteSimpleAddPart})

#
@login_required
# edit a quote based on a specific frame
def quote_edit_simple(request, pk):
    quote = get_object_or_404(Quote, pk=pk)
    quote.recalculate_prices()
    customer = quote.customer
    old_sell_price = 0 + quote.sell_price

    quote_page = 'epic/quote_edit_simple.html'
    if request.method == "POST":
        # get back the form from the page to save changes
        quoteForm = QuoteSimpleForm(request.POST,instance=quote)

        #get quote parts as they existed before update
        quoteParts = QuotePart.objects.filter(quote=quote)
        quotePartForms = []

        #get back all the quote part forms from the page
        for quotePart in quoteParts:
            quotePartForm = QuotePartForm(request.POST, request.FILES, instance=quotePart,prefix=str(quotePart.id))
            quotePartForms.append(quotePartForm)

        zipped_values = zip(quoteParts, quotePartForms)
        quoteSimpleAddPart = QuoteSimpleAddPartForm(request.POST)
        if quoteForm.is_valid():
            quote = quoteForm.save()
            for quotePartForm in quotePartForms:
                if  quotePartForm.is_valid():
                    quotePartForm.save()
                else:
                    # quote part formset not valid
                    messages.info(request,'Part failed validation' + str(quotePart))
                    return render(request, quote_page, {'quoteForm': QuoteSimpleForm(instance=quote), 'customer': customer,'quoteSimpleAddPart': quoteSimpleAddPart,'zipped_values': zipped_values})

            if  quoteSimpleAddPart.is_valid():
                part = validateAndCreatePart(quoteSimpleAddPart,request)
                if part != None:
                    quote_line = len(quoteParts) + 1
                    createQuotePart(quoteSimpleAddPart, quote.pk, part.pk, quote_line)
            else:
                # quoteSimpleAddPart not valid
                return render(request, quote_page, {'quoteForm': QuoteSimpleForm(instance=quote), 'customer': customer,'quoteSimpleAddPart': quoteSimpleAddPart,'zipped_values': zipped_values})


            # save all ok get new simple part and refresh items

            for quotePart in quoteParts:
                #delete any quote parts no longer required.
                if quotePart.quantity == 0:
                    quotePart.delete()

            quote.recalculate_prices()
            # if sell price has changed blank keyed value
            if old_sell_price != quote.sell_price:
                quote.keyed_sell_price = None
            quoteSimpleAddPart = QuoteSimpleAddPartForm(empty_permitted=True)
            return render(request, quote_page, {'quoteForm': QuoteSimpleForm(instance=quote),'customer': customer,'quoteSimpleAddPart': quoteSimpleAddPart,'zipped_values': getQuotePartsAndForms(quote)})

        #quote form not valid
        else:
            logging.getLogger("error_logger").error(quoteForm.errors.as_json())
            return render(request, quote_page, {'quoteForm': QuoteSimpleForm(instance=quote), 'customer': customer,'quoteSimpleAddPart': quoteSimpleAddPart,'zipped_values': zipped_values})

        # Do something. Should generally end with a redirect. For example:
        quoteSimpleAddPart = QuoteSimpleAddPartForm(empty_permitted=True)
        return render(request, quote_page, {'quoteForm': QuoteSimpleForm(instance=quote),'customer': customer,'quoteSimpleAddPart': quoteSimpleAddPart,'zipped_values': getQuotePartsAndForms(quote)})
    else:
        quoteSimpleAddPart = QuoteSimpleAddPartForm(empty_permitted=True)
        return render(request, quote_page, {'quoteForm': QuoteSimpleForm(instance=quote),'customer': customer,'quoteSimpleAddPart': quoteSimpleAddPart,'zipped_values': getQuotePartsAndForms(quote)})

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
                sectionParts.append(quotePart)
                if quotePart.part == None:
                    sectionForms.append(QuoteBikeChangePartForm(prefix=str(quotePart.id)))
                elif (quotePart.frame_part != None) and (quotePart.part == quotePart.frame_part.part):
                    sectionForms.append(QuoteBikeChangePartForm(prefix=str(quotePart.id)))
                else:
                    new_brand = quotePart.part.brand.brand_name
                    new_part_name = quotePart.part.part_name
                    new_quantity = quotePart.quantity
                    new_cost_price = quotePart.cost_price
                    new_sell_price = quotePart.sell_price
                    sectionForms.append(QuoteBikeChangePartForm(intial={'new_brand':new_brand,'new_part_name':new_part_name,'new_quantity':new_quantity,'new_cost_price':new_cost_price,'new_sell_price':new_sell_price},prefix=str(quotePart.id)))

        zipped_parts = zip(sectionParts, sectionForms)
        partContents.append(zipped_parts)
    return zip(partSections,partContents)

# build array of quote parts for use on simple quote screen
def getQuotePartsAndForms(quote):
    quoteParts = []
    quotePartForms = []
    quotePartObjects = QuotePart.objects.filter(quote=quote)
    for quotePart in quotePartObjects:
        quoteParts.append(quotePart)
        quotePartForms.append(QuoteBikePartForm(instance=quotePart,prefix=str(quotePart.id)))

    # build a merged array
    zipped_values = zip(quoteParts, quotePartForms)
    return zipped_values

def findBrandForString(search_string, brand_list, default_brand, request):
    for brand in brand_list:
        check_prefix = str(brand.brand_name).lower()
        if search_string.lower().startswith(check_prefix):
            #messages.info(request, 'found ' + check_prefix)
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
            form.save()
        else:
            raise forms.ValidationError('QuotePartBasicForm  save failed')

# update an existing quote part based on keyed values
def updateQuotePartFromForm(quotePart, form, request):
    brand_name = form.cleaned_data['new_brand']
    if brand_name == '':
        # values have been removed reset row
        if quotePart.frame_part == None:
            quotePart.part = None
            quotePart.quantity = None
            quotePart.cost_price = None
            quotePart.sell_price = None
        else:
            quotePart.part = quotePart.frame_part.part
            quotePart.quantity = 1
            quotePart.cost_price = None
            quotePart.sell_price = None
    else:
        # values have changed
        brand = findBrandForName(brand_name, request)
        partType = quotePart.partType
        part_name = form.cleaned_data['new_part_name']
        part = findOrCreatePart(brand, partType, part_name)
        if part == None:
            return
        else:
            quotePart.part = part
            quotePart.quantity = form.cleaned_data['new_quantity']
            quotePart.cost_price = form.cleaned_data['new_cost_price']
            quotePart.sell_price = form.cleaned_data['new_sell_price']
    quotePart.save()

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
