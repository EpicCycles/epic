from django.conf import settings
from django.db import models, IntegrityError

from epic.helpers.validation_helper import is_valid_url
from epic.models.framework_models import PartType


# suppliers  for bikes/parts etc
class Supplier(models.Model):
    supplier_name = models.CharField('Supplier', max_length=100, unique=True)
    link = models.CharField('Website', blank=True, max_length=200)
    preferred_supplier = models.BooleanField('Preferred', default=True)

    def __str__(self):
        return self.supplier_name

    def save(self, *args, **kwargs):
        if self.supplier_name is None or self.supplier_name == '':
            raise ValueError('Missing supplier name')

        if Supplier.objects.filter(supplier_name__iexact=self.supplier_name).exclude(id=self.id).exists():
            raise IntegrityError('Supplier exists with name ' + self.supplier_name)

        super(Supplier, self).save(*args, **kwargs)


class Brand(models.Model):
    brand_name = models.CharField(max_length=50, unique=True)
    link = models.CharField(max_length=100, blank=True, null=True)
    supplier = models.ManyToManyField(Supplier, blank=True)
    bike_brand = models.BooleanField(default=False)

    def __str__(self):
        return self.brand_name

    def save(self, *args, **kwargs):
        if self.brand_name is None or self.brand_name == '':
            raise ValueError('Missing brand name')

        if self.link:
            if not is_valid_url(self.link):
                raise ValueError('Invalid link', self.link)

        if Brand.objects.filter(brand_name__iexact=self.brand_name).exclude(id=self.id).exists():
            raise IntegrityError('Brand already exists with name' + self.brand_name)

        super(Brand, self).save(*args, **kwargs)

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
    trade_in_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    rrp = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    standard = models.BooleanField(default=False)
    stocked = models.BooleanField(default=False)
    countUses = models.IntegerField(default=0)
    upd_by = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, on_delete=models.PROTECT)
    upd_date = models.DateTimeField(auto_now=True)
    objects = PartManager()

    def save(self, *args, **kwargs):
        if self.part_name is None or self.part_name == '':
            raise ValueError('Missing part name')
        if Part.objects.filter(part_name__iexact=self.part_name, brand=self.brand, partType=self.partType).exclude(
                id=self.id).exists():
            raise IntegrityError('Part already exists with name for brand and type' + self.part_name)

        super(Part, self).save(*args, **kwargs)

    class Meta:
        indexes = [models.Index(fields=["partType", "brand", 'part_name']), ]


class SupplierProduct(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    part = models.ForeignKey(Part, on_delete=models.CASCADE)
    product_code = models.CharField(max_length=30, blank=True, null=True)
    fitted_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    ticket_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    rrp = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    trade_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    club_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    check_date = models.DateTimeField(auto_now=True)
    upd_by = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, on_delete=models.PROTECT)

    class Meta:
        indexes = [models.Index(fields=['supplier', 'part']), ]
