from __future__ import unicode_literals

from datetime import date

import re
from django.db import models
from django.db.models import CharField, TextField
from django.urls import reverse
from django.utils import timezone

# added to allow user details on models and history tables
from django.conf import settings

from epic.form_helpers.regular_expressions import EMAIL_REGEX, POSTCODE_PATTERN
from epic.model_helpers.lookup_helpers import UpperCase

HOME = 'H'
WORK = 'W'
MOBILE = 'M'
NUMBER_TYPE_CHOICES = ((HOME, 'Home'), (WORK, 'Work'), (MOBILE, 'Mobile'),)
CUST = 'C'
EPIC = 'E'
FITTING_TYPE_CHOICES = ((CUST, 'Customer'), (EPIC, 'Epic'),)

BIKE = 'B'
PART = 'P'
QUOTE_TYPE_CHOICES = ((BIKE, 'Bike'), (PART, 'Parts'),)
INITIAL = '1'
ISSUED = '2'
ARCHIVED = '3'
ORDERED = '4'
CANCELLED = '5'
QUOTE_STATUS_CHOICES = ((INITIAL, 'New'), (ISSUED, 'Issued'), (ARCHIVED, 'Archived'), (ORDERED, 'Order Created'),)
ORDER_STATUS_CHOICES = ((INITIAL, 'New'), (ISSUED, 'Issued'), (ARCHIVED, 'Archived'), (CANCELLED, 'Cancelled'),)
TEXT = '1'
NUMBER = '2'
RADIO = '3'
SELECT = '4'
MULTIPLE_C = '5'
MULTIPLE_S = '6'

DISPLAY_CHOICES = ((TEXT, 'Text'), (NUMBER, 'Numeric'), (RADIO, 'Single - Radio'), (SELECT, 'Single - Dropdown'),
                   (MULTIPLE_C, 'Multiple - Checkbox'), (MULTIPLE_S, 'Multiple - Dropdown'))

CharField.register_lookup(UpperCase)
TextField.register_lookup(UpperCase)


class Customer(models.Model):
    first_name = models.CharField(max_length=60, blank=False, null=False)
    last_name = models.CharField(max_length=60, blank=False, null=False)
    email = models.EmailField(max_length=100, blank=True)
    add_date = models.DateTimeField('Date Added', auto_now_add=True)
    upd_date = models.DateTimeField('Date Updated', auto_now=True)

    def save(self, *args, **kwargs):
        # validate data.
        if self.first_name is None or self.first_name == '':
            raise ValueError('Missing first name')
        if self.last_name is None or self.last_name == '':
            raise ValueError('Missing last name')
        if self.email:
            match = re.match(EMAIL_REGEX, self.email)
            if match is None or self.email == '':
                raise ValueError('Invalid email', self.email)

        if Customer.objects.filter(first_name=self.first_name,
                                   last_name=self.last_name, email=self.email).exclude(id=self.id).exists():
            raise ValueError('Customer with these values already exists')

        super(Customer, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('edit_customer', args={self.pk})

    def __str__(self):
        display_value = f'{self.first_name} {self.last_name}'
        if self.email:
            display_value += f'({self.email})'
        else:
            display_value += f'(Last Updated:{self.upd_date:%b %d, %Y})'
        return display_value

    class Meta:
        indexes = [models.Index(fields=["first_name", "last_name", "email"]), ]
        ordering = ['last_name', 'first_name', '-add_date']


class CustomerPhone(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)

    number_type = models.CharField(max_length=1, choices=NUMBER_TYPE_CHOICES, default=HOME, )
    telephone = models.CharField(max_length=60, blank=True)
    add_date = models.DateTimeField('date added', auto_now_add=True)
    upd_date = models.DateTimeField('Date Updated', auto_now=True)

    def __str__(self):
        return f'{dict(NUMBER_TYPE_CHOICES).get(self.number_type)} {self.telephone}'

    def save(self, *args, **kwargs):
        if self.number_type is None or self.number_type == '':
            raise ValueError('Missing number type')
        if self.telephone is None or self.telephone == '':
            raise ValueError('Missing last name')

        if self.number_type not in [HOME, WORK, MOBILE]:
            raise ValueError('Number type must be Home, Work or Mobile')

        if CustomerPhone.objects.filter(customer=self.customer,
                                        telephone=self.telephone).exclude(id=self.id).exists():
            raise ValueError('Customer with these values already exists')

        super(CustomerPhone, self).save(*args, **kwargs)


class CustomerAddress(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    address1 = models.CharField(max_length=200)
    address2 = models.CharField(max_length=200, blank=True)
    address3 = models.CharField(max_length=200, blank=True)
    address4 = models.CharField(max_length=200, blank=True)
    postcode = models.CharField(max_length=200)
    add_date = models.DateTimeField('date added', auto_now_add=True)
    upd_date = models.DateTimeField('Date Updated', auto_now=True)

    def __str__(self):
        returnAddress = self.address1
        if self.address2:
            returnAddress += f', {self.address2}'
        if self.address3:
            returnAddress += f', {self.address3}'
        if self.address4:
            returnAddress += f', {self.address4}'
        returnAddress += f', {self.postcode}'
        return returnAddress

    def save(self, *args, **kwargs):
        if self.address1 is None or self.address1 == '':
            raise ValueError('Missing address1')
        if self.postcode is None or self.postcode == '':
            raise ValueError('Missing postcode')
        match = re.match(POSTCODE_PATTERN, self.postcode)
        if match is None:
            raise ValueError('Invalid postcode', self.postcode)

        if CustomerAddress.objects.filter(customer=self.customer,
                                          address1=self.address1, postcode=self.postcode).exclude(id=self.id).exists():
            raise ValueError('Customer with these values already exists')

        super(CustomerAddress, self).save(*args, **kwargs)


class Fitting(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    fitting_type = models.CharField('Type', max_length=1, choices=FITTING_TYPE_CHOICES, default=EPIC, )
    saddle_height = models.CharField('Saddle Height', max_length=20)
    bar_height = models.CharField('Bar Height', max_length=20)
    reach = models.CharField('Reach', max_length=20)
    notes = models.CharField(max_length=200, blank=True)
    add_date = models.DateTimeField('date added', auto_now_add=True)
    upd_date = models.DateTimeField('Date Updated', auto_now=True)

    def __str__(self):
        return f'{dict(FITTING_TYPE_CHOICES).get(self.fitting_type)} - Saddle Height:{self.saddle_height} Bar Height:{self.bar_height} Reach:{self.reach}'

    def save(self, *args, **kwargs):
        if self.saddle_height is None or self.saddle_height == '':
            raise ValueError('Missing saddle height')
        if self.bar_height is None or self.bar_height == '':
            raise ValueError('Missing bar height')
        if self.reach is None or self.reach == '':
            raise ValueError('Missing reach')

        super(Fitting, self).save(*args, **kwargs)


class PartSection(models.Model):
    name = models.CharField(max_length=60, unique=True)
    placing = models.PositiveSmallIntegerField()

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.name is None or self.name == '':
            raise ValueError('Missing name')
        if self.placing is None:
            raise ValueError('Missing placing')
        elif self.placing < 1:
            raise ValueError('Invalid placing')

        super(PartSection, self).save(*args, **kwargs)


    class Meta:
        ordering = ['placing', 'name']


class PartType(models.Model):
    shortName = models.CharField(max_length=60, unique=True)
    description = models.CharField(max_length=100, blank=True, null=True)
    includeInSection = models.ForeignKey(PartSection, on_delete=models.CASCADE)
    placing = models.PositiveSmallIntegerField()
    can_be_substituted = models.BooleanField('Can be substituted', default=False)
    can_be_omitted = models.BooleanField('Can be omitted', default=False)
    customer_facing = models.BooleanField('Show Customer', default=False)

    def __str__(self):
        return self.shortName

    def save(self, *args, **kwargs):
        if self.shortName is None or self.shortName == '':
            raise ValueError('Missing short name')
        if self.placing is None:
            raise ValueError('Missing placing')
        elif self.placing < 1:
            raise ValueError('Invalid placing')

        super(PartType, self).save(*args, **kwargs)

    class Meta:
        unique_together = (("includeInSection", "shortName"),)
        ordering = ('includeInSection', 'placing', 'shortName')


# strings for attributes for PartTypes
class PartTypeAttribute(models.Model):
    partType = models.ForeignKey(PartType, on_delete=models.CASCADE)
    attribute_name = models.CharField(max_length=30)
    in_use = models.BooleanField()
    mandatory = models.BooleanField()
    placing = models.PositiveSmallIntegerField()
    attribute_type = models.CharField(max_length=1, choices=DISPLAY_CHOICES, default=TEXT, )

    def __str__(self):
        return self.attribute_name

    def needs_completing(self):
        return self.in_use and self.mandatory

    class Meta:
        unique_together = (("partType", "attribute_name"),)
        ordering = ('placing',)


# values for part type attributes
class AttributeOptions(models.Model):
    part_type_attribute = models.ForeignKey(PartTypeAttribute, on_delete=models.CASCADE)
    attribute_option = models.CharField(max_length=30)


class Meta:
    unique_together = (("part_type_attribute", "attribute_option"),)
    ordering = ('attribute_option',)


# suppliersfor bikes/parts etc
class Supplier(models.Model):
    supplier_name = models.CharField('Supplier', max_length=100, unique=True)

    def __str__(self):
        return self.supplier_name


class Brand(models.Model):
    brand_name = models.CharField(max_length=50, unique=True)
    link = models.CharField(max_length=100, blank=True)
    supplier = models.ForeignKey(Supplier, blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.brand_name

    # check whether a web kink ispresent
    def has_link(self):
        return self.link is not None

    # build a web link as standard
    def build_link_new_tab(self):
        if self.has_link():
            return '<a target="_blank" class="externalLink" href="' + self.link + '">' + self.brand_name + '</a>'

    class Meta:
        ordering = ('brand_name',)


class PartManager(models.Manager):
    def create_part(self, part_type, brand, part_name):
        """
        creates a Part with the required values
        :param part_type: PartType
        :param brand: Brand
        :param part_name: String
        :return: Part
        """
        return self.create(partType=part_type, brand=brand, part_name=part_name)


class Part(models.Model):
    partType = models.ForeignKey(PartType, on_delete=models.CASCADE)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    part_name = models.CharField(max_length=200)
    objects = PartManager()

    def getJavascriptObject(self):
        return f'brand:"{self.brand.id}",partType:"{self.partType.id}",partName:"{self.part_name}"'

    def __str__(self):
        return f'{self.partType.shortName}: {self.brand.brand_name} {self.part_name}'

    class Meta:
        unique_together = (("partType", "brand", "part_name"),)


class FrameManager(models.Manager):
    def create_frame_sparse(self, brand, frame_name, model):
        return self.create(brand=brand, frame_name=frame_name, model=model)

    def create_frame(self, brand, frame_name, model, description):
        return self.create(brand=brand, frame_name=frame_name, model=model, description=description)


class Frame(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    frame_name = models.CharField(max_length=60)
    model = models.CharField(max_length=60, blank=True)
    description = models.TextField(max_length=400, blank=True)
    colour = models.CharField(max_length=200, blank=True)
    sell_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    sizes = models.CharField(max_length=100, blank=True)

    objects = FrameManager()

    def getJavascriptObject(self):
        return f'brand:"{self.brand.id}",frameId:"{self.id}",frameName:"{self.frame_name}",model:"{self.model}",sellPrice:"{self.sell_price}"'

    def __str__(self):
        if self.model is None:
            return f'{self.brand.brand_name}: {self.frame_name}'
        else:
            return f'{self.brand.brand_name}: {self.frame_name} {self.model}'

    class Meta:
        unique_together = (("brand", "frame_name", "model"),)
        ordering = ('brand', 'frame_name', 'model')


# Manager for PramePart
class FramePartManager(models.Manager):
    def create_frame_part(self, frame, part):
        return self.create(frame=frame, part=part)


class FramePart(models.Model):
    frame = models.ForeignKey(Frame, on_delete=models.CASCADE)
    part = models.ForeignKey(Part, on_delete=models.CASCADE)

    objects = FramePartManager()

    def __str__(self):
        return f'{self.part.partType.shortName}: {str(self.part.brand)} {self.part.part_name}'

    class Meta:
        unique_together = (("frame", "part"),)
        ordering = ('pk',)


# Manager for PramePart
class FrameExclusionManager(models.Manager):
    def create_frame_exclusion(self, frame, part_type):
        return self.create(frame=frame, partType=part_type)


class FrameExclusion(models.Model):
    frame = models.ForeignKey(Frame, on_delete=models.CASCADE)
    partType = models.ForeignKey(PartType, on_delete=models.CASCADE)

    objects = FrameExclusionManager()

    def __str__(self):
        return f'{str(self.partType)} n/a'

    class Meta:
        unique_together = (("frame", "partType"),)


# # Managers for CustomerOrder
class CustomerOrderManager(models.Manager):
    # create a new CustomerOrder for a quote
    def create_customer_order(self, quote):
        customer = quote.customer
        order_total = quote.keyed_sell_price
        amount_due = quote.keyed_sell_price
        customerOrder = self.create(customer=customer, order_total=order_total, amount_due=amount_due)
        # do something with the customerOrder
        return customerOrder


# Order Header
class CustomerOrder(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)
    completed_date = models.DateTimeField(null=True, blank=True)
    customer_required_date = models.DateField(null=True, blank=True)
    final_date = models.DateField(null=True, blank=True)
    order_total = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    amount_due = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    discount_percentage = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    cancelled_date = models.DateTimeField(null=True)
    objects = CustomerOrderManager()

    class Meta:
        ordering = ('-created_date', 'customer')

    def __str__(self):
        if self.cancelled_date:
            return f' Order Number: {self.pk}, cancelled {self.cancelled_date:%b %d, %Y} ({str(self.customer)})'
        elif self.completed_date:
            return f' Order Number: {self.pk}, completed {self.completed_date:%b %d, %Y} ({str(self.customer)})'

        return f' Order Number: {self.pk}, created {self.created_date:%b %d, %Y} ({str(self.customer)})'

    # calculate the outstanding balance
    def calculate_balance(self):
        # loop through the payments taken
        self.amount_due = self.order_total

        order_payments = OrderPayment.objects.filter(customerOrder=self)
        for orderPayment in order_payments:
            if not (orderPayment.amount is None):
                self.amount_due -= orderPayment.amount

    def can_be_cancelled(self):
        if self.cancelled_date:
            return False
        elif OrderFrame.objects.filter(customerOrder=self, supplierOrderItem__isnull=False).exists():
            return False
        elif OrderItem.objects.filter(customerOrder=self, supplierOrderItem__isnull=False).exists():
            return False
        else:
            # no orders placed
            return True


class Quote(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    quote_desc = models.CharField(max_length=60)
    version = models.PositiveSmallIntegerField(default=1, editable=False)
    created_date = models.DateTimeField(auto_now_add=True)
    issued_date = models.DateTimeField(null=True)
    cost_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    sell_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)

    # frame will be null for a quote for items only
    frame = models.ForeignKey(Frame, on_delete=models.CASCADE, blank=True, null=True)
    frame_sell_price = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    colour = models.CharField(max_length=40, blank=True, null=True)
    colour_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    frame_size = models.CharField(max_length=15, blank=True, null=True)
    fitting = models.ForeignKey(Fitting, on_delete=models.CASCADE, blank=True, null=True)
    keyed_sell_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    quote_type = models.CharField(max_length=1, choices=QUOTE_TYPE_CHOICES, default=BIKE, )
    quote_status = models.CharField(max_length=1, choices=QUOTE_STATUS_CHOICES, default=INITIAL, )
    customerOrder = models.ForeignKey(CustomerOrder, on_delete=models.CASCADE, blank=True, null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, on_delete=models.PROTECT)
    can_be_issued = models.BooleanField(default=True)
    can_be_ordered = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        # is_new = self._state.adding
        is_new = (self.pk is None)
        self.can_be_ordered = True
        self.can_be_issued = True
        if is_new:
            if self.is_bike():
                self.frame_sell_price = self.frame.sell_price
            self.can_be_ordered = True
            self.can_be_issued = True
        else:
            self.can_be_issued = self.check_if_can_be_issued()
            self.can_be_ordered = self.check_if_can_be_ordered()

            # calculate sum before saving.
        self.recalculate_prices()
        super(Quote, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.quote_desc} ({str(self.version)})'

    # set issuedDate whe quote is issued to a customer
    def issue(self):
        # check all prices complete and quantities set before issuing
        if self.can_be_issued:
            self.issued_date = timezone.now()
            self.quote_status = ISSUED
            self.save()

    # is it a bike quote
    def is_bike(self):
        return self.quote_type == BIKE

    # check if a quote can be edited
    def can_be_edited(self):
        if self.quote_status == INITIAL:
            return True

        return False

    # check if a quote can be turned into an order
    def check_if_can_be_ordered(self):
        if self.quote_status == ISSUED or self.can_be_issued:
            for quote_part in self.quotepart_set.all():
                for quotePartAttribute in quote_part.quotepartattribute_set.all():
                    if quote_part.part and quotePartAttribute.partTypeAttribute.mandatory:
                        if quotePartAttribute.attribute_value is None or quotePartAttribute.attribute_value == '':
                            return False
            return True
        return False

    # check if a quote can be issued
    def check_if_can_be_issued(self):
        if self.quote_status != INITIAL:
            return False

        # check all prices complete and quantities set before issuing
        if self.keyed_sell_price is None:
            return False

        if self.frame is not None:
            if self.frame_sell_price is None:
                return False

        if self.quotepart_set.count() == 0 and self.quote_type == PART:
            return False

        quote_parts = self.quotepart_set.all()
        for quote_part in quote_parts:
            if quote_part.is_incomplete:
                return False

        return True

    def can_be_reissued(self):
        if self.quote_status == INITIAL:
            return False
        elif self.quote_status == ISSUED:
            return True
        elif self.quote_status == ARCHIVED:
            return True

        if not self.customerOrder:
            return True
        else:
            return self.customerOrder.can_be_cancelled()

    def archive(self):
        self.quote_status = ARCHIVED
        self.save()

    def recalculate_prices(self):
        if self.frame is None:
            self.sell_price = 0
        elif self.frame_sell_price is None:
            self.sell_price = 0
        else:
            self.sell_price = self.frame_sell_price
            if self.colour_price is not None:
                self.sell_price += self.colour_price

        # loop through the parts for the quote
        quote_parts = self.quotepart_set.all()
        for quote_part in quote_parts:

            if not ((quote_part.quantity is None) or (quote_part.sell_price is None)):
                self.sell_price += quote_part.sell_price * quote_part.quantity
            if quote_part.trade_in_price is not None:
                self.sell_price -= quote_part.trade_in_price

    class Meta:
        # order most recent first
        ordering = ('-created_date', 'quote_desc')


# Managers for QuotePartAttribute
class QuotePartManager(models.Manager):
    # this creates a skinny version to use on a form incomplete cannot be saved
    def create_quote_part(self, quote, quote_part_form):
        # find the part
        brand_id = quote_part_form.cleaned_data['brand']
        trade_in_price = quote_part_form.cleaned_data['trade_in_price']
        part_type = quote_part_form.cleaned_data['part_type']

        quote_part = None
        if brand_id:
            brand = Brand.objects.get(id=brand_id)
            part_name = quote_part_form.cleaned_data['part_name']
            from epic.model_helpers.part_helper import find_or_create_part
            part = find_or_create_part(brand, part_type, part_name)
            if part:
                quote_part = self.create(quote=quote, partType=part_type, part=part,
                                         quantity=quote_part_form.cleaned_data['quantity'],
                                         sell_price=quote_part_form.cleaned_data['sell_price'],
                                         trade_in_price=quote_part_form.cleaned_data['trade_in_price'],
                                         replacement_part=quote_part_form.cleaned_data['replacement_part'])

        elif trade_in_price is not None:
            quote_part = self.create(quote=quote, partType=part_type, sell_price=None, part=None,
                                     trade_in_price=quote_part_form.cleaned_data['trade_in_price'],
                                     replacement_part=True)

        if quote_part:
            QuotePartAttribute.objects.save_quote_part_attributes(quote_part)
            quote_part.is_incomplete = quote_part.check_incomplete()
            quote_part.save()

        return quote_part


class QuotePart(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE)
    partType = models.ForeignKey(PartType, on_delete=models.CASCADE)
    # part can be None if the part has not been selected
    part = models.ForeignKey(Part, on_delete=models.CASCADE, blank=True, null=True)
    quantity = models.IntegerField(default=1, blank=True)
    sell_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    trade_in_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    replacement_part = models.BooleanField(default=False)
    is_incomplete = models.BooleanField(default=False)
    objects = QuotePartManager()

    # make sure attributes reflected when you save
    def save(self, *args, **kwargs):
        new_object = True
        if self.pk is not None:
            new_object = False
            QuotePartAttribute.objects.save_quote_part_attributes(self)
            self.is_incomplete = self.check_incomplete()
        elif PartTypeAttribute.objects.filter(partType=self.partType, in_use=True).exists():
            self.is_incomplete = True

        super(QuotePart, self).save(*args, **kwargs)

        if new_object:
            QuotePartAttribute.objects.save_quote_part_attributes(self)

    def __str__(self):
        if self.replacement_part:
            if self.part is None or self.part.part_name is None:
                return f"{self.partType.shortName} No part ***"
            else:
                return f"{str(self.part)} ***"
        else:
            return str(self.part)

    # get all attributes for this quote part
    def get_attributes(self):
        return self.quotepartattribute_set.all()

    # return a part summary for use on Order and other pages
    def summary(self):
        attribute_detail = ''
        quote_part_attributes = self.get_attributes()
        if quote_part_attributes:

            for quotePartAttribute in quote_part_attributes:
                if attribute_detail != '':
                    attribute_detail += ', '
                else:
                    attribute_detail += '('
                attribute_detail += str(quotePartAttribute)
            attribute_detail += ')'

        return str(self) + attribute_detail

    def check_incomplete(self):

        if self.sell_price is None:
            return True

        for quote_part_attribute in self.get_attributes():
            if quote_part_attribute.is_missing():
                return True
        return False


# Managers for QuotePartAttribute
class QuotePartAttributeManager(models.Manager):
    # this creates a skinny version to use on a form incomplete cannot be saved
    def create_quote_part_attribute(self, quote_part, part_type_attribute):
        attribute_value = None
        quote_part_attribute = self.create(quotePart=quote_part, partTypeAttribute=part_type_attribute,
                                           attribute_value=attribute_value)
        return quote_part_attribute

    def save_quote_part_attributes(self, quote_part):

        if quote_part.part:
            part_type_attributes = PartTypeAttribute.objects.filter(partType=quote_part.partType, in_use=True)

            quote_part_attributes = quote_part.get_attributes()
            for quote_part_attribute in quote_part_attributes:
                if quote_part_attribute.quotePart.partType != quote_part_attribute.partTypeAttribute.partType:
                    quote_part_attribute.delete()

            for part_type_attribute in part_type_attributes:
                if quote_part.part and not quote_part_attributes.filter(partTypeAttribute=part_type_attribute).exists():
                    # create a new QuotePartAttribute
                    self.create_quote_part_attribute(quote_part, part_type_attribute)

        else:
            # delete any attributes set up for part
            quote_part.get_attributes().delete()




# PartTypeAttribute linked to quote parts
class QuotePartAttribute(models.Model):
    quotePart = models.ForeignKey(QuotePart, on_delete=models.CASCADE)
    partTypeAttribute = models.ForeignKey(PartTypeAttribute, on_delete=models.CASCADE)
    attribute_value = models.CharField(max_length=40, null=True)
    objects = QuotePartAttributeManager()

    def __str__(self):
        if self.partTypeAttribute and self.attribute_value:
            return f"{str(self.partTypeAttribute)}: {self.attribute_value}"
        elif self.partTypeAttribute:
            return f"{str(self.partTypeAttribute)}:  NOT SET"
        else:
            return str("Hmmm")

    def is_missing(self):
        return self.partTypeAttribute.needs_completing() and self.attribute_value is None

    class Meta:
        unique_together = (("quotePart", "partTypeAttribute"),)


# Supplier Order details
class SupplierOrder(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    order_identifier = models.CharField('Order', max_length=20)
    date_placed = models.DateField('Order Date', null=True, blank=True, default=date.today)

    def __str__(self):
        return f"{str(self.supplier)}Order id{self.order_identifier}"

    class Meta:
        unique_together = (("supplier", "order_identifier"),)


# Managers for OrderItem
class SupplierOrderItemManager(models.Manager):
    # this creates a skinny version to use on a form incomplete cannot be saved
    def create_supplier_order_item(self, supplier_order, item_description):
        supplierOrderItem = self.create(supplierOrder=supplier_order, item_description=item_description)
        return supplierOrderItem


# Supplier Order details
class SupplierOrderItem(models.Model):
    supplierOrder = models.ForeignKey(SupplierOrder, on_delete=models.CASCADE)
    item_description = models.TextField('Detail')
    objects = SupplierOrderItemManager()

    def __str__(self):
        return self.item_description


# Managers for OrderFrame
class OrderFrameManager(models.Manager):
    # this creates a skinny version to use on a form incomplete cannot be saved
    def create_order_frame(self, frame, customer_order, quote):
        orderFrame = self.create(customerOrder=customer_order, frame=frame, supplier=frame.brand.supplier, quote=quote)
        return orderFrame


class OrderFrame(models.Model):
    customerOrder = models.ForeignKey(CustomerOrder, on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, blank=True, null=True)
    frame = models.ForeignKey(Frame, on_delete=models.CASCADE, blank=True, null=True)
    leadtime = models.IntegerField('Leadtime (weeks)', blank=True, null=True)
    supplierOrderItem = models.ForeignKey(SupplierOrderItem, on_delete=models.CASCADE, blank=True, null=True)
    receipt_date = models.DateTimeField('Date received', null=True, blank=True)
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, blank=True, null=True)
    objects = OrderFrameManager()

    # display frame for HTML output in a view
    @property
    def view_order_frame(self):
        orderFrameDetails = [str(self.frame)]
        bike_quoteParts = QuotePart.objects.filter(quote=self.quote)
        orderFrameParts = []
        for quotePart in bike_quoteParts:
            if quotePart.frame_part:
                orderFrameParts.append(quotePart.get_bike_part_summary())
        orderFrameDetails.append(orderFrameParts)
        return orderFrameDetails


# Manager for Order payment
class OrderPaymentManager(models.Manager):
    # create a payment and retrigger balance calculation for orderItem
    def create_order_payment(self, customer_order, amount, user):
        orderPayment = self.create(customerOrder=customer_order, amount=amount, created_by=user)
        return orderPayment


# model for a single payment
class OrderPayment(models.Model):
    customerOrder = models.ForeignKey(CustomerOrder, on_delete=models.CASCADE)
    amount = models.DecimalField('Payment Amount', max_digits=7, decimal_places=2, blank=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, on_delete=models.PROTECT)
    objects = OrderPaymentManager()


# Managers for OrderItem
class OrderItemManager(models.Manager):
    # this creates a skinny version to use on a form incomplete cannot be saved
    def create_order_item(self, part, customer_order, quote_part):
        brand = part.brand
        orderItem = self.create(customerOrder=customer_order, part=part, quotePart=quote_part, supplier=brand.supplier)
        return orderItem


class OrderItem(models.Model):
    customerOrder = models.ForeignKey(CustomerOrder, on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT, blank=True, null=True)
    part = models.ForeignKey(Part, on_delete=models.CASCADE, blank=True, null=True)
    leadtime = models.IntegerField('Leadtime (weeks)', blank=True, null=True)
    supplierOrderItem = models.ForeignKey(SupplierOrderItem, on_delete=models.CASCADE, blank=True, null=True)
    receipt_date = models.DateTimeField('Date received', null=True, blank=True)
    quotePart = models.ForeignKey(QuotePart, on_delete=models.CASCADE, blank=True, null=True)
    stock_item = models.BooleanField(default=False)
    objects = OrderItemManager()

    def __str__(self):
        return str(self.part)


class CustomerNote(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, blank=True, null=True)
    customerOrder = models.ForeignKey(CustomerOrder, on_delete=models.CASCADE, blank=True, null=True)
    note_text = models.TextField('Notes')
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, on_delete=models.PROTECT)
    customer_visible = models.BooleanField(default=False)
