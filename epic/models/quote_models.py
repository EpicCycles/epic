from django.conf import settings
from django.db import models
from django.db.models import CharField, TextField
from django.utils import timezone

from epic.models.bike_models import Bike
from epic.models.brand_models import Part
from epic.models.customer_models import Customer, Fitting
from epic.models.framework_models import PartType, PartTypeAttribute

INITIAL = '1'
ISSUED = '2'
ARCHIVED = '3'
ORDERED = '4'
CANCELLED = '5'
QUOTE_STATUS_CHOICES = ((INITIAL, 'New'), (ISSUED, 'Issued'), (ARCHIVED, 'Archived'), (ORDERED, 'Order Created'),)


class Quote(models.Model):
    customer = models.ForeignKey(Customer, related_name='quotes', on_delete=models.CASCADE)
    quote_desc = models.CharField(max_length=120)
    version = models.PositiveSmallIntegerField(default=1, editable=False)
    created_date = models.DateTimeField(auto_now_add=True)
    issued_date = models.DateTimeField(null=True)
    quote_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    bike = models.ForeignKey(Bike, on_delete=models.CASCADE, blank=True, null=True)
    colour = models.CharField(max_length=40, blank=True, null=True)
    colour_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    frame_size = models.CharField(max_length=15, blank=True, null=True)
    fitting = models.ForeignKey(Fitting, on_delete=models.CASCADE, blank=True, null=True)
    quote_status = models.CharField(max_length=1, choices=QUOTE_STATUS_CHOICES, default=INITIAL, )
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, on_delete=models.PROTECT)
    upd_date = models.DateTimeField('Date Updated', auto_now=True)

    # set issuedDate whe quote is issued to a customer
    def issue(self):
        self.issued_date = timezone.now()
        self.quote_status = ISSUED
        self.save()

    def archive(self):
        self.quote_status = ARCHIVED
        self.save()

    def archive_reset(self):
        self.quote_status = INITIAL
        self.save()

    class Meta:
        # order most recent first
        ordering = ('-created_date', 'quote_desc')


class QuotePart(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE)
    partType = models.ForeignKey(PartType, on_delete=models.CASCADE)
    # part can be None if the part has not been selected
    part = models.ForeignKey(Part, on_delete=models.CASCADE, blank=True, null=True)
    quantity = models.IntegerField(default=1, blank=True, null=True)
    quote_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    replacement_part = models.BooleanField(default=False)


# PartTypeAttribute linked to quote parts
class QuotePartAttribute(models.Model):
    quotePart = models.ForeignKey(QuotePart, on_delete=models.CASCADE)
    partTypeAttribute = models.ForeignKey(PartTypeAttribute, on_delete=models.CASCADE)
    attribute_value = models.CharField(max_length=40, null=True)

    class Meta:
        indexes = [models.Index(fields=["quotePart", "partTypeAttribute"]), ]
