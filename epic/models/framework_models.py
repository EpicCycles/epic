from django.db import models, IntegrityError

TEXT = '1'
NUMBER = '2'
RADIO = '3'
SELECT = '4'
MULTIPLE_C = '5'
MULTIPLE_S = '6'

DISPLAY_CHOICES = ((TEXT, 'Text'), (NUMBER, 'Numeric'), (RADIO, 'Single - Radio'), (SELECT, 'Single - Dropdown'),
                   (MULTIPLE_C, 'Multiple - Checkbox'), (MULTIPLE_S, 'Multiple - Dropdown'))


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
    name = models.CharField(max_length=60, unique=True)
    includeInSection = models.ForeignKey(PartSection, related_name='partTypes', on_delete=models.CASCADE)
    placing = models.PositiveSmallIntegerField()
    can_be_substituted = models.BooleanField('Can be substituted', default=False)
    can_be_omitted = models.BooleanField('Can be omitted', default=False)
    customer_visible = models.BooleanField('Show Customer', default=False)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.name is None or self.name == '':
            raise ValueError('Missing short name')
        if self.placing is None:
            raise ValueError('Missing placing')
        elif self.placing < 1:
            raise ValueError('Invalid placing')

        super(PartType, self).save(*args, **kwargs)

    class Meta:
        indexes = [models.Index(fields=["includeInSection", "name"]), ]
        ordering = ('includeInSection', 'placing', 'name')

class PartTypeSynonym(models.Model):
    partType = models.ForeignKey(PartType, related_name='synonyms', on_delete=models.CASCADE)
    name = models.CharField(max_length=60, unique=True)

# strings for attributes for PartTypes
class PartTypeAttribute(models.Model):
    partType = models.ForeignKey(PartType, related_name='attributes', on_delete=models.CASCADE)
    attribute_name = models.CharField(max_length=30)
    in_use = models.BooleanField(default=True)
    mandatory = models.BooleanField(default=True)
    placing = models.PositiveSmallIntegerField()
    attribute_type = models.CharField(max_length=1, choices=DISPLAY_CHOICES, default=TEXT, )

    def __str__(self):
        return self.attribute_name

    def save(self, *args, **kwargs):
        if self.attribute_name is None or self.attribute_name == '':
            raise ValueError('Missing attribute name')
        if self.placing is None:
            raise ValueError('Missing placing')
        elif self.placing < 1:
            raise ValueError('Invalid placing')

        if self.attribute_type not in [TEXT, RADIO, SELECT, NUMBER, MULTIPLE_C, MULTIPLE_S]:
            raise ValueError('Invalid attribute type')

        if PartTypeAttribute.objects.filter(partType=self.partType,
                                            attribute_name=self.attribute_name).exclude(id=self.id).exists():
            raise IntegrityError('Part Type Attribute with these values already exists')

        super(PartTypeAttribute, self).save(*args, **kwargs)

    def needs_completing(self):
        return self.in_use and self.mandatory

    class Meta:
        indexes = [models.Index(fields=["partType", "attribute_name"]), ]
        ordering = ('placing',)


# values for part type attributes
class AttributeOptions(models.Model):
    part_type_attribute = models.ForeignKey(PartTypeAttribute, on_delete=models.CASCADE, related_name='options')
    option_name = models.CharField(max_length=30)
    placing = models.PositiveSmallIntegerField()

    def save(self, *args, **kwargs):
        if self.option_name is None or self.option_name == '':
            raise ValueError('Missing attribute option')
        if self.placing is None:
            raise ValueError('Missing placing')
        if AttributeOptions.objects.filter(part_type_attribute=self.part_type_attribute,
                                           option_name=self.option_name).exclude(id=self.id).exists():
            raise IntegrityError('Part Type Attribute option with this value already exists')

        super(AttributeOptions, self).save(*args, **kwargs)

    class Meta:
        indexes = [models.Index(fields=["part_type_attribute", "option_name"]), ]
        ordering = ('placing',)
