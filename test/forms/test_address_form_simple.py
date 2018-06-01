from django.test import TestCase

from epic.forms import AddressFormSimple
from epic.models import Customer, CustomerAddress


class AddressFormSimpleTestCase(TestCase):

    def setUp(self):
        self.customer = Customer.objects.create(first_name='A', last_name='Customer')
        self.address = CustomerAddress.objects.create(customer=self.customer, address1='Moonrakers', postcode='SY8 1EE')

    def test_valid_data(self):
        form = AddressFormSimple({
            'customer': self.customer.id,
            'address1': "LinneyFields",
            'postcode': "SY8 1EF",
        }, instance=self.address)
        self.assertTrue(form.is_valid())
        new_address = form.save()
        self.assertEqual(new_address.address1, "LinneyFields")
        self.assertEqual(new_address.postcode, "SY8 1EF")
        self.assertEqual(new_address, self.address)

    def test_data_no_customer(self):
        form = AddressFormSimple({
            'address1': "LinneyFields",
            'postcode': "SY8 1EF",
        })
        self.assertTrue(form.is_valid())

    def test_blank_data_all(self):
        form = AddressFormSimple({
        }, instance=self.address)
        self.assertTrue(form.is_valid())

    def test_blank_address1(self):
        form = AddressFormSimple({
            'customer': self.customer.id,
            'address1': "LinneyFields",
        }, instance=self.address)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'postcode': ['Both first line of address and a postcode must be entered.'],
        })

    def test_blank_postcode(self):
        form = AddressFormSimple({
            'customer': self.customer.id,
            'postcode': "SY8 1EF",
        }, instance=self.address)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'address1': ['Both first line of address and a postcode must be entered.'],
        })

    def test_blank_customer(self):
        form = AddressFormSimple({
            'address1': "LinneyFields",
            'postcode': "SY8 1EF",
        }, instance=self.address)
        self.assertTrue(form.is_valid())

    def test_postcode_not_valid(self):
        form = AddressFormSimple({
            'customer': self.customer.id,
            'address1': "LinneyFields",
            'postcode': "SY8 1E",
        }, instance=self.address)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'postcode': ['Enter a valid postcode.'],
        })
