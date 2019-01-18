from django.conf import settings
from django.db import models

from epic.models.customer_models import Customer
from epic.models.quote_models import Quote


# TODO add note for parts/brands/suppliers


class CustomerNote(models.Model):
    customer = models.ForeignKey(Customer, related_name='notes', on_delete=models.CASCADE)
    quote = models.ForeignKey(Quote, related_name='quote', on_delete=models.CASCADE, blank=True, null=True)
    note_text = models.TextField('Notes')
    created_date = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='user', blank=True, null=True,
                                   on_delete=models.PROTECT)
    customer_visible = models.BooleanField(default=False)
