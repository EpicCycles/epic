# import the logging library and the messages
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.contrib.auth import logout
# security bits
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.views.generic.list import ListView
# forms and formsets used in the views
from epic.forms import QuoteSearchForm, MyQuoteSearchForm
from epic.models import Customer, ARCHIVED, INITIAL, Part
from epic.serializers import PartSerializer, CustomerSerializer, CustomerEditSerializer, CustomerNoteSerializer, \
    CustomerNoteEditSerializer, LoginUserSerializer
from epic.view_helpers.brand_view_helper import show_brand_popup, save_brand
from epic.view_helpers.customer_view_helper import *
from epic.view_helpers.frame_view_helper import process_upload, create_new_model, process_bike_review, show_bike_review, \
    show_first_bike, show_next_bike, list_selected_bikes, process_bike_actions
from epic.view_helpers.menu_view_helper import show_menu, add_standard_session_data_to_context
from epic.view_helpers.note_view_helper import show_notes_popup
from epic.view_helpers.quote_part_view_helper import save_quote_part, show_quote_part_popup
from epic.view_helpers.quote_view_helper import create_new_quote, show_add_quote, show_quote_edit, \
    copy_quote_and_display, process_quote_requote, show_quote_issue, show_quote_browse, show_quote_text, \
    show_add_quote_for_customer, process_quote_action, process_quote_changes


class PartListCreate(generics.ListCreateAPIView):
    queryset = Part.objects.all()
    serializer_class = PartSerializer


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response(user)


@api_view(['GET', 'PUT', 'DELETE'])
def CustomerEdit(request, pk):
    try:
        customer = Customer.objects.get(pk=pk)
    except Customer.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CustomerEditSerializer(customer)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CustomerEditSerializer(customer, data=request.data)
        if serializer.is_valid():
            new_customer = serializer.save()
            return Response(CustomerEditSerializer(new_customer).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        customer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST', 'DELETE'])
def CustomerNoteEdit(request, pk):
    try:
        customerNote = CustomerNote.objects.get(pk=pk)
    except CustomerNote.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CustomerNoteEditSerializer(customerNote)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CustomerNoteEditSerializer(customerNote, data=request.data)
        if serializer.is_valid():
            new_note = serializer.save()
            return Response(CustomerNoteEditSerializer(new_note).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        customerNote.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CustomerListCreate(generics.ListCreateAPIView):
    serializer_class = CustomerSerializer

    def get_queryset(self):
        search_first_name = self.request.query_params.get('firstName', None)
        search_last_name = self.request.query_params.get('lastName', None)
        # define an empty search pattern
        where_filter = Q()

        # if filter added on first name add it to query set
        if search_first_name:
            where_filter &= Q(first_name__icontains=search_first_name)

        # if filter added on last name add it to query set
        if search_last_name:
            where_filter &= Q(last_name__icontains=search_last_name)

        # find objects matching any filter and order them
        objects = Customer.objects.filter(where_filter).order_by('last_name')
        return objects


class CustomerNoteListCreate(generics.ListCreateAPIView):
    serializer_class = CustomerNoteSerializer

    def get_queryset(self):
        search_customer = self.request.query_params.get('customerId', None)
        search_quote = self.request.query_params.get('quoteId', None)
        customer_visible = self.request.query_params.get('customerVisible', False)
        # define an empty search pattern
        where_filter = Q()

        # if filter added on first name add it to query set
        if search_customer:
            where_filter &= Q(customer__id=search_customer)

        # if filter added on last name add it to query set
        if search_quote:
            where_filter &= Q(quote__id=search_quote)

        # if filter added for just customer visible add it to query set
        if search_quote:
            where_filter &= Q(customer_visible=customer_visible)

        # find objects matching any filter and order them
        objects = CustomerNote.objects.filter(where_filter).order_by('created_on')
        return objects


@login_required
def menu_home(request):
    return show_menu(request)


# this extends the mix in for login required rather than the @ method as that doesn't work for ListViews
class CustomerList(LoginRequiredMixin, ListView):
    template_name = "epic/customer/customer_list.html"
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
    template_name = 'epic/customer/customer_select_popup.html'
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
    template_name = "epic/quotes/quote_list.html"
    context_object_name = 'quote_list'
    # attributes for search form
    quoteSearchForm = QuoteSearchForm()

    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super(QuoteList, self).get_context_data(**kwargs)
        context['quoteSearchForm'] = self.quoteSearchForm
        context['frames_for_js'] = get_frames_for_js()
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
            search_brand = self.quoteSearchForm.cleaned_data['search_brand']
            search_frame = self.quoteSearchForm.cleaned_data['search_frame']
            search_model = self.quoteSearchForm.cleaned_data['search_model']
            search_quote_desc = self.quoteSearchForm.cleaned_data['search_quote_desc']
            search_user = self.quoteSearchForm.cleaned_data['search_user']
            if search_model:
                where_filter &= Q(frame__id=search_model)
            elif search_brand:
                where_filter &= Q(frame__brand__id=search_brand)
                if search_frame:
                    where_filter &= Q(frame__frame_name=search_frame)

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
    template_name = "epic/quotes/quote_list.html"
    context_object_name = 'quote_list'
    # attributes for search form
    quoteSearchForm = MyQuoteSearchForm()

    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super(MyQuoteList, self).get_context_data(**kwargs)
        context['quoteSearchForm'] = self.quoteSearchForm
        context['frames_for_js'] = get_frames_for_js()

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
        elif action_required == 'listModels':
            return list_selected_bikes(request)
        elif action_required == "show_next":
            return show_next_bike(request)
        elif action_required == "save_and_show_new_selection":
            return process_bike_review(request, True)
        elif action_required == "save_changes":
            return process_bike_review(request, False)
        elif action_required == "process_actions":
            return process_bike_actions(request, False)
        elif action_required == "process_actions_and_show_new_selection":
            return process_bike_actions(request, True)

        else:
            messages.error(request, 'No action chosen. ')
            return show_bike_review(request)


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
    if request.method == "POST":
        return create_new_quote(request)
    else:
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

    return render(request, 'epic/frames/frame_select_popup.html', add_standard_session_data(request, details_for_page))


# create a new quote based on an existing quote
@login_required
def copy_quote(request, pk):
    if request.method == "POST":
        # shouldn't be here!
        messages.info(request, 'Invalid action ')
    else:
        return copy_quote_and_display(request, pk, None, None)



def quote_copy_with_changes(request):
    if request.method == "POST":
        copy_quote_id = request.POST.get('copy_quote_id', '')

        new_customer_id = request.POST.get('new_customer_id')
        if new_customer_id and new_customer_id == '':
            new_customer_id = None

        new_frame_id = request.POST.get('new_frame_id')
        if new_frame_id and new_frame_id == '':
            new_frame_id = None

        return copy_quote_and_display(request, copy_quote_id, new_frame_id, new_customer_id)


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

        return HttpResponseRedirect(reverse('quote_edit', args=(pk,)))


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
        return render(request, "epic/frames/bike_upload.html", add_standard_session_data(request, data))

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
