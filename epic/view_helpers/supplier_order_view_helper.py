import logging

from django.shortcuts import render
from django.contrib import messages
from epic.forms import SupplierOrderPossibleForm, SupplierOrderForm
from epic.models import OrderFrame, BIKE, OrderItem, PART, SupplierOrderItem
from epic.view_helpers.menu_view_helper import show_menu, add_standard_session_data


def show_orders_required_for_supplier(request, supplier):
    possible_items = []

    # get back frame and quote details for supplier
    bikes = OrderFrame.objects.filter(supplier=supplier, supplierOrderItem=None).select_related('quote__customer')
    for bike in bikes:
        if bike.customerOrder.cancelled_date is None:
            item_description = str(bike.frame)
            quote = bike.quote
            quote_name = str(quote)
            customer = quote.customer
            customer_name = str(customer)
            supplier_order_possible = SupplierOrderPossibleForm(
                initial={'item_description': item_description, 'quote_name': quote_name, 'customer_name': customer_name,
                         'item_type': BIKE, 'item_id': bike.id}, prefix='OF' + str(bike.id))
            possible_items.append(supplier_order_possible)

    # get back part  and quote details for supplier
    parts = OrderItem.objects.filter(supplier=supplier, supplierOrderItem=None).select_related(
        'quotePart__quote__customer')
    for part in parts:
        if part.customerOrder.cancelled_date is None:
            quotePart = part.quotePart
            item_description = str(quotePart)
            quote = quotePart.quote
            quote_name = str(quote)
            customer = quote.customer
            customer_name = str(customer)
            supplier_order_possible = SupplierOrderPossibleForm(
                initial={'item_description': item_description, 'quote_name': quote_name, 'customer_name': customer_name,
                         'item_type': PART, 'item_id': part.id}, prefix='OP' + str(part.id))
            possible_items.append(supplier_order_possible)

    return render(request, 'epic/supplier_order_build.html',
                  add_standard_session_data(request, {'supplier': supplier, 'supplier_order_form': SupplierOrderForm(
                      initial={'supplier': supplier}),
                                                      'possible_items': possible_items}))


def save_supplier_order(request, supplier):
    # get back all the forms before anything else
    supplier_order_form = SupplierOrderForm(request.POST, request.FILES)
    form_possible_items = []
    bikes = OrderFrame.objects.filter(supplier=supplier, supplierOrderItem=None)
    for bike in bikes:
        form_possible_items.append(SupplierOrderPossibleForm(request.POST, request.FILES, prefix='OF' + str(bike.id)))
    parts = OrderItem.objects.filter(supplier=supplier, supplierOrderItem=None)
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
                    item_description = supplier_order_possible.cleaned_data['item_description']
                    supplier_order_item = SupplierOrderItem.objects.create_supplier_order_item(supplierOrder,
                                                                                               item_description)
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
                          add_standard_session_data(request,
                                                    {'supplier': supplier, 'supplier_order_form': supplier_order_form,
                                                     'possible_items': form_possible_items}))
        else:
            if len(new_form_possible_items) > 0:
                return render(request, 'epic/supplier_order_build.html',
                              add_standard_session_data(request, {'supplier': supplier,
                                                                  'supplier_order_form': supplier_order_form,
                                                                  'possible_items': new_form_possible_items}))
            else:
                # order created an no items remained return to the menu
                return show_menu(request)
    else:
        logging.getLogger("error_logger").error(supplier_order_form.errors.as_json())
        variables = add_standard_session_data(request,
                                              {'supplier': supplier, 'supplier_order_form': supplier_order_form,
                                               'possible_items': form_possible_items})
        return render(request, 'epic/supplier_order_build.html', variables)
