from django.db import models

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
    phoneNumbers = models.TextField(blank=True, null=True)
    addresses = models.TextField(blank=True, null=True)
    fittings = models.TextField(blank=True, null=True)
    class Meta:
        indexes = [models.Index(fields=["first_name", "last_name", "email"]), ]
        ordering = ['last_name', 'first_name', '-add_date']
