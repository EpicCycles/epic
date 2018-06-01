from django.test import TestCase

from epic.forms import PhoneForm, HOME
from epic.models import Customer, CustomerPhone


class PhoneFormTestCase(TestCase):

    def setUp(self):
        self.customer = Customer.objects.create(first_name='A', last_name='Customer')
        self.phone = CustomerPhone.objects.create(customer=self.customer, telephone='0123467891')

    def test_valid_data(self):
        form = PhoneForm({
            'customer': self.customer.id,
            'telephone': "0123467891",
            'number_type': HOME,
        }, instance=self.phone)
        self.assertTrue(form.is_valid())
        new_phone = form.save()
        self.assertEqual(new_phone.telephone, "0123467891")
        self.assertEqual(new_phone.number_type, HOME)
        self.assertEqual(new_phone, self.phone)

    def test_blank_data_all(self):
        form = PhoneForm({
        }, instance=self.phone)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'customer': ['This field is required.'],
            'number_type': ['This field is required.'],
            'telephone': ['This field is required.'],
        })

    def test_blank_telephone(self):
        form = PhoneForm({
            'customer': self.customer.id,
            'number_type': HOME,
        }, instance=self.phone)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'telephone': ['This field is required.'],
        })

    def test_blank_customer(self):
        form = PhoneForm({
            'telephone': "LinneyFields",
            'number_type': HOME,
        }, instance=self.phone)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'customer': ['This field is required.'],
        })

    def test_blank_number_type(self):
        form = PhoneForm({
            'customer': self.customer.id,
            'telephone': "0123467891",
        }, instance=self.phone)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'number_type': ['This field is required.'],
        })

    def test_telephone_not_valid(self):
        form = PhoneForm({
            'customer': self.customer.id,
            'telephone': "LinneyFields!",
            'number_type': HOME,
        }, instance=self.phone)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'telephone': ['Enter a valid telephone number.'],
        })
