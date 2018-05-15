from django.test import TestCase

from epic.forms import CustomerForm
from epic.models import Customer


class CustomerFormTestCase(TestCase):

    def setUp(self):
        self.customer = Customer.objects.create(first_name='A', last_name='Customer')

    def test_valid_data(self):
        form = CustomerForm({
            'first_name': "Turanga",
            'last_name': "Leela",
            'email': "leela@example.com",
        }, instance=self.customer)
        self.assertTrue(form.is_valid())
        customer = form.save()
        self.assertEqual(customer.first_name, "Turanga")
        self.assertEqual(customer.last_name, "Leela")
        self.assertEqual(customer.email, "leela@example.com")
        self.assertEqual(customer, self.customer)

    def test_valid_data_no_email(self):
        form = CustomerForm({
            'first_name': "Turanga",
            'last_name': "Leela",
        }, instance=self.customer)
        self.assertTrue(form.is_valid())
        customer = form.save()
        self.assertEqual(customer.first_name, "Turanga")
        self.assertEqual(customer.last_name, "Leela")
        self.assertEqual(customer.email, self.customer.email)
        self.assertEqual(customer, self.customer)

    def test_blank_data_all(self):
        form = CustomerForm({}, instance=self.customer)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'first_name': ['This field is required.'],
            'last_name': ['This field is required.'],
        })

    def test_blank_first_name(self):
        form = CustomerForm({'last_name': "Leela", }, instance=self.customer)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'first_name': ['This field is required.'],
        })

    def test_blank_last_name(self):
        form = CustomerForm({'first_name': "Turanga"}, instance=self.customer)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'last_name': ['This field is required.'],
        })
