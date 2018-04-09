from epic.models import Supplier, OrderFrame, OrderItem


def get_suppliers_requiring_orders():
    """

    Returns: list of suppliers with items outstanding on customer orders

    """
    order_frames = OrderFrame.objects.filter(supplierOrderItem=None).select_related('supplier')
    order_items = OrderItem.objects.filter(supplierOrderItem=None).select_related('supplier')
    suppliers_requiring_orders = []
    for order_frame in order_frames:
        if order_frame.supplier not in suppliers_requiring_orders:
            suppliers_requiring_orders.append(order_frame.supplier)

    for order_item in order_items:
        if order_item.supplier not in suppliers_requiring_orders:
            suppliers_requiring_orders.append(order_item.supplier)

    return suppliers_requiring_orders
