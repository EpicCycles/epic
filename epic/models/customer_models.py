from django.db import models
from django.db.models import CharField, TextField

from epic.helpers.validation_helper import is_valid_email

HOME = 'H'
WORK = 'W'
MOBILE = 'M'
CUST = 'C'
EPIC = 'E'
FITTING_TYPE_CHOICES = ((CUST, 'Customer'), (EPIC, 'Epic'),)
NUMBER_TYPE_CHOICES = ((HOME, 'Home'), (WORK, 'Work'), (MOBILE, 'Mobile'),)


class Customer(models.Model):
    first_name = models.CharField(max_length=60, blank=False, null=False)
    last_name = models.CharField(max_length=60, blank=False, null=False)
    email = models.EmailField(max_length=100, blank=True)
    club_member = models.BooleanField(default=False)
    add_date = models.DateTimeField('Date Added', auto_now_add=True)
    upd_date = models.DateTimeField('Date Updated', auto_now=True)

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
    preferred = models.BooleanField(default=False)
    add_date = models.DateTimeField('date added', auto_now_add=True)
    upd_date = models.DateTimeField('Date Updated', auto_now=True)

    def __str__(self):
        return f'{dict(NUMBER_TYPE_CHOICES).get(self.number_type)} {self.telephone}'


class CustomerAddress(models.Model):
    customer = models.ForeignKey(Customer, related_name='addresses', on_delete=models.CASCADE)
    address1 = models.CharField(max_length=200)
    address2 = models.CharField(max_length=200, blank=True)
    address3 = models.CharField(max_length=200, blank=True)
    address4 = models.CharField(max_length=200, blank=True)
    postcode = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=2, default='GB')
    billing = models.BooleanField(default=False)
    add_date = models.DateTimeField('date added', auto_now_add=True)
    upd_date = models.DateTimeField('Date Updated', auto_now=True)

    def __str__(self):
        return_address = self.address1
        if self.address2:
            return_address += f', {self.address2}'
        if self.address3:
            return_address += f', {self.address3}'
        if self.address4:
            return_address += f', {self.address4}'
        return_address += f', {self.postcode}'
        return return_address

    def save(self, *args, **kwargs):
        if self.address1 is None or self.address1 == '':
            raise ValueError('Missing address1')

        if CustomerAddress.objects.filter(customer=self.customer,
                                          address1__iexact=self.address1).exclude(id=self.id).exists():
            raise ValueError('Customer with these values already exists')

        super(CustomerAddress, self).save(*args, **kwargs)


class Fitting(models.Model):
    customer = models.ForeignKey(Customer, related_name='fittings', on_delete=models.CASCADE)
    fitting_type = models.CharField('Type', max_length=1, choices=FITTING_TYPE_CHOICES, default=EPIC, )
    saddle_height = models.CharField('Saddle Height', max_length=20)
    bar_height = models.CharField('Bar Height', max_length=20)
    reach = models.CharField('Reach', max_length=20)
    note_text = models.CharField(max_length=200, blank=True)
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
