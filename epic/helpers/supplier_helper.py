from epic.models import Supplier, OrderFrame, OrderItem


def get_suppliers_requiring_orders():
    """

    Returns: list of suppliers with items outstanding on customer orders

    """
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

    return suppliers_requiring_orders
