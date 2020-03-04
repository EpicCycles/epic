import time

from django.test import TestCase

from epic.models.customer_models import *


class CustomerModelTestCase(TestCase):
    def setUp(self):
        self.customer_no_email = Customer.objects.create(first_name="Bod", last_name='Prince')
        self.customer_with_email = Customer.objects.create(first_name="Fred", last_name='Bloggs', email='f.b@c.com')
        self.customer_with_email2 = Customer.objects.create(first_name="Fred", last_name='not-Bloggs',
                                                            email='f.b@c.com')

    def test_create_new_email_customer(self):
        new_customer = Customer.objects.create(first_name=self.customer_no_email.first_name,
                                               last_name=self.customer_no_email.last_name, email='a.b@c.com')
        self.assertEqual(new_customer.last_name, self.customer_no_email.last_name)
        self.assertEqual(new_customer.first_name, self.customer_no_email.first_name)
        self.assertNotEqual(new_customer.email, self.customer_no_email.email)
        self.assertNotEqual(new_customer.email, None)
        self.assertNotEqual(new_customer.add_date, self.customer_no_email.add_date)
        self.assertNotEqual(new_customer.add_date, None)
        self.assertNotEqual(new_customer.upd_date, None)

    def test_update_customer_fields(self):
        old_first = self.customer_with_email.first_name
        old_last = self.customer_with_email.last_name
        old_email = self.customer_with_email.email
        old_add = self.customer_with_email.add_date
        old_upd = self.customer_with_email.upd_date
        old_id = self.customer_with_email.id

        self.customer_with_email.first_name = 'Bob'
        self.customer_with_email.last_name = 'Bobbness'
        self.customer_with_email.email = 'bob@bobness.me.com'
        self.customer_with_email.save()
        check_customer = Customer.objects.get(id=old_id)

        self.assertEqual(check_customer.first_name, self.customer_with_email.first_name)
        self.assertEqual(check_customer.last_name, self.customer_with_email.last_name)
        self.assertEqual(check_customer.email, self.customer_with_email.email)
        self.assertEqual(check_customer.add_date, self.customer_with_email.add_date)

        self.assertNotEqual(check_customer.first_name, old_first)
        self.assertNotEqual(check_customer.last_name, old_last)
        self.assertNotEqual(check_customer.email, old_email)
        self.assertEqual(check_customer.add_date, old_add)
        self.assertNotEqual(check_customer.upd_date, old_upd)
