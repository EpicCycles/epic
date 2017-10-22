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