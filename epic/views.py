# import the logging library and the messages
from django.contrib import messages
from django.contrib.auth import logout
# security bits
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin

from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.views.generic.list import ListView

# forms and formsets used in the views
from epic.forms import QuoteSearchForm, MyQuoteSearchForm, OrderSearchForm
from epic.models import Customer, Supplier, CustomerOrder, INITIAL, ISSUED, CustomerNote
from epic.view_helpers.bike_upload_helper import process_upload
from epic.view_helpers.brand_view_helper import show_brand_popup, save_brand
from epic.view_helpers.customer_order_view_helper import create_customer_order_from_quote, edit_customer_order, \
    process_customer_order_edits
from epic.view_helpers.customer_view_helper import *
from epic.view_helpers.menu_view_helper import show_menu
from epic.view_helpers.note_view_helper import show_notes_popup
from epic.view_helpers.quote_view_helper import create_new_quote, show_add_quote, show_simple_quote_edit, \
    process_simple_quote_changes, process_bike_quote_changes, show_bike_quote_edit, quote_parts_for_simple_display, \
    quote_parts_for_bike_display, copy_quote_and_display
from epic.view_helpers.supplier_order_view_helper import show_orders_required_for_supplier, save_supplier_order


@login_required
def menu_home(request):
    return show_menu(request)


@login_required
def supplier_order_reqd(request, pk):
    supplier = get_object_or_404(Supplier, pk=pk)
    if request.method == "POST":
        return save_supplier_order(request, supplier)
    else:
        return show_orders_required_for_supplier(request, supplier)


# this extends the mix in for login required rather than the @ method as that doesn't work for ListViews
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
        # get values for search from form
        self.search_first_name = request.GET.get('search_first_name', '')
        self.search_last_name = request.GET.get('search_last_name', '')
        return super(CustomerList, self).get(request, *args, **kwargs)

    def get_queryset(self):
        # define an empty search pattern
        where_filter = Q()

        # if filter added on first name add it to query set
        if self.search_first_name:
            where_filter &= Q(first_name__icontains=self.search_first_name)

        # if filter added on last name add it to query set
        if self.search_last_name:
            where_filter &= Q(last_name__icontains=self.search_last_name)

        # find objects matching any filter and order them
        objects = Customer.objects.filter(where_filter).order_by('last_name')
        return objects


# get customers for popup
# this extends the mix in for login required rather than the @ method as that doesn't work for ListViews
class CustomerSelect(LoginRequiredMixin, ListView):
    template_name = 'epic/select_customer_popup.html'
    context_object_name = 'customer_list'
    # attributes for search form
    search_first_name = ''
    search_last_name = ''

    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super(CustomerSelect, self).get_context_data(**kwargs)
        # add values fetched from form to context to redisplay
        context['search_first_name'] = self.search_first_name
        context['search_last_name'] = self.search_last_name
        return context

    def get(self, request, *args, **kwargs):
        # get values for search from form
        self.search_first_name = request.GET.get('search_first_name', '')
        self.search_last_name = request.GET.get('search_last_name', '')
        return super(CustomerSelect, self).get(request, *args, **kwargs)

    def get_queryset(self):
        # define an empty search pattern
        where_filter = Q()

        # if filter added on first name add it to query set
        if self.search_first_name:
            where_filter &= Q(first_name__icontains=self.search_first_name)

        # if filter added on last name add it to query set
        if self.search_last_name:
            where_filter &= Q(last_name__icontains=self.search_last_name)

        # find objects matching any filter and order them
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
        context['quoteSearchForm'] = self.quoteSearchForm
        return context

    def get(self, request, *args, **kwargs):
        # get values for search from form
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

        # find objects matching any filter and order them
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
        # get values for search from form
        self.quoteSearchForm = MyQuoteSearchForm(request.GET)
        return super(MyQuoteList, self).get(request, *args, **kwargs)

    def get_queryset(self):
        # define an empty search pattern
        where_filter = Q()

        # if filter added on quote_desc add it to query set
        if self.quoteSearchForm.is_valid():
            search_frame = self.quoteSearchForm.cleaned_data['search_frame']
            search_quote_desc = self.quoteSearchForm.cleaned_data['search_quote_desc']
            if search_frame:
                where_filter &= Q(frame__exact=search_frame)
            if search_quote_desc:
                where_filter &= Q(quote_desc__icontains=search_quote_desc)

        # find objects matching any filter and order them
        return Quote.objects.filter(where_filter)


@login_required
def add_customer(request):
    if request.method == "POST":
        return process_customer_add(request)
    else:
        return add_customer_view(request)


@login_required
def edit_customer(request, pk):
    customer = get_object_or_404(Customer, pk=pk)
    if request.method == "POST":
        return process_customer_edit(request, customer)
    else:
        return show_customer_edit(request, customer)


# popup with all notes relating to a customer
def view_customer_notes(request, pk):
    customer = get_object_or_404(Customer, pk=pk)
    return show_notes_popup(request, customer)


# Add a new quote - display basic form and when saved make a new quote
@login_required
def add_quote(request):
    if request.method == "POST":
        return create_new_quote(request)
    else:
        return show_add_quote(request)

# Add a new brand - display basic form and when saved make a new brand
@login_required
def add_brand(request):
    if request.method == "POST":
        return save_brand(request)
    else:
        return show_brand_popup(request)


# create and order from a quote
@login_required
def quote_order(request, pk):
    if request.method == "POST":
        # shouldn't be here!
        messages.info(request, 'Invalid action ')
    else:
        quote = get_object_or_404(Quote, pk=pk)
        return create_customer_order_from_quote(quote)


# show edit order page
@login_required
def order_edit(request, pk):
    customerOrder = get_object_or_404(CustomerOrder, pk=pk)
    if request.method == "POST":
        return process_customer_order_edits(request, customerOrder)

    else:
        return edit_customer_order(request, customerOrder)


# Get Orders matching a search
# this extends the mix in for login required rather than the @ method as that doesn't work for ListViews
class OrderList(LoginRequiredMixin, ListView):
    template_name = "customerorder_list.html"
    context_object_name = 'order_list'
    # attributes for search form
    orderSearchForm = OrderSearchForm()

    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super(OrderList, self).get_context_data(**kwargs)
        # add values fetched from form to context to redisplay
        context['orderSearchForm'] = self.orderSearchForm
        return context

    def get(self, request, *args, **kwargs):
        # get values for search from form
        self.orderSearchForm = OrderSearchForm(request.GET)
        return super(OrderList, self).get(request, *args, **kwargs)

    def get_queryset(self):
        # define an empty search pattern
        where_filter = Q()

        # if filter added on quote_desc add it to query set
        if self.orderSearchForm.is_valid():
            completeOrder = self.orderSearchForm.cleaned_data["complete_order"]
            if completeOrder:
                where_filter &= Q(completed_date__isnull=False)
            else:
                where_filter &= Q(completed_date__isnull=True)
            balance_outstanding = self.orderSearchForm.cleaned_data["balance_outstanding"]
            if balance_outstanding:
                where_filter &= Q(amount_due__gt=0)
            cancelled_order = self.orderSearchForm.cleaned_data["cancelled_order"]
            if cancelled_order:
                where_filter &= Q(cancelled_date__isnull=False)
            else:
                where_filter &= Q(cancelled_date__isnull=True)
            lower_limit = self.orderSearchForm.cleaned_data['lower_limit']
            if lower_limit:
                where_filter &= Q(order_total__gt=lower_limit)

        # find objects matching any filter and order them
        objects = CustomerOrder.objects.filter(where_filter)
        return objects


# create a new quote based on an existing quote
@login_required
def copy_quote(request, pk):
    if request.method == "POST":
        # shouldn't be here!
        messages.info(request, 'Invalid action ')
    else:
        return copy_quote_and_display(request, pk)


# bike copy allows new customer
def quote_copy_bike(request, pk):
    quote = get_object_or_404(Quote, pk=pk)
    if request.method == "POST":
        new_customer_id = request.POST.get('new_customer_id', '')
        if new_customer_id != '':
            customer = get_object_or_404(Customer, pk=new_customer_id)
            quote_same_name = Quote.objects.filter(customer=customer, quote_desc=quote.quote_desc).count()
            # update the quote with the new customer and an appropriate version
            quote.customer = customer
            quote.version = quote_same_name + 1
            quote.save()
            return HttpResponseRedirect(reverse('quote_edit_bike', args=(quote.id,)))
        else:
            return render(request, 'epic/quote_copy_bike.html',
                          {'quote': quote, 'quoteSections': quote_parts_for_bike_display(quote)})

    else:
        quote = get_object_or_404(Quote, pk=pk)
        return render(request, 'epic/quote_copy_bike.html',
                      {'quote': quote, 'quoteSections': quote_parts_for_bike_display(quote)})


# re-open and issued quote
@login_required
def quote_requote(request, pk):
    if request.method == "POST":
        messages.info(request, 'Invalid action ')
    else:
        # get the quote you are basing it on and create a copy_quote
        quote = get_object_or_404(Quote, pk=pk)
        quote.requote()
        if quote.quote_status == INITIAL:
            if quote.is_bike():
                # display the bike based quote edit page
                return HttpResponseRedirect(reverse('quote_edit_bike', args=(quote.id,)))
            else:
                # display the simple quote edit page
                return HttpResponseRedirect(reverse('quote_edit_simple', args=(quote.id,)))
        else:
            messages.error(request, 'Quote cannot be edited' + str(quote))
            return HttpResponseRedirect(reverse('quotes'))
    # default return
    return HttpResponseRedirect(reverse('quotes'))


# finalise a quote by issuing it
@login_required
def quote_issue(request, pk):
    if request.method == "POST":
        # shouldn't be here!
        messages.info(request, 'Invalid action ')
    else:
        # get the quote you are basing it on and create a copy_quote
        quote = get_object_or_404(Quote, pk=pk)
        quote.issue()
        if quote.quote_status == ISSUED:
            return HttpResponseRedirect(reverse('quote_browse', args=(quote.id,)))
        elif quote.quote_status == INITIAL:
            if quote.is_bike():
                # display the bike based quote edit page
                messages.error(request, 'Quote needs prices before it can be issued')
                return HttpResponseRedirect(reverse('quote_edit_bike', args=(quote.id,)))
            else:
                # display the simple quote edit page
                messages.error(request, 'Quote needs prices before it can be issued')
                return HttpResponseRedirect(reverse('quote_edit_simple', args=(quote.id,)))
        else:
            messages.error(request, 'Quote cannot be Issued or edited' + str(quote))
            return HttpResponseRedirect(reverse('quotes'))
    # default return
    return HttpResponseRedirect(reverse('quotes'))


# browse a quote based on a specific frame
@login_required
def quote_browse(request, pk):
    if request.method == "POST":
        # shouldn't be here!
        messages.info(request, 'Invalid action ')
    else:
        quote = get_object_or_404(Quote, pk=pk)
        customer_notes = CustomerNote.objects.filter(quote=quote)
        if quote.is_bike():
            return render(request, 'epic/quote_issued_bike.html',
                          {'quote': quote, 'quoteSections': quote_parts_for_bike_display(quote),
                           'customer_notes': customer_notes})
        else:
            return render(request, 'epic/quote_issued_simple.html',
                          {'quote': quote, 'quoteDetails': quote_parts_for_simple_display(quote),
                           'customer_notes': customer_notes})  # amend a quote  save will reset to INITIAL if required


@login_required
def quote_amend(request, pk):
    quote = get_object_or_404(Quote, pk=pk)
    if request.method == "POST":
        # shouldnt be here!
        messages.info(request, 'Invalid action ')
    else:
        if quote.is_bike():
            # display the bike based quote edit page
            return HttpResponseRedirect(reverse('quote_edit_bike', args=(pk,)))
        else:
            # display the simple quote edit page
            return HttpResponseRedirect(reverse('quote_edit_simple', args=(pk,)))


# edit a quote
@login_required
def quote_edit(request, pk):
    quote = get_object_or_404(Quote, pk=pk)
    if request.method == "POST":
        # shouldn't be here!
        messages.info(request, 'Invalid action ')
    else:
        if quote.is_bike():
            # display the bike based quote edit page
            return HttpResponseRedirect(reverse('quote_edit_bike', args=(pk,)))
        else:
            # display the simple quote edit page
            return HttpResponseRedirect(reverse('quote_edit_simple', args=(pk,)))


# edit a quote based on a specific frame
@login_required
def quote_edit_bike(request, pk):
    quote = get_object_or_404(Quote, pk=pk)
    if request.method == "POST":
        return process_bike_quote_changes(request, quote)
    else:
        return show_bike_quote_edit(request, quote)


# edit a quote based on a specific frame
@login_required
def quote_edit_simple(request, pk):
    quote = get_object_or_404(Quote, pk=pk)

    if request.method == "POST":
        return process_simple_quote_changes(request, quote)
    else:
        return show_simple_quote_edit(request, quote)


# based on code in http://thepythondjango.com/upload-process-csv-file-django/
@login_required
def bike_upload(request):
    # create a dummy data field (could pass data here)
    data = {}
    if "GET" == request.method:
        return render(request, "epic/bike_upload.html", data)

    # if not GET, then proceed
    next_screen = process_upload(request)
    if next_screen:
        return next_screen
    else:
        return menu_home(request)


def logout_view(request):
    logout(request)
    # Redirect to a success page.
