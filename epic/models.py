from __future__ import unicode_literals
from django.db import models
from django.urls import reverse

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

class Customer(models.Model):
    first_name = models.CharField(max_length=60)
    last_name = models.CharField(max_length=60)
    email = models.EmailField(max_length=100,blank=True)
    add_date = models.DateTimeField('Date Added',auto_now_add=True)
    upd_date = models.DateTimeField('Date Updated',auto_now=True)

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

    def __str__(self):
        return 'Saddle Height:' + self.saddle_height + ' Bar Height' + self.bar_height + ' Reach:' + self.reach

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
    def save(self, *args, **kwargs):
        # calculate sum before saving.
        self.recalculate_prices()
        #is_new = self._state.adding
        is_new = (self.pk == None)
        super(Quote, self).save(*args, **kwargs)
        if is_new and self.quote_type == BIKE:
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
        self.issued_date = timezone.now()
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
    def __str__(self):
        if self.part is None:
            return self.partType.shortName
        else:
            if self.part.part_name is None:
                return self.partType.shortName
            else:
                return self.partType.shortName + ' ' + self.part.part_name

    class Meta:
        #unique_together = (("quote", "partType"),)
        ordering =('line', '-quote')

# Upload tables - transient
class Column(models.Model):
    name = models.CharField

class Row(models.Model):
    name = models.CharField

class Cell(models.Model):
    column = models.ForeignKey(Column, on_delete=models.CASCADE)
    row = models.ForeignKey(Row, on_delete=models.CASCADE)
    attribute =  models.CharField
