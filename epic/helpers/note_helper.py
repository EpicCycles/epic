from epic.models import CustomerNote


def create_note_for_requote(quote, user):
    note_text = "Quote set back to Initial"
    customerNote = CustomerNote(customer=quote.customer, quote=quote, note_text=note_text, created_by=user,
                                customer_visible=False)
    customerNote.save()


def create_note_for_quote_archive(quote, user):
    note_text = "Quote Archived"
    customerNote = CustomerNote(customer=quote.customer, quote=quote, note_text=note_text, created_by=user,
                                customer_visible=False)
    customerNote.save()


def create_note_for_quote_order(quote, user):
    note_text = "Quote added to order"
    customerNote = CustomerNote(customer=quote.customer, quote=quote, note_text=note_text, created_by=user,
                                customer_visible=False)
    customerNote.save()


def create_note_customer_order_cancel(customer_order, user):
    """

    :type customer_order: CustomerOrder
    """
    note_text = "Customer Order Cancelled"
    customerNote = CustomerNote(customer=customer_order.customer, customerOrder=customer_order, note_text=note_text,
                                created_by=user, customer_visible=False)
    customerNote.save()


def create_note_customer_order_create(customer_order, user):
    """

    :type customer_order: CustomerOrder
    """
    note_text = "Customer Order Created"
    customerNote = CustomerNote(customer=customer_order.customer, customerOrder=customer_order, note_text=note_text,
                                created_by=user, customer_visible=False)
    customerNote.save()  # for info  #     customer = models.ForeignKey(Customer, on_delete=models.CASCADE)  #     quote = models.ForeignKey(Quote, on_delete=models.CASCADE, blank=True, null=True)  #     customerOrder = models.ForeignKey(CustomerOrder, on_delete=models.CASCADE, blank=True, null=True)  #     note_text = models.TextField('Notes')  #     created_on = models.DateTimeField(auto_now_add=True)  #     created_by = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True)  #     customer_visible = models.BooleanField(default=False)
