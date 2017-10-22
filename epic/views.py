# import the logging library and the messages
import logging

from django.contrib import messages
from django.contrib.auth import logout
# security bits
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin

from django.core.paginator import Paginator
from django.db.models import Q
from django.shortcuts import get_object_or_404, render
from django.views.generic.list import ListView
from django.urls import reverse

# forms and formsets used in the views
from epic.view_helpers.customer_view_helper import *
from .forms import *


@login_required
def menu_home(request):
    # create list of brands to display for external links
    brands = Brand.objects.filter(link__startswith="http")

    # create a list of suppliers with items requiring orders
    suppliers = Supplier.objects.all()
    suppliers_requiring_orders = []
    for supplier in suppliers:
        order_frames = OrderFrame.objects.filter(supplier=supplier, supplierOrderItem=None)
        if order_frames:
            suppliers_requiring_orders.append(supplier)
        else:
            order_items = OrderItem.objects.filter(supplier=supplier, supplierOrderItem=None)
            if order_items:
                suppliers_requiring_orders.append(supplier)

    admin_link_text = ["Review Bike Details"]
    admin_link_url = [reverse('admin:epic_frame_changelist')]
    admin_link_text.append("Brands")
    admin_link_url.append(reverse('admin:epic_brand_changelist'))
    admin_link_text.append("Suppliers")
    admin_link_url.append(reverse('admin:epic_supplier_changelist'))
    admin_link_text.append("Quote Sections")
    admin_link_url.append(reverse('admin:epic_partsection_changelist'))
    admin_link_text.append("Part Types and attributes")
    admin_link_url.append(reverse('admin:epic_parttype_changelist'))

    cust_link_text = ["Customers"]
    cust_link_url = [reverse('admin:epic_customer_changelist')]
    cust_link_text.append("Customer Quotes")
    cust_link_url.append(reverse('admin:epic_quote_changelist'))
    cust_link_text.append("Customer Orders")
    cust_link_url.append(reverse('admin:epic_customerorder_changelist'))

    return render(request, 'epic/menu_home.html',
                  {'brands': brands, 'suppliers_requiring_orders': suppliers_requiring_orders,
                   'customer_links': zip(cust_link_text, cust_link_url),
                   'admin_links': zip(admin_link_text, admin_link_url)})


@login_required
def supplier_order_reqd(request, pk):
    supplier = get_object_or_404(Supplier, pk=pk)
    if request.method == "POST":
        #get back all the forms before anything else
        supplier_order_form = SupplierOrderForm(request.POST, request.FILES)
        form_possible_items = []
        bikes = OrderFrame.objects.filter(supplier=supplier)
        for bike in bikes:
            form_possible_items.append(SupplierOrderPossibleForm(request.POST, request.FILES, prefix='OF' + str(bike.id)))
        parts = OrderItem.objects.filter(supplier=supplier)
        for part in parts:
            form_possible_items.append(SupplierOrderPossibleForm(request.POST, request.FILES, prefix='OP' + str(part.id)))

        # once all forms in from session validate and redisplay
        if supplier_order_form.is_valid():
            supplierOrder = supplier_order_form.save()
            new_form_possible_items = []
            order_item_count = 0

            # save any items that are valid
            for supplier_order_possible in form_possible_items:
                if supplier_order_possible.is_valid():
                    if supplier_order_possible.cleaned_data['add_to_order']:
                        supplier_order_item = SupplierOrderItem.objects.create_supplier_order_item(supplierOrder,
                                                                                                   supplier_order_possible.cleaned_data[
                                                                                                       'item_description'])
                        supplier_order_item.save()
                        item_type = supplier_order_possible.cleaned_data['item_type']
                        item_id = supplier_order_possible.cleaned_data['item_id']
                        if item_type == BIKE:
                            bike = OrderFrame.objects.get(id=item_id)
                            bike.supplierOrderItem = supplier_order_item
                            bike.save()
                        else:
                            part = OrderItem.objects.get(id=item_id)
                            part.supplierOrderItem = supplier_order_item
                            part.save()

                        order_item_count = order_item_count + 1
                    else:
                        new_form_possible_items.append(supplier_order_possible)
                else:
                    logging.getLogger("error_logger").error(supplier_order_possible.errors.as_json())
                    new_form_possible_items.append(supplier_order_possible)

            # check that some items are selected
            if order_item_count == 0:
                supplierOrder.delete()
                messages.info(request, 'Order cannot be created if no items are selected. ')
                return render(request, 'epic/supplier_order_build.html',
                              {'supplier': supplier, 'supplier_order_form': supplier_order_form,
                               'possible_items': form_possible_items})
            else:
                if len(new_form_possible_items) > 0:
                    return render(request, 'epic/supplier_order_build.html',
                                  {'supplier': supplier, 'supplier_order_form': supplier_order_form,
                                   'possible_items': new_form_possible_items})
                else:
                    # order created an no items remaind return to the menu
                    return menu_home(request)
        else:
            logging.getLogger("error_logger").error(supplier_order_form.errors.as_json())
            variables = {'supplier': supplier, 'supplier_order_form': supplier_order_form,
                               'possible_items': form_possible_items}
            return render(request, 'epic/supplier_order_build.html', variables)
    else:

        possible_items = []

        # get back frame and quote details for supplier
        bikes = OrderFrame.objects.filter(supplier=supplier).select_related('quote__customer')
        for bike in bikes:
            item_description = str(bike.frame)
            quote = bike.quote
            quote_name = str(quote)
            customer = quote.customer
            customer_name = str(customer)
            supplier_order_possible = SupplierOrderPossibleForm(
                initial={'item_description': item_description, 'quote_name': quote_name,
                         'customer_name': customer_name,'item_type':BIKE,'item_id': bike.id}, prefix='OF' + str(bike.id))
            possible_items.append(supplier_order_possible)

        # get back part  and quote details for supplier
        parts = OrderItem.objects.filter(supplier=supplier).select_related('quotePart__quote__customer')
        for part in parts:
            quotePart = part.quotePart
            item_description = str(quotePart)
            quote = quotePart.quote
            quote_name = str(quote)
            customer = quote.customer
            customer_name = str(customer)
            supplier_order_possible = SupplierOrderPossibleForm(
                initial={'item_description': item_description, 'quote_name': quote_name,
                         'customer_name': customer_name,'item_type':PART,'item_id': part.id}, prefix='OP' + str(part.id))
            possible_items.append(supplier_order_possible)

        return render(request, 'epic/supplier_order_build.html',
                      {'supplier': supplier, 'supplier_order_form': SupplierOrderForm(initial={'supplier': supplier}),
                       'possible_items': possible_items})


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
        # add values fetched from form to context to redisplay
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

    @property
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

        # find objects matching any filter and order them
        return Quote.objects.filter(where_filter)


# QUote list with search form
@login_required
def my_quote_list(request):
    if request.method == "POST":
        # shouldn't be here
        return QuoteList.as_view()
    else:
        data_dict = {}
        data_dict["search_user"] = request.user.pk
        quote_search_form = QuoteSearchForm(data_dict)
        quote_list = Quote.objects.filter(created_by=request.user)
        paginator = Paginator(quote_list, 10)  # Show 10 contacts per page
        return render(request, 'epic/quote_list.html',
                      {'quote_list': paginator.page(1), 'quote_search_form': quote_search_form})


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
        return  process_customer_edit(request, customer)
    else:
        return show_customer_edit(request, customer )



# popup with all notes relating to a customer

def view_customer_notes(request, pk):
    customer = get_object_or_404(Customer, pk=pk)
    customer_notes = CustomerNote.objects.filter(customer=customer)
    return render(request, 'epic/view_notes.html', {'customer': customer, 'customer_notes': customer_notes})


# Add a new quote - display basic form and when saved make a new quote
@login_required
def add_quote(request):
    if request.method == "POST":
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

    quoteForm = QuoteForm()
    return render(request, 'epic/quote_start.html', {'quoteForm': quoteForm})


# create and order from a quote
@login_required
def quote_order(request, pk):
    if request.method == "POST":
        # shouldn't be here!
        messages.info(request, 'Invalid action ')
    else:
        quote = get_object_or_404(Quote, pk=pk)
        customerOrder = CustomerOrder.objects.create_customerOrder(quote)
        customerOrder.save()
        # create form for customer order
        customerOrderForm = CustomerOrderForm(instance=customerOrder)

        if (quote.is_bike()):
            # create frame element and part elements and forms for them
            orderFrame = OrderFrame.objects.create_orderFrame(quote.frame, customerOrder, quote)

        # create part elements and forms for them
        quotePartObjects = QuotePart.objects.filter(quote=quote)
        for quotePart in quotePartObjects:
            if quotePart.part and quotePart.notStandard():
                orderItem = OrderItem.objects.create_orderItem(quotePart.part, customerOrder, quotePart)
                orderItem.save()

        # calculate the order balance
        customerOrder.calculate_balance()
        customerOrder.save()
        # display order page
        return HttpResponseRedirect(reverse('order_edit', args=(customerOrder.id,)))


# show edit order page
@login_required
def order_edit(request, pk):
    customerOrder = get_object_or_404(CustomerOrder, pk=pk)
    if request.method == "POST":
        customerOrderForm = CustomerOrderForm(request.POST, instance=customerOrder)
        if customerOrderForm.is_valid():
            try:
                customerOrderForm.save()
            except Exception as e:
                logging.getLogger("error_logger").exception('Order changes could not be saved')

        orderPaymentForm = OrderPaymentForm(request.POST)
        if orderPaymentForm.is_valid():
            try:
                paymentAmount = orderPaymentForm.cleaned_data['paymentAmount']
                if paymentAmount:
                    orderPayment = OrderPayment.objects.create_orderPayment(customerOrder, paymentAmount, request.user)
                    orderPayment.save()
                    customerOrder.calculate_balance()
                    customerOrder.save()
                    orderPaymentForm = OrderPaymentForm(initial={'amountDue': customerOrder.amount_due})

            except Exception as e:
                logging.getLogger("error_logger").exception('Payment could not be saved')
        # save any note keyed
        create_customer_note(request, customerOrder.customer, None, customerOrder)

        # get back the order frame foems and save
        orderFrameObjects = OrderFrame.objects.filter(customerOrder=customerOrder)
        for orderFrame in orderFrameObjects:
            orderFrameForm = OrderFrameForm(request.POST, request.FILES, instance=orderFrame,
                                            prefix="OF" + str(orderFrame.id))
            if orderFrameForm.is_valid():
                try:
                    orderFrameForm.save()

                except Exception as e:
                    logging.getLogger("error_logger").exception('Order Frame updates could not be saved')

        # get back the order item forms and save.
        orderItemObjects = OrderItem.objects.filter(customerOrder=customerOrder)
        for orderItem in orderItemObjects:
            orderItemForm = OrderItemForm(request.POST, request.FILES, instance=orderItem,
                                          prefix="OI" + str(orderItem.id))
            if orderItemForm.is_valid():
                try:
                    orderItemForm.save()

                except Exception as e:
                    logging.getLogger("error_logger").exception('Order Item updates could not be saved')

        orderPayments = OrderPayment.objects.filter(customerOrder=customerOrder)
        customer_notes = CustomerNote.objects.filter(customerOrder=customerOrder)
        return render(request, 'epic/order_edit.html',
                      {'customerOrder': customerOrder, 'customerOrderForm': CustomerOrderForm(instance=customerOrder),
                       'orderFrameForms': build_order_frame_forms(customerOrder),
                       'orderItemForms': build_order_item_forms(customerOrder), 'orderPaymentForm': orderPaymentForm,
                       'orderPayments': orderPayments, 'customer_notes': customer_notes})

    else:
        orderPayments = OrderPayment.objects.filter(customerOrder=customerOrder)
        orderPaymentForm = OrderPaymentForm(initial={'amountDue': customerOrder.amount_due})
        customer_notes = CustomerNote.objects.filter(customerOrder=customerOrder)
        return render(request, 'epic/order_edit.html',
                      {'customerOrder': customerOrder, 'customerOrderForm': CustomerOrderForm(instance=customerOrder),
                       'orderFrameForms': build_order_frame_forms(customerOrder),
                       'orderItemForms': build_order_item_forms(customerOrder), 'orderPaymentForm': orderPaymentForm,
                       'orderPayments': orderPayments, 'customer_notes': customer_notes})


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
        # get the quote you are basing it on and create a copy_quote
        old_quote = get_object_or_404(Quote, pk=pk)
        quote_same_name = Quote.objects.filter(customer=old_quote.customer, quote_desc=old_quote.quote_desc).count()
        # copy quote details
        new_quote = old_quote
        new_quote.pk = None
        new_quote.version = quote_same_name + 1
        new_quote.quote_status = INITIAL
        new_quote.created_by = request.user
        new_quote.save()

        # update old quote to archived
        # old_quote.quote_status = ARCHIVED
        # old_quote.save()

        # get parts from old quote and copy across to new_quote
        old_quoteParts = QuotePart.objects.filter(quote=old_quote)

        if new_quote.is_bike():
            line_count = 1
            # replicate the changes from the first quote
            for old_quotePart in old_quoteParts:
                try:
                    new_quotePart = QuotePart.objects.get(quote=new_quote, partType=old_quotePart.partType)
                    # already have a part of this type update it to reflect this one
                    new_quotePart.part = old_quotePart.part
                    new_quotePart.quantity = old_quotePart.quantity
                    new_quotePart.cost_price = old_quotePart.cost_price
                    new_quotePart.sell_price = old_quotePart.sell_price
                    new_quotePart.save()
                except MultipleObjectsReturned:
                    messages.info(request, 'Could not copy details for part: ' + old_quotePart.partType)
                except ObjectDoesNotExist:
                    line_count = line_count + 1
                    new_quotePart = old_quotePart
                    new_quotePart.quote = new_quote
                    new_quotePart.pk = None
                    new_quotePart.line = line_count
                    new_quotePart.save()
            # display the bike based quote copy page
            return HttpResponseRedirect(reverse('quote_copy_bike', args=(new_quote.id,)))
        else:
            # replicate items on first quote
            for old_quotePart in old_quoteParts:
                new_quotePart = old_quotePart
                new_quotePart.pk = None
                new_quotePart.quote = new_quote
                new_quotePart.save()
            # display the simple quote edit page
            return HttpResponseRedirect(reverse('quote_edit_simple', args=(new_quote.id,)))


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
    quote_page = 'epic/quote_edit_bike.html'
    customerFittings = Fitting.objects.filter(customer=quote.customer)
    customer_notes = CustomerNote.objects.filter(quote=quote)
    if request.method == "POST":
        # get back the form from the page to save changes
        quoteForm = QuoteBikeForm(request.POST, instance=quote)
        quoteSimpleAddPart = QuoteSimpleAddPartForm(request.POST)
        fittingForm = QuoteFittingForm(request.POST, prefix='fitting')
        old_sell_price = quote.sell_price

        if quoteForm.is_valid():
            quote = quoteForm.save()
            create_customer_note(request, quote.customer, quote, None)
            customer_notes = CustomerNote.objects.filter(quote=quote)

            quotePartObjects = QuotePart.objects.filter(quote=quote)
            for quotePart in quotePartObjects:
                quoteBikeChangePartForm = QuoteBikeChangePartForm(request.POST, request.FILES,
                                                                  prefix="QP" + str(quotePart.id))
                if quoteBikeChangePartForm.is_valid():
                    update_quote_part_from_form(quotePart, quoteBikeChangePartForm, request)
                else:
                    # quote part formset not valid
                    messages.error(request, 'Part failed validation' + str(quotePart))
                    return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote), 'quote': quote,
                                                        'quoteSections': get_quote_section_parts_and_forms(quote),
                                                        'fittingForm': fittingForm,
                                                        'customerFittings': customerFittings,
                                                        'quoteSimpleAddPart': quoteSimpleAddPart,
                                                        'customer_notes': customer_notes})

            # get attributes updated for quote
            save_quote_part_attributes(quote, request)

            if quoteSimpleAddPart.is_valid():
                part = validate_and_create_part(quoteSimpleAddPart, request)
                if part is not None:
                    quote_line = len(quotePartObjects) + 1
                    create_quote_part(quoteSimpleAddPart, quote.pk, part.pk, quote_line)
            else:
                # quoteSimpleAddPart not valid
                messages.error(request, 'New Part failed validation')
                return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote), 'quote': quote,
                                                    'quoteSections': get_quote_section_parts_and_forms(quote),
                                                    'fittingForm': fittingForm, 'customerFittings': customerFittings,
                                                    'quoteSimpleAddPart': quoteSimpleAddPart,
                                                    'customer_notes': customer_notes})

            if fittingForm.has_changed():
                if fittingForm.is_valid():
                    fitting = create_fitting(quote.customer, fittingForm)

                    # update the fitting value on the quote and re-save
                    quote.fitting = fitting
                    quote.save()
                    customerFittings = Fitting.objects.filter(customer=quote.customer)
                    fittingForm = QuoteFittingForm(prefix='fitting')

                else:
                    # fittingForm not valid
                    logging.getLogger("error_logger").error(fittingForm.errors.as_json())
                    messages.error(request, 'Fitting form failed validation')
                    return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote), 'quote': quote,
                                                        'quoteSections': get_quote_section_parts_and_forms(quote),
                                                        'fittingForm': fittingForm,
                                                        'customerFittings': customerFittings,
                                                        'quoteSimpleAddPart': quoteSimpleAddPart,
                                                        'customer_notes': customer_notes})
            else:
                # get the currently selected fitting and add it to the quote.
                id_fitting = request.POST.get('id_fitting', None)
                if id_fitting is not None:
                    fitting = Fitting.objects.get(pk=id_fitting)
                    # update the fitting value on the quote and re-save
                    quote.fitting = fitting
                    quote.save()

            quote.recalculate_prices()
            # if sell price has changed blank keyed value and reset quote status
            if old_sell_price != quote.sell_price:
                quote.keyed_sell_price = None
                quote.quote_status = INITIAL
                quote.save()

            # Do something. Should generally end with a redirect. For example:
            return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote), 'quote': quote,
                                                'quoteSections': get_quote_section_parts_and_forms(quote),
                                                'fittingForm': fittingForm, 'customerFittings': customerFittings,
                                                'quoteSimpleAddPart': QuoteSimpleAddPartForm(empty_permitted=True),
                                                'customer_notes': customer_notes})
        else:
            # quoteForm not valid
            logging.getLogger("error_logger").error(quoteForm.errors.as_json())
            return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote), 'quote': quote,
                                                'quoteSections': get_quote_section_parts_and_forms(quote),
                                                'fittingForm': fittingForm, 'customerFittings': customerFittings,
                                                'quoteSimpleAddPart': quoteSimpleAddPart,
                                                'customer_notes': customer_notes})
    else:
        quoteSimpleAddPart = QuoteSimpleAddPartForm(empty_permitted=True)
        fittingForm = QuoteFittingForm(prefix='fitting')
        return render(request, quote_page, {'quoteForm': QuoteBikeForm(instance=quote), 'quote': quote,
                                            'quoteSections': get_quote_section_parts_and_forms(quote),
                                            'fittingForm': fittingForm, 'customerFittings': customerFittings,
                                            'quoteSimpleAddPart': quoteSimpleAddPart,
                                            'customer_notes': customer_notes})  #


# edit a quote based on a specific frame
@login_required
def quote_edit_simple(request, pk):
    quote = get_object_or_404(Quote, pk=pk)
    quote.recalculate_prices()
    old_sell_price = 0 + quote.sell_price
    customer_notes = CustomerNote.objects.filter(quote=quote)
    quote_page = 'epic/quote_edit_simple.html'
    if request.method == "POST":
        # get back the form from the page to save changes
        quote_form = QuoteSimpleForm(request.POST, instance=quote)

        # get quote parts as they existed before update
        quote_parts = QuotePart.objects.filter(quote=quote)
        quote_part_forms = []

        # get back all the quote part forms from the page
        for quote_part in quote_parts:
            quote_part_form = QuotePartForm(request.POST, request.FILES, instance=quote_part,
                                            prefix="QP" + str(quote_part.id))
            quote_part_forms.append(quote_part_form)

        zipped_values = zip(quote_parts, quote_part_forms)
        quoteSimpleAddPart = QuoteSimpleAddPartForm(request.POST)
        if quote_form.is_valid():
            quote = quote_form.save()
            create_customer_note(request, quote.customer, quote, None)
            customer_notes = CustomerNote.objects.filter(quote=quote)

            for quote_part_form in quote_part_forms:
                if quote_part_form.is_valid():
                    quote_part_form.save()
                else:
                    # quote part formset not valid
                    messages.error(request, 'Part failed validation')
                    logging.getLogger("error_logger").error(quote_part_form.errors.as_json())
                    return render(request, quote_page, {'quote_form': QuoteSimpleForm(instance=quote), 'quote': quote,
                                                        'quoteSimpleAddPart': quoteSimpleAddPart,
                                                        'zipped_values': zipped_values,
                                                        'customer_notes': customer_notes})

            if quoteSimpleAddPart.is_valid():
                part = validate_and_create_part(quoteSimpleAddPart, request)
                if part is not None:
                    quote_line = len(quote_parts) + 1
                    create_quote_part(quoteSimpleAddPart, quote.pk, part.pk, quote_line)
            else:
                # quoteSimpleAddPart not valid
                return render(request, quote_page, {'quote_form': QuoteSimpleForm(instance=quote), 'quote': quote,
                                                    'quoteSimpleAddPart': quoteSimpleAddPart,
                                                    'zipped_values': zipped_values, 'customer_notes': customer_notes})

            # save all ok get new simple part and refresh items

            for quote_part in quote_parts:
                # delete any quote parts no longer required.
                if quote_part.quantity == 0:
                    quote_part.delete()

            # get attributes updated for quote
            save_quote_part_attributes(quote, request)

            quote.recalculate_prices()
            # if sell price has changed blank keyed value
            if old_sell_price != quote.sell_price:
                quote.keyed_sell_price = None
                quote.quote_status = INITIAL
                quote.save()
            quoteSimpleAddPart = QuoteSimpleAddPartForm(empty_permitted=True)
            return render(request, quote_page, {'quote_form': QuoteSimpleForm(instance=quote), 'quote': quote,
                                                'quoteSimpleAddPart': quoteSimpleAddPart,
                                                'zipped_values': get_quote_parts_and_forms(quote),
                                                'customer_notes': customer_notes})

        # quote form not valid
        else:
            logging.getLogger("error_logger").error(quote_form.errors.as_json())
            return render(request, quote_page, {'quote_form': QuoteSimpleForm(instance=quote), 'quote': quote,
                                                'quoteSimpleAddPart': quoteSimpleAddPart,
                                                'zipped_values': zipped_values, 'customer_notes': customer_notes})

    else:
        quoteSimpleAddPart = QuoteSimpleAddPartForm(empty_permitted=True)
        return render(request, quote_page, {'quote_form': QuoteSimpleForm(instance=quote), 'quote': quote,
                                            'quoteSimpleAddPart': quoteSimpleAddPart,
                                            'zipped_values': get_quote_parts_and_forms(quote),
                                            'customer_notes': customer_notes})


# based on code in http://thepythondjango.com/upload-process-csv-file-django/
@login_required
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
        except MultipleObjectsReturned:
            messages.error(request, 'Brand Not unique - use Admin function to enure Brands are unique: ' + brand_name)
            return render(request, "epic/bike_upload.html", data)
        except ObjectDoesNotExist:
            messages.error(request, 'Brand Not found: ' + brand_name)
            return render(request, "epic/bike_upload.html", data)

        bike_name = request.POST.get('bike_name', '')

        csv_file = request.FILES["csv_file"]

        if not csv_file.name.endswith('.csv'):
            messages.error(request, 'File is not CSV type')
            return render(request, "epic/bike_upload.html", data)

        # if file is too large, return
        if csv_file.multiple_chunks():
            messages.error(request, "Uploaded file is too big (%.2f MB)." % (csv_file.size / (1000 * 1000),))
            return render(request, "epic/bike_upload.html", data)

        file_data = csv_file.read().decode("utf-8")

        # split the file into lines
        lines = file_data.split("\n")

        frames = []
        # get non web brands to look for part brands
        non_web_brands = Brand.objects.all()

        # loop over the lines and save them in db. If error , store as string and then display
        for i in range(len(lines)):
            if i == 0:
                #  first line is the ModelAdmin
                model_names = lines[i].split(",")
                for j in range(len(model_names)):
                    if j == 0:
                        frames.append("not a frame")
                    else:
                        model_name = model_names[j]
                        data_dict = {"brand": bike_brand.pk, "frame_name": bike_name, "model": model_name}
                        try:
                            form = FrameForm(data_dict)
                            if form.is_valid():
                                frame = form.save()
                                frames.append(frame)
                            else:
                                logging.getLogger("error_logger").error(form.errors.as_json())
                                return render(request, "epic/bike_upload.html", data)
                        except Exception as e:
                            return render(request, "epic/bike_upload.html", data)
            else:
                # attribute line
                attributes = lines[i].split(",")
                # get the partType for the lilne
                # this is the part name - look it up - fail if not found
                try:
                    shortName = str(attributes[0]).strip()
                    partType = PartType.objects.get(shortName=shortName)
                except MultipleObjectsReturned:
                    messages.error(request, 'PartType Not unique - use Admin function to enure PartTypes are unique: ' +
                                   attributes[0])
                    return render(request, "epic/bike_upload.html", data)
                except ObjectDoesNotExist:
                    messages.error(request, 'PartType Not found' + attributes[0])
                    return render(request, "epic/bike_upload.html", data)

                for j in range(len(attributes)):
                    # ignore the first column - already used
                    if j > 0:
                        # look for brand for part attributes
                        part_name = str(attributes[j]).strip()
                        if len(part_name) > 0:
                            part_brand = find_brand_for_string(part_name, non_web_brands, bike_brand, request)

                            # take the brand name out of the part name
                            part_name = part_name.strip(part_brand.brand_name)
                            part_name = part_name.strip()

                            # now look to see if Part exists, if not add it
                            part_possibles = Part.objects.filter(partType=partType, brand=part_brand,
                                                                 part_name=part_name)
                            if len(part_possibles) == 0:
                                # create a new one and add it
                                data_dict = {"brand": part_brand.pk, "partType": partType.pk, "part_name": part_name}
                                try:
                                    form = PartForm(data_dict)
                                    if form.is_valid():
                                        new_part = form.save()
                                        part_possibles = Part.objects.filter(partType=partType, brand=part_brand,
                                                                             part_name=part_name)
                                    else:
                                        messages.error(request, 'Part save failed')
                                        logging.getLogger("error_logger").error(form.errors.as_json())
                                        return render(request, "epic/bike_upload.html", data)
                                except Exception as e:
                                    return render(request, "epic/bike_upload.html", data)

                            data_dict = {"frame": frames[j].pk, "part": part_possibles[0].pk}
                            try:
                                form = FramePartForm(data_dict)
                                if form.is_valid():
                                    form.save()
                                else:
                                    logging.getLogger("error_logger").error(form.errors.as_json())
                                    return render(request, "epic/bike_upload.html", data)
                            except Exception as e:
                                return render(request, "epic/bike_upload.html", data)

        messages.add_message(request, messages.INFO, 'Bike added:' + bike_name)
    except Exception as e:
        logging.getLogger("error_logger").error("Unable to upload file. " + repr(e))
        messages.error(request, "Unable to upload file. " + repr(e))
        return render(request, "epic/bike_upload.html", data)
    return menu_home(request)


def logout_view(request):
    logout(request)
    # Redirect to a success page.


# build array of forms for customer order item details
def build_order_frame_forms(customer_order):
    orderFrameObjects = OrderFrame.objects.filter(customerOrder=customer_order)
    if orderFrameObjects:
        orderFrameForms = []
        orderFrameDetails = []
        for orderFrame in orderFrameObjects:
            orderFrameForms.append(OrderFrameForm(instance=orderFrame, prefix="OF" + str(orderFrame.id)))
            orderFrameDetails.append(orderFrame.viewOrderFrame())
        zipped_values = zip(orderFrameDetails, orderFrameForms)
        return zipped_values
    return None


# build array of forms for customer order item details
def build_order_item_forms(customer_order):
    orderItemObjects = OrderItem.objects.filter(customerOrder=customer_order)
    if orderItemObjects:
        orderItemDetails = []
        orderItemForms = []
        for orderItem in orderItemObjects:
            orderItemForm = OrderItemForm(instance=orderItem, prefix="OI" + str(orderItem.id))
            orderItemForms.append(orderItemForm)
            orderItemDetails.append(orderItem.quotePart.summary())
        zipped_values = zip(orderItemDetails, orderItemForms)
        return zipped_values
    return None


# simple display ofsections
def quote_parts_for_simple_display(quote):
    quotePartObjects = QuotePart.objects.filter(quote=quote)
    quotePartDetails = []
    for quotePart in quotePartObjects:
        quotePartDetails.append(QuotePartAttribute.objects.filter(quotePart=quotePart))
    # build a merged array
    zipped_values = zip(quotePartObjects, quotePartDetails)
    return zipped_values


# simple display ofsections
def quote_parts_for_bike_display(quote):
    partSections = PartSection.objects.all()
    partSectionDetails = []

    for partSection in partSections:
        quoteParts = []
        quotePartDetails = []
        partTypes = PartType.objects.filter(includeInSection=partSection)
        for partType in partTypes:
            quotePartObjects = QuotePart.objects.filter(quote=quote, partType=partType)
            for quotePart in quotePartObjects:
                quoteParts.append(quotePart)
                quotePartDetails.append(QuotePartAttribute.objects.filter(quotePart=quotePart))
        partSectionDetails.append(zip(quoteParts, quotePartDetails))
    # build a merged array
    zipped_values = zip(partSections, partSectionDetails)
    return zipped_values


# build arrays for bike quote
def get_quote_section_parts_and_forms(quote):
    partSections = PartSection.objects.all()
    partContents = []
    for partSection in partSections:
        partTypes = PartType.objects.filter(includeInSection=partSection)
        sectionParts = []
        sectionForms = []
        for partType in partTypes:
            quotePartObjects = QuotePart.objects.filter(quote=quote, partType=partType)
            for quotePart in quotePartObjects:
                quotePartDetails = [quotePart]
                quotePartAttributes = QuotePartAttribute.objects.filter(quotePart=quotePart)
                quotePartAttributeForms = []
                for quotePartAttribute in quotePartAttributes:
                    quotePartAttributeForms.append(QuotePartAttributeForm(
                        initial={'attribute_name': str(quotePartAttribute.partTypeAttribute),
                                 'attribute_value': quotePartAttribute.attribute_value},
                        prefix="QPA" + str(quotePartAttribute.id)))
                quotePartDetails.append(quotePartAttributeForms)
                sectionParts.append(quotePartDetails)
                if quotePart.part is None:
                    if quotePart.frame_part is not None:
                        sectionForms.append(
                            QuoteBikeChangePartForm(initial={'not_required': True}, prefix="QP" + str(quotePart.id)))
                    else:
                        sectionForms.append(QuoteBikeChangePartForm(prefix="QP" + str(quotePart.id)))
                elif (quotePart.frame_part is not None) and (quotePart.part == quotePart.frame_part.part):
                    sectionForms.append(QuoteBikeChangePartForm(prefix="QP" + str(quotePart.id)))
                else:
                    new_brand = quotePart.part.brand.brand_name
                    new_part_name = quotePart.part.part_name
                    new_quantity = quotePart.quantity
                    new_cost_price = quotePart.cost_price
                    new_sell_price = quotePart.sell_price
                    sectionForms.append(QuoteBikeChangePartForm(
                        initial={'new_brand': new_brand, 'new_part_name': new_part_name, 'new_quantity': new_quantity,
                                 'new_cost_price': new_cost_price, 'new_sell_price': new_sell_price},
                        prefix="QP" + str(quotePart.id)))

        zipped_parts = zip(sectionParts, sectionForms)
        partContents.append(zipped_parts)
    return zip(partSections, partContents)


# build array of quote parts for use on simple quote screen
def get_quote_parts_and_forms(quote):
    quoteParts = []
    quotePartForms = []
    quotePartObjects = QuotePart.objects.filter(quote=quote)
    for quotePart in quotePartObjects:
        quotePartDetails = [quotePart]
        quotePartAttributes = QuotePartAttribute.objects.filter(quotePart=quotePart)
        quotePartAttributeForms = []
        for quotePartAttribute in quotePartAttributes:
            quotePartAttributeForms.append(QuotePartAttributeForm(
                initial={'attribute_name': str(quotePartAttribute.partTypeAttribute),
                         'attribute_value': quotePartAttribute.attribute_value},
                prefix="QPA" + str(quotePartAttribute.id)))
        quotePartDetails.append(quotePartAttributeForms)
        # now put the combined details into the array
        quoteParts.append(quotePartDetails)
        quotePartForms.append(QuoteBikePartForm(instance=quotePart, prefix="QP" + str(quotePart.id)))

    # build a merged array
    zipped_values = zip(quoteParts, quotePartForms)
    return zipped_values


def find_brand_for_string(search_string, brand_list, default_brand, request):
    for brand in brand_list:
        check_prefix = str(brand.brand_name).lower()
        if search_string.lower().startswith(check_prefix):
            return brand
    return default_brand


# another try at creating the part
def validate_and_create_part(form, request):
    if form.cleaned_data['new_part_type'] is not None:
        brand = form.cleaned_data['new_brand']
        if brand is None:
            # look for a brand matching what has been entered for new_brand_add
            brand_name = form.cleaned_data['new_brand_add']
            brand = find_brand_for_name(brand_name, request)
            if brand is None:
                return

        partType = form.cleaned_data['new_part_type']
        part_name = form.cleaned_data['new_part_name']
        return find_or_create_part(brand, partType, part_name)

    else:
        return None


# create quote part
def create_quote_part(form, quote_pk, part_pk, quote_line):
    # now add the quote line
    data_dict = {"quote": quote_pk, "line": quote_line, "partType": form.cleaned_data['new_part_type'].pk,
                 "part": part_pk, "quantity": form.cleaned_data['new_quantity'],
                 "cost_price": form.cleaned_data['new_cost_price'], "sell_price": form.cleaned_data['new_sell_price']}
    form = QuotePartBasicForm(data_dict)
    if form.is_valid():
        form.save()
    else:
        raise forms.ValidationError('QuotePartBasicForm  save failed')


# update an existing quote part based on keyed values
def update_quote_part_from_form(quote_part, form, request):
    not_required = form.cleaned_data['not_required']
    if not_required:
        if (quote_part.frame_part is None) and (
                    QuotePart.objects.filter(quote=quote_part.quote, partType=quote_part.partType).count() > 1):
            quote_part.delete()
        else:
            quote_part.part = None
            quote_part.quantity = 0
            quote_part.cost_price = None
            quote_part.sell_price = None
            quote_part.save()
    else:
        brand_name = form.cleaned_data['new_brand']
        quantity = form.cleaned_data['new_quantity']
        if (brand_name == '') or (quantity == 0):
            # values have been removed reset row
            if quote_part.frame_part is None:
                if QuotePart.objects.filter(quote=quote_part.quote, partType=quote_part.partType).count() > 1:
                    quote_part.delete()
                else:
                    quote_part.part = None
                    quote_part.quantity = 0
                    quote_part.cost_price = None
                    quote_part.sell_price = None
                    quote_part.save()
            else:
                quote_part.part = quote_part.frame_part.part
                quote_part.quantity = 1
                quote_part.cost_price = None
                quote_part.sell_price = None
                quote_part.save()
        else:
            # values have changed
            brand = find_brand_for_name(brand_name, request)
            partType = quote_part.partType
            part_name = form.cleaned_data['new_part_name']
            part = find_or_create_part(brand, partType, part_name)
            if part is not None:
                quote_part.part = part
                quote_part.quantity = quantity
                quote_part.cost_price = form.cleaned_data['new_cost_price']
                quote_part.sell_price = form.cleaned_data['new_sell_price']
                quote_part.save()


def save_quote_part_attributes(quote, request):
    quotePartObjects = QuotePart.objects.filter(quote=quote)
    for quotePart in quotePartObjects:
        # get the attributes as they were at the start
        quotePartAttributes = QuotePartAttribute.objects.filter(quotePart=quotePart)
        # refresh any quote parts
        for quotePartAttribute in quotePartAttributes:
            quotePartAttributeForm = QuotePartAttributeForm(request.POST, request.FILES,
                                                            prefix="QPA" + str(quotePartAttribute.id))
            if quotePartAttributeForm.is_valid():
                if quotePartAttributeForm.cleaned_data['attribute_value'] != quotePartAttribute.attribute_value:
                    quotePartAttribute.attribute_value = quotePartAttributeForm.cleaned_data['attribute_value']
                    quotePartAttribute.save()
            else:
                logging.getLogger("error_logger").error(quotePartAttributeForm.errors.as_json())


# common finr brand
def find_brand_for_name(brand_name, request):
    try:
        brand = Brand.objects.get(brand_name=str(brand_name).strip())
        return brand
    except MultipleObjectsReturned:
        messages.error(request, "Brand Not unique - use Admin function to ensure Brands are unique: " + brand_name)
        return None
    except ObjectDoesNotExist:
        # create a new Brand
        brand = Brand(brand_name=brand_name)
        brand.save()
        return brand


# given values try and create a part
def find_or_create_part(brand, part_type, part_name):
    part_possibles = Part.objects.filter(partType=part_type, brand=brand, part_name=part_name)
    if len(part_possibles) == 0:
        # create a new one and add it
        data_dict = {"brand": brand.pk, "partType": part_type.pk, "part_name": part_name}
        form = PartForm(data_dict)
        if form.is_valid():
            return form.save()
        else:
            raise forms.ValidationError(
                'Part not valid: Brand:' + str(brand) + ', part type:' + str(part_type) + ', part name:' + str(
                    part_name))
    else:
        return part_possibles[0]
