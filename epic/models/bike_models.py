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
    description = models.TextField(max_length=400, blank=True, null=True)
    colours = models.CharField(max_length=400, blank=True, null=True)
    rrp = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    epic_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    club_price = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    sizes = models.CharField(max_length=100, blank=True, null=True)


class BikePart(models.Model):
    bike = models.ForeignKey(Bike, on_delete=models.CASCADE)
    part = models.ForeignKey(Part, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.part.partType.name}: {str(self.part.brand)} {self.part.part_name}'

    def save(self, *args, **kwargs):
        if BikePart.objects.filter(bike=self.bike, part=self.part).exclude(id=self.id).exists():
            raise IntegrityError('Frame Part with these values already exists')

        super(BikePart, self).save(*args, **kwargs)

    class Meta:
        indexes = [models.Index(fields=["bike", "part"]), ]
        ordering = ('pk',)


class FrameExclusion(models.Model):
    frame = models.ForeignKey(Frame, on_delete=models.CASCADE)
    partType = models.ForeignKey(PartType, on_delete=models.CASCADE)

    def __str__(self):
        return f'{str(self.partType)} n/a'

    def save(self, *args, **kwargs):
        if FrameExclusion.objects.filter(frame=self.frame, partType=self.partType).exclude(id=self.id).exists():
            raise IntegrityError('Frame Exclusion with these values already exists')

        super(FrameExclusion, self).save(*args, **kwargs)

    class Meta:
        indexes = [models.Index(fields=["frame", "partType"]), ]
