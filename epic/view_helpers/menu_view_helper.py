from django.shortcuts import render
from django.urls import reverse

from epic.models import OrderFrame, OrderItem, Supplier, Brand


def show_menu(request):
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





    return render(request, 'epic/menu_home.html',
                  {'brands': brands, 'suppliers_requiring_orders': suppliers_requiring_orders})
