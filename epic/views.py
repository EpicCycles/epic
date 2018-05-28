# import the logging library and the messages
from django.contrib.auth import logout
# security bits
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin

from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.views.generic.list import ListView

# forms and formsets used in the views
from epic.forms import QuoteSearchForm, MyQuoteSearchForm, OrderSearchForm
from epic.model_helpers.frame_helper import get_frames_for_js
from epic.models import Customer, Supplier, CustomerOrder, ARCHIVED, INITIAL
from epic.view_helpers.frame_view_helper import process_upload, create_new_model, process_bike_review, show_bike_review, \
    show_first_bike, show_next_bike
from epic.view_helpers.brand_view_helper import show_brand_popup, save_brand
from epic.view_helpers.customer_order_view_helper import edit_customer_order, process_customer_order_edits, \
    cancel_order_and_requote, cancel_order_and_quote
from epic.view_helpers.customer_view_helper import *
from epic.view_helpers.menu_view_helper import show_menu, add_standard_session_data_to_context
from epic.view_helpers.note_view_helper import show_notes_popup
from epic.view_helpers.quote_part_view_helper import save_quote_part, show_quote_part_popup
from epic.view_helpers.quote_view_helper import create_new_quote, show_add_quote, show_quote_edit, \
    copy_quote_and_display, process_quote_requote, show_quote_issue, show_quote_browse, show_quote_text, \
    show_add_quote_for_customer, process_quote_action, process_quote_changes
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
        return add_standard_session_data_to_context(context)

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
    template_name = 'epic/customer_select_popup.html'
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
        return add_standard_session_data_to_context(context)

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
        return add_standard_session_data_to_context(context)

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
        return add_standard_session_data_to_context(context)

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
def bike_review(request):
    if request.method == "GET":
        return show_bike_review(request)
    else:
        try:
            action_required = request.POST['action_required']
        except KeyError:
            action_required = 'startReview'

        if action_required == 'startReview':
            return show_first_bike(request)
        elif action_required == "show_next":
            return show_next_bike(request)
        elif action_required == "save_and_show_new_selection":
            return process_bike_review(request, True)
        else:
            return process_bike_review(request, False)


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


@login_required
def quote_for_customer(request, pk):
    customer = get_object_or_404(Customer, pk=pk)
    return show_add_quote_for_customer(request, customer)


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


@login_required
def add_customer_simple(request):
    if request.method == "POST":
        return save_customer_from_popup(request)
    else:
        return show_add_customer_popup(request)


# get frame details for pop-up
def bike_select_popup(request):
    details_for_page = {'frames_for_js': get_frames_for_js()}

    return render(request, 'epic/frame_select_popup.html', add_standard_session_data(request, details_for_page))


# show edit order page
@login_required
def order_edit(request, pk):
    customer_order = get_object_or_404(CustomerOrder, pk=pk)
    if request.method == "POST":
        return process_customer_order_edits(request, customer_order)

    else:
        return edit_customer_order(request, customer_order)


# create and order from a quote
@login_required
def order_requote(request, pk):
    if request.method == "POST":
        # shouldn't be here!
        messages.info(request, 'Invalid action ')
    else:
        customer_order = get_object_or_404(CustomerOrder, pk=pk)
        return cancel_order_and_requote(request, customer_order)


@login_required
def cancel_order(request, pk):
    if request.method == "POST":
        # shouldn't be here!
        messages.info(request, 'Invalid action ')
    else:
        customer_order = get_object_or_404(CustomerOrder, pk=pk)
        return cancel_order_and_quote(request, customer_order)


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
        return add_standard_session_data_to_context(context)

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
        return copy_quote_and_display(request, pk, None, None)


def quote_change_frame(request):
    if request.method == "POST":
        new_frame_id = request.POST.get('new_frame_id', '')
        copy_quote_id = request.POST.get('copy_quote_id', '')

        if (new_frame_id != '') and (copy_quote_id != ''):
            return copy_quote_and_display(request, copy_quote_id, new_frame_id, None)


def quote_copy_bike(request, pk):
    if request.method == "POST":
        new_customer_id = request.POST.get('new_customer_id')
        if new_customer_id and new_customer_id == '':
            new_customer_id = None

        new_frame_id = request.POST.get('new_frame_id')
        if new_frame_id and new_frame_id == '':
            new_frame_id = None

        return copy_quote_and_display(request, pk, new_frame_id, new_customer_id)


# re-open and issued quote
@login_required
def quote_requote(request, pk):
    if request.method == "POST":
        messages.info(request, 'Invalid action ')
        return HttpResponseRedirect(reverse('quotes'))

    # get the quote you are basing it on and create a copy_quote
    quote = get_object_or_404(Quote, pk=pk)

    return process_quote_requote(request, quote)


# finalise a quote by issuing it
@login_required
def quote_issue(request, pk):
    quote = get_object_or_404(Quote, pk=pk)

    if request.method == "POST":
        return process_quote_action(request, quote)

    else:
        return show_quote_issue(request, quote)  # get the quote you are basing it on and create a copy_quote


def quote_text(request, pk):
    quote = get_object_or_404(Quote, pk=pk)
    return show_quote_text(request, quote)


# browse a quote based on a specific frame
@login_required
def quote_browse(request, pk):
    quote = get_object_or_404(Quote, pk=pk)

    if request.method == "POST":
        # this is the same screen as issue so make it a joint action
        return process_quote_action(request, quote)

    return show_quote_browse(request, quote)


@login_required
def quote_amend(request, pk):
    quote = get_object_or_404(Quote, pk=pk)
    if request.method == "POST":
        # shouldnt be here!
        messages.info(request, 'Invalid action ')
    else:
        if quote.quote_status == ARCHIVED:
            messages.info(request, 'Quote status reset ')
            quote.quote_status = INITIAL
            quote.save()

        return HttpResponseRedirect(reverse('quote_edi', args=(pk,)))


# edit a quote
@login_required
def quote_edit(request, pk):
    quote = get_object_or_404(Quote, pk=pk)

    if request.method == "POST":
        return process_quote_changes(request, quote)
    else:
        return show_quote_edit(request, quote)


def add_quote_part(request, pk):
    quote = get_object_or_404(Quote, pk=pk)

    if request.method == "POST":
        return save_quote_part(request, quote)
    else:
        return show_quote_part_popup(request, quote)


# based on code in http://thepythondjango.com/upload-process-csv-file-django/
@login_required
def bike_upload(request):
    # create a dummy data field (could pass data here)
    data = {}
    if "GET" == request.method:
        return render(request, "epic/bike_upload.html", add_standard_session_data(request, data))

    # if not GET, then proceed
    next_screen = process_upload(request)
    if next_screen:
        return next_screen
    else:
        return menu_home(request)


def create_model(request):
    if request.method != "POST":
        messages.info(request, 'Invalid action ')
        return HttpResponseRedirect(reverse('menu_home'))

    model = request.POST.get('model', '')
    copy_quote_id = request.POST.get('copy_quote_id', '')
    quote = get_object_or_404(Quote, pk=copy_quote_id)
    if not quote.is_bike():
        messages.info(request, 'Cannot create a standard build from this quote ' + str(quote))
        return HttpResponseRedirect(reverse('menu_home'))

    if (model != '') and (copy_quote_id != ''):
        return create_new_model(request, quote, model)


def logout_view(request):
    logout(request)  # Redirect to a success page.
