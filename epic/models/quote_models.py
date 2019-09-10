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
    fixed_price_total = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    charges_total = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    total_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    bike = models.ForeignKey(Bike, on_delete=models.CASCADE, blank=True, null=True)
    bike_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    colour = models.CharField(max_length=40, blank=True, null=True)
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
        self.issued_date = None
        self.save()

    def recalculate_price(self):
        old_calculated_price = self.calculated_price
        new_calculated_price = Decimal(0)
        fixed_price_total = Decimal(0)
        charges_total = Decimal(0)
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

        for quote_part in QuotePart.objects.filter(quote=self):
            if not quote_part.total_price:
                quote_part.save()
            if quote_part.fixed_price:
                fixed_price_total = fixed_price_total + quote_part.total_price
            else:
                new_calculated_price = new_calculated_price + quote_part.total_price

        if new_calculated_price != old_calculated_price:
            self.quote_price = None

        new_total = new_calculated_price + fixed_price_total
        if self.quote_price:
            new_total = self.quote_price + fixed_price_total

        for quote_charge in QuoteCharge.objects.filter(quote=self):
            if quote_charge.charge.percentage:
                quote_charge.price = new_total * quote_charge.charge.percentage / 100
                quote_charge.save()

            charges_total = charges_total + quote_charge.price

        self.calculated_price = new_calculated_price
        self.fixed_price_total = fixed_price_total
        self.charges_total = charges_total
        if self.quote_price:
            self.total_price = self.quote_price + fixed_price_total + charges_total
        else:
            self.total_price = new_calculated_price + fixed_price_total + charges_total
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
    total_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    not_required = models.BooleanField(default=False)
    additional_data = models.CharField(max_length=40, blank=True, null=True)
    fixed_price = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        new_total_price = 0
        if self.trade_in_price:
            new_total_price = new_total_price - self.trade_in_price
        if self.part_price:
            if not self.quantity:
                self.quantity = 1
            new_total_price = new_total_price + (self.quantity * self.part_price)
        self.total_price = new_total_price

        super().save(*args, **kwargs)


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


class QuoteCharge(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE)
    charge = models.ForeignKey(Charge, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=9, decimal_places=2)


class QuoteAnswer(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.BooleanField(default=False)
