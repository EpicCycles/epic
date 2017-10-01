from __future__ import unicode_literals
from django.db import models
from django.urls import reverse
from django.utils import timezone
# exceptionsfrom django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist
# added to allow user details on models and history tables
from django.conf import settings
from simple_history.models import HistoricalRecords

# Global variables
HOME = 'H'
WORK = 'W'
MOBILE = 'M'
NUMBER_TYPE_CHOICES = (
    (HOME, 'Home'),
    (WORK, 'Work'),
    (MOBILE, 'Mobile'),
)
CUST = 'C'
EPIC = 'E'
FITTING_TYPE_CHOICES = (
    (CUST, 'Customer'),
    (EPIC, 'Epic'),
)

BIKE = 'B'
PART = 'P'
QUOTE_TYPE_CHOICES = (
    (BIKE, 'Bike'),
    (PART, 'Parts'),
)
INITIAL = '1'
ISSUED = '2'
ARCHIVED = '3'
ORDERED = '4'
QUOTE_STATUS_CHOICES = (
    (INITIAL, 'New'),
    (ISSUED, 'Quoted'),
    (ARCHIVED, 'Archived'),
    (ORDERED, 'Order Created'),
)
class Customer(models.Model):
    first_name = models.CharField(max_length=60)
    last_name = models.CharField(max_length=60)
    email = models.EmailField(max_length=100,blank=True)
    add_date = models.DateTimeField('Date Added',auto_now_add=True)
    upd_date = models.DateTimeField('Date Updated',auto_now=True)
    history = HistoricalRecords()

    def get_absolute_url(self):
        return reverse('views.editCustomer', args={self.pk})

    def __str__(self):
        return self.first_name + ' ' + self.last_name
    class Meta:
        unique_together = (("first_name", "last_name", "email"),)
        ordering = ['last_name','first_name','-add_date']


class CustomerPhone(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)

    number_type = models.CharField(
        max_length=1,
        choices=NUMBER_TYPE_CHOICES,
        default=HOME,
    )
    telephone = models.CharField(max_length=60,blank=True)
    add_date = models.DateTimeField('date added', auto_now_add=True)
    history = HistoricalRecords()

    def __str__(self):
        return self.number_type + ' ' + self.telephone

class CustomerAddress(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    address1 = models.CharField(max_length=200)
    address2 = models.CharField(max_length=200,blank=True)
    address3 = models.CharField(max_length=200,blank=True)
    address4 = models.CharField(max_length=200,blank=True)
    postcode = models.CharField(max_length=200)
    add_date = models.DateTimeField('date added',auto_now_add=True)
    history = HistoricalRecords()

class  Fitting(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    fitting_type = models.CharField('Type',
        max_length=1,
        choices=FITTING_TYPE_CHOICES,
        default=EPIC,
    )
    saddle_height = models.CharField('Saddle Height',max_length=20)
    bar_height = models.CharField('Bar Height',max_length=20)
    reach = models.CharField('Reach',max_length=20)
    notes = models.CharField(max_length=200,blank=True)
    add_date = models.DateTimeField('date added', auto_now_add=True)
    history = HistoricalRecords()

    def __str__(self):
        return 'Saddle Height:' + self.saddle_height + ' Bar Height:' + self.bar_height + ' Reach:' + self.reach

class  PartSection(models.Model):
    name  = models.CharField(max_length=60,unique=True)
    placing = models.PositiveSmallIntegerField()
    def __str__(self):
        return self.name
    class Meta:
        ordering = ['placing','name']

class PartType(models.Model):
    shortName = models.CharField(max_length=60,unique=True)
    description = models.CharField(max_length=100,blank=True)
    includeInSection = models.ForeignKey(PartSection, on_delete=models.CASCADE)
    placing = models.PositiveSmallIntegerField()
    def __str__(self):
        return self.shortName
    class Meta:
        unique_together = (("includeInSection", "shortName"),)
        ordering = ('includeInSection','placing', 'shortName')

# trings for attributes for PartTypes

class PartTypeAttribute(models.Model):
    partType = models.ForeignKey(PartType, on_delete=models.CASCADE)
    attribute_name = models.CharField(max_length=30)
    in_use = models.BooleanField()
    mandatory = models.BooleanField()
    placing = models.PositiveSmallIntegerField()
    def __str__(self):
        return self.attribute_name
    class Meta:
        unique_together = (("partType", "attribute_name"),)
        ordering = ('placing',)

class Brand(models.Model):
    brand_name = models.CharField(max_length=50,unique=True)
    link = models.CharField(max_length=100,blank=True)
    def __str__(self):
        return self.brand_name

    # check whether a web kink ispresent
    def hasLink(self):
        return (self.link is not None)

    # build a web link as standard
    def linkNewTab(self):
        if hasLink(self):
            return '<a target="_blank" class="externalLink" href="'+self.link+'">'+self.brand_name+'</a>'

    class Meta:
        ordering = ('brand_name',)

class Part(models.Model):
    partType = models.ForeignKey(PartType, on_delete=models.CASCADE)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    part_name = models.CharField(max_length=60)
    def __str__(self):
        return self.brand.brand_name + ' ' + self.part_name
    class Meta:
        unique_together = (("partType", "brand", "part_name"),)

class Frame(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    frame_name = models.CharField(max_length=60)
    model = models.CharField(max_length=60,blank=True)
    description = models.CharField(max_length=100,blank=True)

    def __str__(self):
        if self.model is None:
            return self.brand.brand_name + ':' + self.frame_name
        else:
            return self.brand.brand_name + ':' + self.frame_name  + ':' + self.model
    class Meta:
        unique_together = (("brand", "frame_name", "model"),)
        ordering = ('brand', 'frame_name', 'model')

class FramePart(models.Model):
    frame = models.ForeignKey(Frame, on_delete=models.CASCADE)
    part = models.ForeignKey(Part, on_delete=models.CASCADE)
    def __str__(self):
        return self.part.part_name

    class Meta:
        unique_together = (("frame", "part"),)

# # Managers for CustomerOrder
class CustomerOrderManager(models.Manager):
    # create a new CustomerOrder for a quote
    def create_customerOrder(self, quote):
        customer = quote.customer
        order_total = quote.keyed_sell_price
        customerOrder = self.create(customer=customer,order_total=order_total)
        # do something with the customerOrder
        return customerOrder

# Order Header
class CustomerOrder(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    created_date = models.DateTimeField('Date added',auto_now_add=True)
    completed_date = models.DateTimeField('Date complete',null=True)
    customer_required_date = models.DateField('Customer Date',null=True)
    final_date = models.DateField('Handover Date',null=True)
    order_total = models.DecimalField(max_digits=7,decimal_places=2,blank=True,null=True)
    amount_due = models.DecimalField(max_digits=7,decimal_places=2,blank=True,null=True)
    discount_percentage = models.DecimalField(max_digits=4,decimal_places=2,blank=True,null=True)
    cancelled_date = models.DateTimeField('Date cancelled',null=True)
    history = HistoricalRecords()
    objects = CustomerOrderManager()

class Quote(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    quote_desc = models.CharField('Quote Description',max_length=60)
    version = models.PositiveSmallIntegerField(default=1,editable=False)
    created_date = models.DateTimeField('Date added',auto_now_add=True)
    issued_date = models.DateTimeField('Date issued',null=True)
    cost_price = models.DecimalField(max_digits=7,decimal_places=2,blank=True,null=True)
    sell_price = models.DecimalField(max_digits=7,decimal_places=2,blank=True,null=True)

    # frame will be null for a quote for items only
    frame = models.ForeignKey(Frame, on_delete=models.CASCADE, blank=True,null=True)
    frame_cost_price = models.DecimalField(max_digits=7,decimal_places=2,blank=True,null=True)
    frame_sell_price = models.DecimalField(max_digits=7,decimal_places=2,blank=True,null=True)
    fitting = models.ForeignKey(Fitting, on_delete=models.CASCADE, blank=True,null=True)
    keyed_sell_price = models.DecimalField(max_digits=7,decimal_places=2,blank=True,null=True)
    quote_type = models.CharField('Type',
        max_length=1,
        choices=QUOTE_TYPE_CHOICES,
        default=BIKE,
    )
    quote_status = models.CharField('Status',
        max_length=1,
        choices=QUOTE_STATUS_CHOICES,
        default=INITIAL,
    )
    customerOrder = models.ForeignKey(CustomerOrder, on_delete=models.CASCADE, blank=True,null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True,null=True)
    history = HistoricalRecords()

    def save(self, *args, **kwargs):
        # calculate sum before saving.
        self.recalculate_prices()
        #is_new = self._state.adding
        is_new = (self.pk == None)
        super(Quote, self).save(*args, **kwargs)
        if is_new and self.is_bike():
            # create lines for quote
            quote_line = 0
            partSections = PartSection.objects.all()
            frameParts = FramePart.objects.filter(frame=self.frame)

            for partSection in partSections:
                partTypes = PartType.objects.filter(includeInSection=partSection)
                for partType in partTypes:
                    # add the part typte to the list
                    quote_line +=1
                    quotePart = QuotePart(quote=self, line=quote_line,partType=partType,quantity=0)

                    # add any parts specified
                    for framePart in frameParts:
                        if framePart.part.partType == partType:
                            quotePart.part = framePart.part
                            quotePart.frame_part = framePart
                            quotePart.quantity = 1
                            quotePart.cost_price = 0
                            quotePart.sell_price = 0

                    quotePart.save()

    def __str__(self):
        return self.quote_desc + ' (' + str(self.version) + ')'

    # display for the choice of type of quote
    #def get_quote_type_display(self):
    #    return dict(QUOTE_TYPE_CHOICES).get(self.quote_type)

    # set issuedDate whe quote is issued to a customer
    def issue(self):
        #check all prices complete and quantities set before issuing
        if self.can_be_issued():
            self.issued_date = timezone.now()
            self.quote_status = ISSUED
            self.save()
    # is it a bike quote
    def is_bike(self):
        return (self.quote_type == BIKE)

    # check if a quote can be edited
    def can_be_edited(self):
        if self.quote_status == INITIAL:
            return True

        return False

    # check if a quote can be turned into an order
    def can_be_ordered(self):
        if self.quote_status == ISSUED:
            for quotePart in self.quotepart_set.all():
                for quotePartAttribute in quotePart.quotepartattribute_set.all():
                    if (quotePartAttribute.partTypeAttribute.mandatory) and ((quotePartAttribute.attribute_value is None) or (quotePartAttribute.attribute_value == '')):
                        return False
            return True
        return False

    # check if a quote can be issued
    def can_be_issued(self):
        if not (self.quote_status == INITIAL):
            return False

        #check all prices complete and quantities set before issuing
        if (self.keyed_sell_price is None):
            return False

        if (self.frame is not None):
            if (self.frame_cost_price is None) or (self.frame_sell_price is None):
                return False

        if self.quotepart_set.count() == 0:
            return False

        quote_parts = self.quotepart_set.all()
        for quote_part in quote_parts:
            if (quote_part.requires_prices()):
                return False

        return True

    def can_be_reissued(self):
        if self.quote_status == ISSUED:
            return True
        elif self.quote_status == ARCHIVED:
            return True
        return False

    def archive(self):
        self.quote_status = ARCHIVED
        self.save()

    def requote(self):
        self.keyed_sell_price = None
        self.frame_cost_price = None
        self.frame_sell_price = None

        quote_parts = self.quotepart_set.all()
        for quote_part in quote_parts:
            if quote_part.quantity is not None:
                quote_part.sell_price = None
                quote_part.cost_price = None
                quote_part.save()

        self.quote_status = INITIAL
        self.save()

    def recalculate_prices(self):
        if self.frame is None:
            self.cost_price = 0
            self.sell_price = 0
        elif (self.frame_sell_price is None) or (self.frame_cost_price is None):
            self.cost_price = 0
            self.sell_price = 0
        else:
            self.cost_price = self.frame_cost_price
            self.sell_price = self.frame_sell_price

        # loop through the parts for the quote
        quote_parts = self.quotepart_set.all()
        for quote_part in quote_parts:

            if not ((quote_part.quantity is None) or (quote_part.sell_price is None) or (quote_part.cost_price is None)):
                self.cost_price += quote_part.cost_price * quote_part.quantity
                self.sell_price += quote_part.sell_price * quote_part.quantity

    class Meta:
        # order most recent first
        ordering =('-created_date', 'quote_desc')

class QuotePart(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE)
    line = models.PositiveSmallIntegerField(default=1)
    partType = models.ForeignKey(PartType, on_delete=models.CASCADE)
    # part can be None if the part has not been selected
    part = models.ForeignKey(Part, on_delete=models.CASCADE,blank=True,null=True)
    # framePart will be null when this a standalone quote
    frame_part = models.ForeignKey(FramePart, on_delete=models.CASCADE,blank=True,null=True)
    quantity = models.IntegerField(default=1,blank=True)
    cost_price = models.DecimalField(max_digits=7,decimal_places=2,blank=True,null=True)
    sell_price = models.DecimalField(max_digits=7,decimal_places=2,blank=True,null=True)

    #make sure attributes reflected when you save
    def save(self, *args, **kwargs):
        # calculate sum before saving.
        old_part = self.part
        is_new = (self.pk == None)
        super(QuotePart, self).save(*args, **kwargs)
        if self.part == None or self.quantity < 1:
            QuotePartAttribute.objects.filter(quotePart=self).delete()
        elif old_part != self.part:
            partTypeAttributes = PartTypeAttribute.objects.filter(partType=self.partType,in_use=True)
            for partTypeAttribute in partTypeAttributes:
                try:
                    quotePartAttribute = QuotePartAttribute.objects.get(quotePart=self, partTypeAttribute=partTypeAttribute)
                    quotePartAttribute.attribute_value == None
                    quotePartAttribute.save()
                except ObjectDoesNotExist:
                    # create a new QuotePartAttribute
                    quotePartAttribute = QuotePartAttribute(quotePart=self, partTypeAttribute=partTypeAttribute)
                    quotePartAttribute.save()
        else:
            partTypeAttributes = PartTypeAttribute.objects.filter(partType=self.partType,in_use=True)
            for partTypeAttribute in partTypeAttributes:
                try:
                    quotePartAttribute = QuotePartAttribute.objects.get(quotePart=self, partTypeAttribute=partTypeAttribute)
                except ObjectDoesNotExist:
                    # create a new QuotePartAttribute
                    quotePartAttribute = QuotePartAttribute(quotePart=self, partTypeAttribute=partTypeAttribute)
                    quotePartAttribute.save()

    def __str__(self):
        if self.part is None:
            return self.partType.shortName + "N/A"
        else:
            if self.part.part_name is None:
                return self.partType.shortName + "N/A"
            else:
                return self.partType.shortName + ' ' + self.part.part_name

    # return a part summary for use on Order and other pages
    def summary(self):
        attributeDetail=''
        quotePartAttributes = self.quotepartattribute_set.all()
        if (quotePartAttributes):

            for quotePartAttribute in quotePartAttributes:
                if (attributeDetail !=''):
                    attributeDetail += ', '
                else:
                    attributeDetail += '('
                attributeDetail += str(quotePartAttribute)
            attributeDetail += ')'

        return str(self) + attributeDetail

    # return a part summary for use on Order and other pages
    def summaryBikePart(self):
        if self.notStandard():
            return str(self) + ' Substitute part required'
        else:
            return self.summary()

    def notStandard(self):
        if (self.frame_part != None):
            if (self.part != self.frame_part.part):
                return True
        elif (self.part != None):
            return True
        return False

    def requires_prices(self):
        if (self.part is None):
            return False

        if (self.frame_part is not None) and (self.part == self.frame_part.part):
            return False

        if (self.sell_price is None) or (self.cost_price is None):
            return True

        return False

    class Meta:
        #unique_together = (("quote", "partType"),)
        ordering =('line', '-quote')

# PartTypeAttribute linked to quote parts
class QuotePartAttribute(models.Model):
    quotePart = models.ForeignKey(QuotePart, on_delete=models.CASCADE)
    partTypeAttribute = models.ForeignKey(PartTypeAttribute, on_delete=models.CASCADE)
    attribute_value =  models.CharField('Quote Description',max_length=40,null=True)
    history = HistoricalRecords()


    def __str__(self):
        return str(self.partTypeAttribute) + ": "+ self.attribute_value

    class Meta:
        unique_together = (("quotePart", "partTypeAttribute"),)

# suppliersfor bikes/parts etc
class Supplier(models.Model):
    supplier_name =  models.CharField('Supplier',max_length=100,unique=True)
    def __str__(self):
        return self.supplier_name

# Supplier Order details
class SupplierOrder(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    order_identifier = models.CharField('Order',max_length=20,unique=True)
    date_placed = models.DateField('Order Date',null=True)

# Supplier Order details
class SupplierOrderItem(models.Model):
    supplierOrder = models.ForeignKey(SupplierOrder, on_delete=models.CASCADE)
    item_description = models.TextField('Detail')

# Managers for OrderFrame
class OrderFrameManager(models.Manager):

    # this creates a skinny version to use on a form incomplete cannot be saved
    def create_orderFrame(self, frame, customerOrder,quote):
        orderFrame = self.create(customerOrder=customerOrder,frame=frame,quote=quote)
        return orderFrame

class OrderFrame(models.Model):
    customerOrder = models.ForeignKey(CustomerOrder, on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, blank=True,null=True)
    frame = models.ForeignKey(Frame, on_delete=models.CASCADE, blank=True,null=True)
    leadtime = models.IntegerField('Leadtime (weeks)',blank=True,null=True)
    supplierOrderItem = models.ForeignKey(SupplierOrderItem, on_delete=models.CASCADE, blank=True,null=True)
    receipt_date = models.DateTimeField('Date received',null=True)
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, blank=True,null=True)
    history = HistoricalRecords()
    objects = OrderFrameManager()

    # display frame for HTML output in a view
    def viewOrderFrame(self):
        viewBreak = '\n'
        orderFrameDetail = str(self.frame)
        bike_quoteParts = QuotePart.objects.filter(quote=self.quote)
        for quotePart in bike_quoteParts:
            if (quotePart.frame_part):
                orderFrameDetail += viewBreak
                orderFrameDetail += quotePart.summaryBikePart()
        return orderFrameDetail


# Managers for OrderItem
class OrderItemManager(models.Manager):

    # this creates a skinny version to use on a form incomplete cannot be saved
    def create_orderItem(self, part, customerOrder, quotePart):
        orderItem = self.create(customerOrder=customerOrder,part=part,quotePart=quotePart)
        return orderItem

class OrderItem(models.Model):
    customerOrder = models.ForeignKey(CustomerOrder, on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, blank=True,null=True)
    part = models.ForeignKey(Part, on_delete=models.CASCADE, blank=True,null=True)
    leadtime = models.IntegerField('Leadtime (weeks)',blank=True,null=True)
    supplierOrderItem = models.ForeignKey(SupplierOrderItem, on_delete=models.CASCADE, blank=True,null=True)
    receipt_date = models.DateTimeField('Date received',null=True)
    quotePart = models.ForeignKey(QuotePart, on_delete=models.CASCADE, blank=True,null=True)
    history = HistoricalRecords()
    objects = OrderItemManager()

class CustomerNote(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, blank=True,null=True)
    customerOrder = models.ForeignKey(CustomerOrder, on_delete=models.CASCADE, blank=True,null=True)
    note_text = models.TextField('Notes')
    created_on = models.DateTimeField(auto_now_add = True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True,null=True)
    customer_visible = models.BooleanField(default=False)
