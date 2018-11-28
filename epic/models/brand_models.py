from django.db import models, IntegrityError
from django.db.models import CharField, TextField

from epic.helpers.validation_helper import is_valid_url
from epic.model_helpers.lookup_helpers import UpperCase
from epic.models.framework_models import PartType

CharField.register_lookup(UpperCase)
TextField.register_lookup(UpperCase)


# suppliers  for bikes/parts etc
class Supplier(models.Model):
    supplier_name = models.CharField('Supplier', max_length=100, unique=True)
    website = models.CharField('Website', blank=True, max_length=200)
    preferred_supplier = models.BooleanField('Preferred', default=True)

    def __str__(self):
        return self.supplier_name

    def save(self, *args, **kwargs):
        if self.supplier_name is None or self.supplier_name == '':
            raise ValueError('Missing supplier name')

        if Supplier.objects.filter(supplier_name__upper=self.supplier_name).exclude(id=self.id).exists():
            raise IntegrityError('Supplier exists with name ' + self.supplier_name)

        super(Supplier, self).save(*args, **kwargs)


class Brand(models.Model):
    brand_name = models.CharField(max_length=50, unique=True)
    link = models.CharField(max_length=100, blank=True)
    supplier = models.ManyToManyField(Supplier, blank=True)

    def __str__(self):
        return self.brand_name

    def save(self, *args, **kwargs):
        if self.brand_name is None or self.brand_name == '':
            raise ValueError('Missing brand name')

        if self.link:
            if not is_valid_url(self.link):
                raise ValueError('Invalid link', self.link)

        if Brand.objects.filter(brand_name__upper=self.brand_name).exclude(id=self.id).exists():
            raise IntegrityError('Brand already exists with name' + self.brand_name)

        super(Brand, self).save(*args, **kwargs)

    # check whether a web kink ispresent
    def has_link(self):
        return self.link is not None

    # build a web link as standard
    def build_link_new_tab(self):
        if self.has_link():
            return '<a target="_blank" class="externalLink" href="' + self.link + '">' + self.brand_name + '</a>'

    class Meta:
        ordering = ('brand_name',)
        indexes = [models.Index(fields=["brand_name"]), ]


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
    stocked = models.BooleanField(default=False)
    objects = PartManager()

    def getJavascriptObject(self):
        return f'brand:"{self.brand.id}",partType:"{self.partType.id}",partName:"{self.part_name}"'

    def __str__(self):
        return f'{self.partType.shortName}: {self.brand.brand_name} {self.part_name}'

    def save(self, *args, **kwargs):
        if self.part_name is None or self.part_name == '':
            raise ValueError('Missing brand name')

        if Part.objects.filter(part_name__upper=self.part_name, brand=self.brand, partType=self.partType).exclude(
                id=self.id).exists():
            raise IntegrityError('Part already exists with name for brand and type' + self.part_name)

        super(Part, self).save(*args, **kwargs)

    class Meta:
        indexes = [models.Index(fields=["partType", "brand", 'part_name']), ]

class PartTradeIn(models.Model):
    part = models.ForeignKey(Part, on_delete=models.CASCADE)
    trade_in_value = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)


class SupplierProduct(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    part = models.ForeignKey(Part, on_delete=models.CASCADE)
    product_code = models.CharField(max_length=30)
    fitted_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    ticket_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    rrp = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    trade_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    club_discount = models.BooleanField(default=True)

    class Meta:
        indexes = [models.Index(fields=['supplier', 'part']), ]


class Bundle(models.Model):
    bundle_name = models.CharField('Supplier', max_length=100, unique=True)
    products = models.ManyToManyField(SupplierProduct, blank=True)
    fitted_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    ticket_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
