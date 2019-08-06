from decimal import Decimal

from django.conf import settings
from django.db import models
from django.utils import timezone

from epic.models.bike_models import Bike
from epic.models.brand_models import Part, Supplier
from epic.models.customer_models import Customer, Fitting
from epic.models.framework_models import PartType

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
    bike = models.ForeignKey(Bike, on_delete=models.CASCADE, blank=True, null=True)
    bike_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    colour = models.CharField(max_length=40, blank=True, null=True)
    colour_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    frame_size = models.CharField(max_length=15, blank=True, null=True)
    fitting = models.ForeignKey(Fitting, on_delete=models.CASCADE, blank=True, null=True)
    quote_status = models.CharField(max_length=1, choices=QUOTE_STATUS_CHOICES, default=INITIAL, )
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, on_delete=models.PROTECT)
    upd_date = models.DateTimeField('Date Updated', auto_now=True)
    club_member = models.BooleanField(default=False)

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
        self.quote_price = None
        self.save()

    def recalculate_price(self):
        old_calculated_price = self.calculated_price
        new_calculated_price = Decimal(0)
        if self.bike:
            if self.bike_price:
                new_calculated_price = new_calculated_price + self.bike_price
            elif self.club_member and self.bike.club_price:
                self.bike_price = self.bike.club_price
                new_calculated_price = new_calculated_price + self.bike.club_price
            elif self.bike.epic_price:
                self.bike_price = self.bike.epic_price
                new_calculated_price = new_calculated_price + self.bike.epic_price
            elif self.bike.rrp:
                self.bike_price = self.bike.rrp
                new_calculated_price = new_calculated_price + self.bike.rrp

            if self.colour and self.colour_price:
                new_calculated_price = new_calculated_price + self.colour_price
            else:
                self.colour_price = None

        for quote_charge in QuoteCharge.objects.filter(quote=self):
            new_calculated_price = new_calculated_price + quote_charge.price

        for quote_part in QuotePart.objects.filter(quote=self):
            quantity = Decimal(1)
            if quote_part.quantity:
                quantity = quote_part.quantity

            if quote_part.part_price:
                new_calculated_price = new_calculated_price + (quote_part.part_price * quantity)
            if quote_part.trade_in_price:
                new_calculated_price = new_calculated_price - quote_part.trade_in_price

        if new_calculated_price != old_calculated_price:
            self.quote_price = None

        self.calculated_price = new_calculated_price
        self.save()

    class Meta:
        # order most recent first
        ordering = ('-created_date', 'quote_desc')


class QuotePart(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE)
    partType = models.ForeignKey(PartType, on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, blank=True, null=True)
    # part can be None if the part has not been selected
    part = models.ForeignKey(Part, on_delete=models.CASCADE, blank=True, null=True)
    quantity = models.IntegerField(default=1, blank=True, null=True)
    trade_in_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    part_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    not_required = models.BooleanField(default=False)
    additional_data = models.CharField(max_length=40, blank=True, null=True)


class Charge(models.Model):
    charge_name = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=9, decimal_places=2)
    upd_date = models.DateTimeField(auto_now=True)
    upd_by = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, on_delete=models.PROTECT)


class QuoteCharge(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE)
    charge = models.ForeignKey(Charge, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=9, decimal_places=2)

