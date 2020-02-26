from decimal import Decimal

from django.conf import settings
from django.db import models
from django.utils import timezone

from epic.models.bike_models import Bike
from epic.models.customer_models import Customer

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
    calculated_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    fixed_price_total = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    charges_total = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    total_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    bike = models.ForeignKey(Bike, on_delete=models.CASCADE, blank=True, null=True)
    bike_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    colour = models.CharField(max_length=40, blank=True, null=True)
    frame_size = models.CharField(max_length=15, blank=True, null=True)
    fitting = models.PositiveSmallIntegerField(null=True)
    quote_status = models.CharField(max_length=1, choices=QUOTE_STATUS_CHOICES, default=INITIAL, )
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, on_delete=models.PROTECT)
    upd_date = models.DateTimeField('Date Updated', auto_now=True)
    club_member = models.BooleanField(default=False)
    quoteParts = models.TextField(blank=True, null=True)
    charges = models.TextField(blank=True, null=True)
    answers = models.TextField(blank=True, null=True)

    def issue(self):
        self.issued_date = timezone.now()
        self.quote_status = ISSUED
        self.save()

    def order(self):
        self.issued_date = timezone.now()
        self.quote_status = ORDERED
        self.save()

    def archive(self):
        self.quote_status = ARCHIVED
        self.save()

    def archive_reset(self):
        self.quote_status = INITIAL
        self.quote_price = None
        self.issued_date = None
        self.save()

    class Meta:
        # order most recent first
        ordering = ('-created_date', 'quote_desc')


class Charge(models.Model):
    charge_name = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    percentage = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    can_be_zero = models.BooleanField(default=False)
    fixed_charge = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    upd_date = models.DateTimeField(auto_now=True)
    upd_by = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, on_delete=models.PROTECT)


class Question(models.Model):
    question = models.CharField(max_length=200, unique=True)
    charge = models.ForeignKey(Charge, on_delete=models.CASCADE, blank=True, null=True)
    deleted = models.BooleanField(default=False)
    bike_only = models.BooleanField(default=False)
    upd_date = models.DateTimeField(auto_now=True)
    upd_by = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, on_delete=models.PROTECT)
