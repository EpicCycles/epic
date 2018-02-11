from django.shortcuts import render

from epic.models import Brand
from epic.view_helpers.part_view_helper import get_parts_for_js
from epic.helpers.supplier_helper import get_suppliers_requiring_orders


def show_menu(request):
    # request.session.clear()
    return render(request, 'epic/menu_home.html', add_standard_session_data(request, {}))


def add_standard_session_data(request, details_for_page):
    # details_for_page['parts_for_js'] = request.session.get('parts_for_js', get_parts_for_js())
    details_for_page['parts_for_js'] = request.session.get('parts_for_js', get_parts_for_js())
    details_for_page['brands'] = request.session.get('brands', Brand.objects.filter(link__startswith="http"))
    details_for_page['suppliers_requiring_orders'] = request.session.get('suppliers_requiring_orders', get_suppliers_requiring_orders())

    return details_for_page
