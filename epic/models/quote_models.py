from django.db import models, IntegrityError
from django.db.models import CharField, TextField
from django.conf import settings
from django.utils import timezone
from decimal import Decimal

from epic.model_helpers.lookup_helpers import UpperCase
from epic.models.bike_models import Frame
from epic.models.brand_models import Brand, Part
from epic.models.customer_models import Customer, Fitting
from epic.models.framework_models import PartType, PartTypeAttribute

CharField.register_lookup(UpperCase)
TextField.register_lookup(UpperCase)
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


class Quote(models.Model):
    customer = models.ForeignKey(Customer, related_name='quotes', on_delete=models.CASCADE)
    quote_desc = models.CharField(max_length=60)
    version = models.PositiveSmallIntegerField(default=1, editable=False)
    created_date = models.DateTimeField(auto_now_add=True)
    issued_date = models.DateTimeField(null=True)
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
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, on_delete=models.PROTECT)
    can_be_issued = models.BooleanField(default=True)
    upd_date = models.DateTimeField('Date Updated', auto_now=True)

    def save(self, *args, **kwargs):
        # validate that all mandatory fields are present
        if not self.quote_desc or self.quote_desc == '':
            raise ValueError('Description must be provided')
        if self.quote_type not in [BIKE, PART]:
            raise ValueError('Quote Type is invalid')
        if self.quote_status not in [INITIAL, ISSUED, ARCHIVED, ORDERED]:
            raise ValueError('Quote Status is invalid')

        if self.quote_type == BIKE and not self.frame:
            raise ValueError('Frame must be provided')
        if self.quote_type == PART and self.frame:
            raise ValueError('Frame not must be provided')

        # is_new = self._state.adding
        is_new = (self.pk is None)
        if is_new:
            if self.is_bike() and not self.frame_sell_price:
                self.frame_sell_price = self.frame.sell_price

        # calculate sum before saving.
        self.recalculate_prices()
        self.can_be_issued = self.check_if_can_be_issued()
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
            if self.colour is None or self.colour_price is None:
                return False
            if self.frame_size is None:
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

    def archive(self):
        self.quote_status = ARCHIVED
        self.save()

    def recalculate_prices(self):
        self.sell_price = Decimal(0)

        if self.frame is None:
            pass
        elif self.frame_sell_price:
            self.sell_price += self.frame_sell_price
            if self.colour_price:
                self.sell_price += self.colour_price

        # loop through the parts for the quote
        quote_parts = self.quotepart_set.all()
        for quote_part in quote_parts:

            if quote_part.quantity and quote_part.sell_price:
                self.sell_price += quote_part.sell_price * quote_part.quantity

            if quote_part.trade_in_price:
                self.sell_price -= quote_part.trade_in_price
        return self.sell_price

    class Meta:
        # order most recent first
        ordering = ('-created_date', 'quote_desc')


# Managers for QuotePartAttribute
class QuotePartManager(models.Manager):
    # this copies an existing quote part and it's attributes
    def copy_quote_part_to_new_quote(self, quote, old_quote_part):
        quote_part = self.create(quote=quote, partType=old_quote_part.partType, part=old_quote_part.part,
                                 quantity=old_quote_part.quantity,
                                 sell_price=old_quote_part.sell_price,
                                 trade_in_price=old_quote_part.trade_in_price,
                                 replacement_part=old_quote_part.replacement_part)

        if old_quote_part.part is not None:
            quote_part.get_attributes().delete()
            for old_quote_part_attribute in old_quote_part.get_attributes():
                QuotePartAttribute.objects.copy_quote_part_attribute(quote_part, old_quote_part_attribute)

        if quote_part:
            quote_part.is_incomplete = quote_part.check_incomplete(False)
            quote_part.save()
        return quote_part

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
            quote_part.is_incomplete = quote_part.check_incomplete(False)
            quote_part.save()

        return quote_part


class QuotePart(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE)
    partType = models.ForeignKey(PartType, on_delete=models.CASCADE)
    # part can be None if the part has not been selected
    part = models.ForeignKey(Part, on_delete=models.CASCADE, blank=True, null=True)
    quantity = models.IntegerField(default=1, blank=True, null=True)
    sell_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    trade_in_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    replacement_part = models.BooleanField(default=False)
    is_incomplete = models.BooleanField(default=False)
    objects = QuotePartManager()

    # make sure attributes reflected when you save
    def save(self, *args, **kwargs):
        if self.quote.is_bike():
            if self.trade_in_price and not self.replacement_part:
                raise ValueError('Trade in price only valid when this is a replacement part')
            if self.replacement_part:
                if QuotePart.objects.filter(quote=self.quote, partType=self.partType, replacement_part=True).exclude(
                        id=self.id).exists():
                    raise ValueError('Replacement part exists for part type ')
                if not self.partType.can_be_substituted:
                    raise ValueError('Part type cannot be substituted')
        else:
            if self.replacement_part or self.trade_in_price:
                raise ValueError('Replacement parts only valid for Bike quotes')

        if self.part:
            if self.partType != self.part.partType:
                raise ValueError('Part is not the right type')
        else:
            if not self.replacement_part:
                raise ValueError('Part must be specified')
            if not self.partType.can_be_omitted:
                raise ValueError('Part cannot be omitted')

        new_object = True
        if self.pk is not None:
            new_object = False
            QuotePartAttribute.objects.save_quote_part_attributes(self)
        self.is_incomplete = self.check_incomplete(new_object)

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

        return f"{str(self)}{attribute_detail}"

    def check_incomplete(self, is_new):

        if self.part:
            if self.sell_price is None:
                return True
            if is_new:
                if PartTypeAttribute.objects.filter(partType=self.partType, in_use=True, mandatory=True):
                    return True
            else:
                for quote_part_attribute in self.get_attributes():
                    if quote_part_attribute.is_missing():
                        return True
        else:
            if self.replacement_part is False:
                return True

        if self.replacement_part and self.trade_in_price is None:
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

    # this copies an existing attribute
    def copy_quote_part_attribute(self, quote_part, attribute_to_copy):
        quote_part_attribute = self.create(quotePart=quote_part, partTypeAttribute=attribute_to_copy.partTypeAttribute,
                                           attribute_value=attribute_to_copy.attribute_value)
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

    def save(self, *args, **kwargs):
        if self.quotePart.partType != self.partTypeAttribute.partType:
            raise ValueError('Attribute not valid for quote part type')

        if not self.quotePart.part:
            raise ValueError('attribute should not be set when no part')

        if QuotePartAttribute.objects.filter(quotePart=self.quotePart,
                                             partTypeAttribute=self.partTypeAttribute).exclude(id=self.id).exists():
            raise IntegrityError('Duplicate row')

        super(QuotePartAttribute, self).save(*args, **kwargs)

    def __str__(self):
        if self.attribute_value:
            return f"{str(self.partTypeAttribute)}: {self.attribute_value}"
        else:
            return f"{str(self.partTypeAttribute)}: NOT SET"

    def is_missing(self):
        return self.partTypeAttribute.needs_completing() and self.attribute_value is None

    class Meta:
        indexes = [models.Index(fields=["quotePart", "partTypeAttribute"]), ]

