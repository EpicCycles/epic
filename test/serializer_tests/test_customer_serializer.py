from django.test import TestCase

from epic.model_serializers.customer_serializer import CustomerSerializer
from epic.models.customer_models import *


class CustomerSerializerTestCase(TestCase):
    def setUp(self):
        self.customer_no_email = Customer.objects.create(first_name="Bod", last_name='Prince')
        self.customer_with_email = Customer.objects.create(first_name="Fred", last_name='Bloggs', email='f.b@c.com')
        self.customer_with_email2 = Customer.objects.create(first_name="Fred", last_name='not-Bloggs',
                                                            email='f.b@c.com')

    def test_missing_data_customer_create(self):
        serializer = CustomerSerializer(data={})
        self.assertEqual(serializer.is_valid(), False)
        serializer = CustomerSerializer(data={'first_name': 'Annd'})
        self.assertEqual(serializer.is_valid(), False)
        serializer = CustomerSerializer(data={'last_name': 'Annd'})
        self.assertEqual(serializer.is_valid(), False)
        serializer = CustomerSerializer(data={'last_name': ''})
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

