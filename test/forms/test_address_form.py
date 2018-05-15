from django.test import TestCase

from epic.forms import AddressForm
from epic.models import Customer, CustomerAddress


class AddressFormTestCase(TestCase):

    def setUp(self):
        self.customer = Customer.objects.create(first_name='A', last_name='Customer')
        self.address = CustomerAddress.objects.create(customer=self.customer, address1='Moonrakers', postcode='SY8 1EE')

    def test_valid_data(self):
        form = AddressForm({
            'customer': self.customer.id,
            'address1': "LinneyFields",
            'address2': "Linney",
            'address3': "Ludlow",
            'address4': "Shropshire",
            'postcode': "SY8 1EF",
        }, instance=self.address)
        self.assertTrue(form.is_valid())
        new_address = form.save()
        self.assertEqual(new_address.address1, "LinneyFields")
        self.assertEqual(new_address.address2, "Linney")
        self.assertEqual(new_address.address3, "Ludlow")
        self.assertEqual(new_address.address4, "Shropshire")
        self.assertEqual(new_address.postcode, "SY8 1EF")
        self.assertEqual(new_address, self.address)

    def test_invalid_data_no_email(self):
        form = AddressForm({
            'address1': "LinneyFields",
            'postcode': "SY8 1EF",
        })
        self.assertFalse(form.is_valid())

    def test_blank_data_all(self):
        form = AddressForm({
        }, instance=self.address)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'address1': ['This field is required.'],
            'postcode': ['This field is required.'],
            'customer': ['This field is required.'],
        })

    def test_blank_address1(self):
        form = AddressForm({
            'customer': self.customer.id,
            'address1': "LinneyFields",
        }, instance=self.address)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'postcode': ['This field is required.'],
        })

    def test_blank_postcode(self):
        form = AddressForm({
            'customer': self.customer.id,
            'address1': "LinneyFields",
        }, instance=self.address)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'postcode': ['This field is required.'],
        })

    def test_blank_customer(self):
        form = AddressForm({
            'address1': "LinneyFields",
            'postcode': "SY8 1EF",
        }, instance=self.address)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'customer': ['This field is required.'],
        })

    # def test_postcode_not_valid(self):
    #     form = AddressForm({
    #         'customer': self.customer.id,
    #         'address1': "LinneyFields",
    #         'postcode': "SY8 1EFdddddddd",
    #     }, instance=self.address)
    #     self.assertFalse(form.is_valid())
    #     self.assertEqual(form.errors, {
    #         'email': ['Enter a valid postcode address.'],
    #     })
