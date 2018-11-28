from django.db import models
from django.db.models import CharField, TextField
from django.conf import settings

from epic.helpers.validation_helper import is_valid_email
from epic.model_helpers.lookup_helpers import UpperCase

HOME = 'H'
WORK = 'W'
MOBILE = 'M'
CUST = 'C'
EPIC = 'E'
FITTING_TYPE_CHOICES = ((CUST, 'Customer'), (EPIC, 'Epic'),)
NUMBER_TYPE_CHOICES = ((HOME, 'Home'), (WORK, 'Work'), (MOBILE, 'Mobile'),)

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
        if self.email and not self.email == '':
            if not is_valid_email(self.email):
                raise ValueError('Invalid email', self.email)

        if Customer.objects.filter(first_name=self.first_name,
                                   last_name=self.last_name, email=self.email).exclude(id=self.id).exists():
            raise ValueError('Customer with these values already exists')

        super(Customer, self).save(*args, **kwargs)

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
    customer = models.ForeignKey(Customer, related_name='phones', on_delete=models.CASCADE)

    number_type = models.CharField(max_length=1, choices=NUMBER_TYPE_CHOICES, default=HOME, )
    telephone = models.CharField(max_length=60)
    add_date = models.DateTimeField('date added', auto_now_add=True)
    upd_date = models.DateTimeField('Date Updated', auto_now=True)

    def __str__(self):
        return f'{dict(NUMBER_TYPE_CHOICES).get(self.number_type)} {self.telephone}'

    def save(self, *args, **kwargs):
        if self.number_type is None or self.number_type == '':
            raise ValueError('Missing number type')
        if self.telephone is None or self.telephone == '':
            raise ValueError('Missing telephone')
        if self.number_type not in [HOME, WORK, MOBILE]:
            raise ValueError('Number type must be Home, Work or Mobile')

        if CustomerPhone.objects.filter(customer=self.customer,
                                        telephone__upper=self.telephone).exclude(id=self.id).exists():
            raise ValueError('Customer with these values already exists')

        super(CustomerPhone, self).save(*args, **kwargs)


class CustomerAddress(models.Model):
    customer = models.ForeignKey(Customer, related_name='addresses', on_delete=models.CASCADE)
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

        if CustomerAddress.objects.filter(customer=self.customer,
                                          address1=self.address1, postcode=self.postcode).exclude(id=self.id).exists():
            raise ValueError('Customer with these values already exists')

        super(CustomerAddress, self).save(*args, **kwargs)


class Fitting(models.Model):
    customer = models.ForeignKey(Customer, related_name='fittings', on_delete=models.CASCADE)
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
