from django.test import TestCase

from epic.forms import ChangeCustomerForm
from epic.models import Customer


class ChangeCustomerFormTestCase(TestCase):

    def setUp(self):
        self.customer = Customer.objects.create(first_name='A', last_name='Customer')

    def test_valid_data(self):
        form = ChangeCustomerForm({
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
        form = ChangeCustomerForm({
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
        form = ChangeCustomerForm({}, instance=self.customer)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'first_name': ['This field is required.'],
            'last_name': ['This field is required.'],
        })

    def test_no_first_name(self):
        form = ChangeCustomerForm({''
                                   'first_name': "",
                                   'last_name': "Leela",
                                   }, instance=self.customer)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'first_name': ['This field is required.'],
        })

    def test_blank_first_name(self):
        form = ChangeCustomerForm({'last_name': "Leela", }, instance=self.customer)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'first_name': ['This field is required.'],
        })

    def test_no_last_name(self):
        form = ChangeCustomerForm({'first_name': "Turanga"}, instance=self.customer)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'last_name': ['This field is required.'],
        })

    def test_blank_last_name(self):
        form = ChangeCustomerForm({'first_name': "Turanga", 'last_name': ""}, instance=self.customer)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'last_name': ['This field is required.'],
        })

    def test_invalid_first_name(self):
        form = ChangeCustomerForm({'first_name': "&&&", 'last_name': "Leela"}, instance=self.customer)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'first_name': ['Enter a valid first name.'],
        })

    def test_invalid_last_name(self):
        form = ChangeCustomerForm({'first_name': "Fred", 'last_name': "Leela£"}, instance=self.customer)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'last_name': ['Enter a valid last name.'],
        })

    def test_email_not_valid(self):
        form = ChangeCustomerForm({
            'first_name': "Bonny",
            'last_name': "Leela",
            'email': "leelaexample.com",
        }, instance=self.customer)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'email': ['Enter a valid email address.'],
        })

    def test_first_name_too_long(self):
        form = ChangeCustomerForm({
            'first_name': "0123456789012345678901234567890123456789012345678901234567890",
            'last_name': "Leela",
        }, instance=self.customer)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'first_name': ['Ensure this value has at most 60 characters (it has 61).'],
        })

    def test_last_name_too_long(self):
        form = ChangeCustomerForm({
            'last_name': "0123456789012345678901234567890123456789012345678901234567890",
            'first_name': "LeePaulla",
        }, instance=self.customer)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'last_name': ['Ensure this value has at most 60 characters (it has 61).'],
        })
