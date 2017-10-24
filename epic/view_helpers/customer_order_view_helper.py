from django.http import HttpResponseRedirect
from django.urls import reverse

from epic.forms import CustomerOrderForm
from epic.models import OrderItem, QuotePart, OrderFrame, CustomerOrder


def create_customer_order_from_quote(request,quote):
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