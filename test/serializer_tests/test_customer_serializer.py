from django.test import TestCase

from epic.model_serializers.customer_serializer import CustomerSerializer, CustomerPhoneSerializer, \
    CustomerAddressSerializer, FittingSerializer
from epic.models.customer_models import *


class CustomerSerializerTestCase(TestCase):
    def setUp(self):
        self.customer_no_email = Customer.objects.create(first_name="Bod", last_name='Prince')
        self.customer_with_email = Customer.objects.create(first_name="Fred", last_name='Bloggs', email='f.b@c.com')
        self.customer_with_email2 = Customer.objects.create(first_name="Fred", last_name='not-Bloggs',
                                                            email='f.b@c.com')
        self.c_n_m_home_phone = CustomerPhone.objects.create(customer=self.customer_no_email, number_type=HOME,
                                                             telephone='01568770451')
        self.c_n_m_home_phone2 = CustomerPhone.objects.create(customer=self.customer_no_email, number_type=HOME,
                                                              telephone='01584875686')

        self.c_n_m_address1 = CustomerAddress.objects.create(customer=self.customer_no_email, address1='1 New Street',
                                                             postcode='TR1 1FF')
        self.c_n_m_address2 = CustomerAddress.objects.create(customer=self.customer_no_email, address1='2 New Street',
                                                             postcode='TR1 1FF')
        self.c_n_m_fitting = Fitting.objects.create(customer=self.customer_no_email, saddle_height='23',
                                                    bar_height='45', reach='23', note_text='New note', fitting_type=CUST)

    def test_missing_data_customer_create(self):
        serializer = CustomerSerializer(data={})
        self.assertEqual(serializer.is_valid(), False)
        serializer = CustomerSerializer(data={'first_name': 'Annd'})
        self.assertEqual(serializer.is_valid(), False)
        serializer = CustomerSerializer(data={'last_name': 'Annd'})
        self.assertEqual(serializer.is_valid(), False)
        serializer = CustomerSerializer(data={'last_name': ''})
        self.assertEqual(serializer.is_valid(), False)

    def test_missing_data_customer_phone_create(self):
        serializer = CustomerPhoneSerializer(data={})
        self.assertEqual(serializer.is_valid(), False)
        serializer = CustomerPhoneSerializer(data={'customer': self.customer_no_email.id})
        self.assertEqual(serializer.is_valid(), False)
        serializer = CustomerPhoneSerializer(data={'customer': self.customer_no_email.id, 'number_type': HOME})
        self.assertEqual(serializer.is_valid(), False)
        serializer = CustomerPhoneSerializer(data={'customer': self.customer_no_email.id, 'number_type': 'X', 'telephone': '1234'})
        self.assertEqual(serializer.is_valid(), False)

    def test_missing_data_customer_address_create(self):
        serializer = CustomerAddressSerializer(data={})
        self.assertEqual(serializer.is_valid(), False)
        serializer = CustomerAddressSerializer(data={'customer': self.customer_no_email.id})
        self.assertEqual(serializer.is_valid(), False)
        serializer = CustomerAddressSerializer(data={'customer': self.customer_no_email.id, 'address1': '2 Teme Road', 'postcode': ''})
        self.assertEqual(serializer.is_valid(), False)

    def test_missing_data_fitting_create(self):
        serializer = FittingSerializer(data={})
        self.assertEqual(serializer.is_valid(), False)
        serializer = FittingSerializer(data={'saddle_height': '34cm'})
        self.assertEqual(serializer.is_valid(), False)
        serializer = FittingSerializer(data={'saddle_height': '34cm', 'bar_height': '45 cm'})
        self.assertEqual(serializer.is_valid(), False)

    def test_add_duplicate_customer_fails(self):
        serializer = CustomerSerializer(data={'first_name': 'bod', 'last_name': 'prince'})
        self.assertEqual(serializer.is_valid(), False)
        serializer = CustomerSerializer(data={'first_name': 'Fred', 'last_name': 'Bloggs', 'email': 'f.b@c.com'})
        self.assertEqual(serializer.is_valid(), False)

    def test_not_duplicate_when_id(self):
        serializer = CustomerSerializer(data={'id': self.customer_no_email.id, 'first_name': self.customer_no_email.first_name, 'last_name': self.customer_no_email.last_name})
        self.assertEqual(serializer.is_valid(), False)
        serializer = CustomerSerializer(data={'id': self.customer_with_email.id, 'first_name': self.customer_with_email.first_name, 'last_name': self.customer_with_email.last_name, 'email': self.customer_with_email.email})
        self.assertEqual(serializer.is_valid(), False)

    def test_phone_create_duplicate(self):
        serializer = CustomerSerializer(data={'customer': self.customer_no_email.id, 'number_type':HOME, 'telephone':'01568 770451'})
        self.assertEqual(serializer.is_valid(), False)
        serializer = CustomerSerializer(data={'customer': self.customer_no_email.id, 'number_type':MOBILE, 'telephone':'01568 770451'})
        self.assertEqual(serializer.is_valid(), False)

    def test_address_create_duplicate(self):
        serializer = CustomerSerializer(data={'customer':self.customer_no_email.id, 'address1':self.c_n_m_address1.address1, 'postcode':self.c_n_m_address1.postcode})
        self.assertEqual(serializer.is_valid(), False)

    def test_address_update_duplicate(self):
        serializer = CustomerSerializer(data={'id':self.c_n_m_address1.id, 'customer':self.customer_no_email.id, 'address1':self.c_n_m_address2.address1, 'postcode':self.c_n_m_address2.postcode})
        self.assertEqual(serializer.is_valid(), False)
