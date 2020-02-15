from django.db import models, IntegrityError
from django.db.models import CharField, TextField
from django.utils import timezone

from epic.models.brand_models import Brand, Part
from epic.models.framework_models import PartType


class Frame(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    frame_name = models.CharField(max_length=60)
    archived = models.BooleanField(default=False)
    archived_date = models.DateTimeField(null=True, blank=True)

    def archive(self):
        self.archived = True
        self.save()

    def __str__(self):
        if self.archived:
            return f'{self.brand.brand_name}: {self.frame_name} (Archived {str(self.archived_date)})'
        else:
            return f'{self.brand.brand_name}: {self.frame_name}'

    def save(self, *args, **kwargs):
        if self.frame_name is None or self.frame_name == '':
            raise ValueError('Missing frame_name')

        if Frame.objects.filter(frame_name__iexact=self.frame_name,
                                brand=self.brand).exclude(id=self.id).exists():
            raise IntegrityError('Frame with these values already exists')
        if self.archived:
            if not self.archived_date:
                self.archived_date = timezone.now()
        else:
            self.archived_date = None

        super(Frame, self).save(*args, **kwargs)

    class Meta:
        indexes = [models.Index(fields=["brand", "frame_name"]), ]
        ordering = ('brand', 'frame_name')


class Bike(models.Model):
    frame = models.ForeignKey(Frame, on_delete=models.CASCADE)
    model_name = models.CharField(max_length=100)
    product_code = models.CharField(max_length=30, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    colours = models.CharField(max_length=400, blank=True, null=True)
    rrp = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    epic_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    club_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    sizes = models.CharField(max_length=100, blank=True, null=True)
    bikeParts = models.TextField(blank=True, null=True)
