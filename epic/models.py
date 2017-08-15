from __future__ import unicode_literals
from django.db import models
from django.urls import reverse

class Customer(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
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
    HOME = 'H'
    WORK = 'W'
    MOBILE = 'M'
    NUMBER_TYPE_CHOICES = (
        (HOME, 'Home'),
        (WORK, 'Work'),
        (MOBILE, 'Mobile'),
    )
    number_type = models.CharField(
        max_length=1,
        choices=NUMBER_TYPE_CHOICES,
        default=HOME,
    )
    telephone = models.CharField(max_length=30,blank=True)
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

class  PartSection(models.Model):
    name  = models.CharField(max_length=30,unique=True)
    placing = models.PositiveSmallIntegerField()
    class Meta:
        ordering = ['placing','name']

class PartType(models.Model):
    shortName = models.CharField(max_length=30,unique=True)
    description = models.CharField(max_length=100,blank=True)
    includeInSection = models.ForeignKey(PartSection, on_delete=models.CASCADE)
    placing = models.PositiveSmallIntegerField()
    def __str__(self):
        return self.shortName
    class Meta:
        unique_together = (("includeInSection", "shortName"),)
        ordering = ('includeInSection','placing', 'shortName')

class Brand(models.Model):
    name = models.CharField(max_length=50,unique=True)
    link = models.CharField(max_length=100,blank=True)
    def __str__(self):
        return self.name

    # check whether a web kink ispresent
    def hasLink(self):
        return (self.link is not None)

    # build a web link as standard
    def linkNewTab(self):
        if hasLink(self):
            return '<a target="_blank" class="externalLink" href="'+self.link+'">'+self.name+'</a>'

    class Meta:
        ordering = ('name',)

class Part(models.Model):
    partType = models.ForeignKey(PartType)
    brand = models.ForeignKey(Brand)
    name = models.CharField(max_length=30,unique=True)

class Frame(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    name = models.CharField(max_length=30)
    model = models.CharField(max_length=30,blank=True)
    description = models.CharField(max_length=100,blank=True)

    def __str__(self):
        if self.model is None:
            return self.brand.name + ':' + self.name
        else:
            return self.brand.name + ':' + self.name  + ':' + self.model
    class Meta:
        unique_together = (("brand", "name", "model"),)
        ordering = ('brand', 'name', 'model')


class FramePart(models.Model):
    frame = models.ForeignKey(Frame, on_delete=models.CASCADE)
    part = models.ForeignKey(Part, on_delete=models.CASCADE)
    def __str__(self):
        return self.part.name

    class Meta:
        unique_together = (("frame", "part"),)

class Quote(models.Model):
    customer = models.ForeignKey(Customer)
    name = models.CharField(max_length=30)
    version = models.PositiveSmallIntegerField
    created_date = models.DateTimeField('Date added',auto_now_add=True)
    issued_date = models.DateTimeField('Date issued',blank=True)
    cost_price = models.DecimalField(max_digits=7,decimal_places=2,blank=True)
    sell_price = models.DecimalField(max_digits=7,decimal_places=2,blank=True)

    # frame will be null for a quote for items only
    frame = models.ForeignKey(Frame, on_delete=models.CASCADE, blank=True)
    frame_cost_price = models.DecimalField(max_digits=7,decimal_places=2,blank=True)
    frame_sell_price = models.DecimalField(max_digits=7,decimal_places=2,blank=True)

    def __str__(self):
        return self.name + ' (' + version + ')'

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
            if not ((quote_part.sell_price is None) or (quote_part.cost_price is None)):
                self.cost_price += quote_part.cost_price * quote_part.quantity
                self.sell_price += quote_part.sell_price * quote_part.quantity


class QuotePart(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE)
    line = models.PositiveSmallIntegerField
    partType = models.ForeignKey(PartType)
    # part can be None if the part has not been selected
    part = models.ForeignKey(Part, on_delete=models.CASCADE,blank=True)
    # framePart will be null when this a standalone quote
    frame_part = models.ForeignKey(FramePart, on_delete=models.CASCADE,blank=True)
    quantity = models.IntegerField(blank=True)
    cost_price = models.DecimalField(max_digits=7,decimal_places=2,blank=True)
    sell_price = models.DecimalField(max_digits=7,decimal_places=2,blank=True)
    def __str__(self):
        if self.part is None:
            return self.partType.name
        else:
            return self.partType.name + ' ' + self.part.name

    class Meta:
        unique_together = (("quote", "partType"),)

# Upload tables - transient
class Column(models.Model):
    name = models.CharField

class Row(models.Model):
    name = models.CharField

class Cell(models.Model):
    column = models.ForeignKey(Column, on_delete=models.CASCADE)
    row = models.ForeignKey(Row, on_delete=models.CASCADE)
    attribute =  models.CharField
