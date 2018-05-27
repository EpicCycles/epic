from django.shortcuts import render

from epic.models import Brand
from epic.view_helpers.part_view_helper import get_parts_for_js
from epic.helpers.supplier_helper import get_suppliers_requiring_orders
from datetime import datetime
from django.core.cache import cache


def show_menu(request):
    # request.session.clear()
    request.session['bike_reviews'] = []
    return render(request, 'epic/menu_home.html', add_standard_session_data(request, {}))


def set_parts_for_js_in_cache():
    print('{timestamp} -- set_parts_for_js_in_cache started'.format(timestamp=datetime.utcnow().isoformat()))
    cache.set('parts_for_js',  get_parts_for_js())
    print('{timestamp} -- set_parts_for_js_in_cache ended'.format(timestamp=datetime.utcnow().isoformat()))


def get_parts_for_js_from_cache():
    parts_for_js = cache.get('parts_for_js')
    if parts_for_js:
        return parts_for_js
    else:
        print('{timestamp} -- getting parts_for_js from cache but it is not there'.format(
            timestamp=datetime.utcnow().isoformat()))
        set_parts_for_js_in_cache()
        return cache.get('parts_for_js')


def add_standard_session_data(request, details_for_page):
    print('{timestamp} -- add_standard_session_data started'.format(timestamp=datetime.utcnow().isoformat()))
    populate_supplier_order_list(request.session)

    details_for_page['parts_for_js'] = get_parts_for_js_from_cache()
    details_for_page['brands'] = Brand.objects.filter(link__startswith="http")
    details_for_page['suppliers_requiring_orders'] = request.session.get('suppliers_requiring_orders')

    print('{timestamp} -- add_standard_session_data finished'.format(timestamp=datetime.utcnow().isoformat()))
    return details_for_page


def add_standard_session_data_to_context(context):
    context['parts_for_js'] = get_parts_for_js_from_cache()
    populate_brands_list(context)
    populate_supplier_order_list(context)

    return context


def populate_brands_list(thing_to_add_to):
    brands = thing_to_add_to.get('brands')
    if not brands:
        thing_to_add_to['brands'] = Brand.objects.filter(link__startswith="http")


def populate_supplier_order_list(thing_to_add_to):
    suppliers_requiring_orders = thing_to_add_to.get('suppliers_requiring_orders')
    if not suppliers_requiring_orders:
        print('{timestamp} -- populate_supplier_order_list started'.format(timestamp=datetime.utcnow().isoformat()))
        thing_to_add_to['suppliers_requiring_orders'] = get_suppliers_requiring_orders()
        print('{timestamp} -- populate_supplier_order_list ended'.format(timestamp=datetime.utcnow().isoformat()))
