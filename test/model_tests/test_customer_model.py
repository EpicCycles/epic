import time

from django.test import TestCase

from epic.models.customer_models import *

class CustomerModelTestCase(TestCase):
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
                                                    bar_height='45', reach='23', notes='New note', fitting_type=CUST)

    def test_missing_data_customer_create(self):
        with self.assertRaises(ValueError):
            Customer.objects.create()
        with self.assertRaises(ValueError):
            Customer.objects.create(first_name='Annd')
        with self.assertRaises(ValueError):
            Customer.objects.create(last_name='Weaver')
        with self.assertRaises(ValueError):
            Customer.objects.create(last_name='')
        with self.assertRaises(ValueError):
            Customer.objects.create(first_name='New', last_name='Last', email='abc')

    def test_missing_data_customer_phone_create(self):
        with self.assertRaises(ValueError):
            CustomerPhone.objects.create(customer=self.customer_no_email)
        with self.assertRaises(ValueError):
            CustomerPhone.objects.create(customer=self.customer_no_email, number_type=HOME)
        with self.assertRaises(ValueError):
            CustomerPhone.objects.create(customer=self.customer_no_email, number_type='X', telephone='5678')

    def test_missing_data_customer_address_create(self):
        with self.assertRaises(ValueError):
            CustomerAddress.objects.create(customer=self.customer_no_email)
        with self.assertRaises(ValueError):
            CustomerAddress.objects.create(customer=self.customer_no_email, address1='2 Teme Road')

    def test_missing_data_fitting_create(self):
        with self.assertRaises(ValueError):
            Fitting.objects.create()
        with self.assertRaises(ValueError):
            Fitting.objects.create(saddle_height='34cm')
        with self.assertRaises(ValueError):
            Fitting.objects.create(saddle_height='34cm', bar_height='45 cm')

    def test_missing_data_customer_update(self):
        with self.assertRaises(ValueError):
            self.customer_with_email.first_name = None
            self.customer_with_email.save()
        with self.assertRaises(ValueError):
            self.customer_with_email.last_name = None
            self.customer_with_email.save()
        with self.assertRaises(ValueError):
            self.customer_with_email.first_name = None
            self.customer_with_email.last_name = None
            self.customer_with_email.save()

    def test_missing_data_customer_phone_update(self):
        with self.assertRaises(ValueError):
            self.c_n_m_home_phone.number_type = None
            self.c_n_m_home_phone.save()
        with self.assertRaises(ValueError):
            self.c_n_m_home_phone.telephone = None
            self.c_n_m_home_phone.save()
        with self.assertRaises(ValueError):
            self.c_n_m_home_phone.telephone = ''
            self.c_n_m_home_phone.save()

    def test_missing_data_customer_address_update(self):
        with self.assertRaises(ValueError):
            self.c_n_m_address1.address1 = None
            self.c_n_m_address1.save()
        with self.assertRaises(ValueError):
            self.c_n_m_address1.postcode = None
            self.c_n_m_address1.save()
        with self.assertRaises(ValueError):
            self.c_n_m_address1.address1 = ''
            self.c_n_m_address1.save()
        with self.assertRaises(ValueError):
            self.c_n_m_address1.postcode = ''
            self.c_n_m_address1.save()

    def test_missing_data_fitting_update(self):
        with self.assertRaises(ValueError):
            self.c_n_m_fitting.saddle_height = None
            self.c_n_m_fitting.save()
        with self.assertRaises(ValueError):
            self.c_n_m_fitting.bar_height = None
            self.c_n_m_fitting.save()
        with self.assertRaises(ValueError):
            self.c_n_m_fitting.reach = None
            self.c_n_m_fitting.save()
        with self.assertRaises(ValueError):
            self.c_n_m_fitting.saddle_height = ''
            self.c_n_m_fitting.save()
        with self.assertRaises(ValueError):
            self.c_n_m_fitting.bar_height = ''
            self.c_n_m_fitting.save()
        with self.assertRaises(ValueError):
            self.c_n_m_fitting.reach = ''
            self.c_n_m_fitting.save()

    def test_add_duplicate_customer_fails(self):
        with self.assertRaises(ValueError):
            Customer.objects.create(first_name="Bod", last_name='Prince')
        with self.assertRaises(ValueError):
            Customer.objects.create(first_name="Fred", last_name='Bloggs', email='f.b@c.com')

    def test_save_create_duplicate_customer_fails(self):
        with self.assertRaises(ValueError):
            self.customer_with_email2.last_name = self.customer_with_email.last_name
            self.customer_with_email2.save()

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

    def test_phone_create_duplicate(self):
        with self.assertRaises(ValueError):
            CustomerPhone.objects.create(customer=self.customer_no_email, number_type=HOME, telephone='01568 770451')
        with self.assertRaises(ValueError):
            CustomerPhone.objects.create(customer=self.customer_no_email, number_type=MOBILE, telephone='01568 770451')

    def test_phone_update_duplicate(self):
        with self.assertRaises(ValueError):
            self.c_n_m_home_phone.telephone = self.c_n_m_home_phone2.telephone
            self.c_n_m_home_phone.save()

    def test_address_create_duplicate(self):
        with self.assertRaises(ValueError):
            CustomerAddress.objects.create(customer=self.customer_no_email, address1=self.c_n_m_address1.address1,
                                           postcode=self.c_n_m_address1.postcode)

    def test_address_update_duplicate(self):
        with self.assertRaises(ValueError):
            self.c_n_m_address1.address1 = self.c_n_m_address2.address1
            self.c_n_m_address1.postcode = self.c_n_m_address2.postcode
            self.c_n_m_address1.save()

    def test_insert_new_telephone(self):
        new_telephone = CustomerPhone.objects.create(customer=self.customer_no_email, telephone='07866311879')
        self.assertEqual(new_telephone.telephone, '07866311879')
        self.assertEqual(new_telephone.number_type, HOME)
        self.assertEqual(new_telephone.customer, self.customer_no_email)
        self.assertNotEqual(new_telephone.add_date, None)

    def test_update_existing_telephone(self):
        phone_id = self.c_n_m_home_phone.id
        old_telephone = self.c_n_m_home_phone.telephone
        old_type = self.c_n_m_home_phone.number_type
        old_add_date = self.c_n_m_home_phone.add_date
        old_upd_date = self.c_n_m_home_phone.upd_date
        self.c_n_m_home_phone.telephone = '07813343266'
        self.c_n_m_home_phone.number_type = WORK
        self.c_n_m_home_phone.save()

        check_phone = CustomerPhone.objects.get(id=phone_id)
        self.assertEqual(old_add_date, check_phone.add_date)
        self.assertNotEqual(old_telephone, check_phone.telephone)
        self.assertNotEqual(old_type, check_phone.number_type)
        self.assertNotEqual(old_upd_date, check_phone.upd_date)

    def test_insert_new_address(self):
        new_address = CustomerAddress.objects.create(customer=self.customer_no_email, address1='Address line 1',
                                                     address2='Address line 2', address3='Address line 3',
                                                     address4='Address line 4', postcode='HR6 9UN')

        self.assertEqual(new_address.address1, 'Address line 1')
        self.assertEqual(new_address.address2, 'Address line 2')
        self.assertEqual(new_address.address3, 'Address line 3')
        self.assertEqual(new_address.address4, 'Address line 4')
        self.assertEqual(new_address.postcode, 'HR6 9UN')
        self.assertNotEqual(new_address.add_date, None)

    def test_update_address(self):
        address_id = self.c_n_m_address1.id
        old_address1 = self.c_n_m_address1.address1
        old_address2 = self.c_n_m_address1.address2
        old_address3 = self.c_n_m_address1.address3
        old_address4 = self.c_n_m_address1.address4
        old_postcode = self.c_n_m_address1.postcode
        old_add_date = self.c_n_m_address1.add_date
        old_upd_date = self.c_n_m_address1.upd_date
        time.sleep(1)
        self.c_n_m_address1.address1 = 'blah 1'
        self.c_n_m_address1.address2 = 'blah 2'
        self.c_n_m_address1.address3 = 'blah 3'
        self.c_n_m_address1.address4 = 'blah 4'
        self.c_n_m_address1.postcode = 'SY9 1EF'
        self.c_n_m_address1.save()

        check_address = CustomerAddress.objects.get(id=address_id)
        self.assertEqual(check_address.add_date, old_add_date)
        self.assertNotEqual(check_address.address1, old_address1)
        self.assertNotEqual(check_address.address2, old_address2)
        self.assertNotEqual(check_address.address3, old_address3)
        self.assertNotEqual(check_address.address4, old_address4)
        self.assertNotEqual(check_address.postcode, old_postcode)
        self.assertNotEqual(check_address.upd_date, old_upd_date)

    def test_update_fitting(self):
        fitting_id = self.c_n_m_fitting.id
        fitting_saddle = self.c_n_m_fitting.saddle_height
        fitting_bar = self.c_n_m_fitting.bar_height
        fitting_reach = self.c_n_m_fitting.reach
        fitting_notes = self.c_n_m_fitting.notes
        fitting_add = self.c_n_m_fitting.add_date
        fitting_upd = self.c_n_m_fitting.upd_date
        time.sleep(1)

        self.c_n_m_fitting.saddle_height = '34 cm'
        self.c_n_m_fitting.bar_height = '36 cm'
        self.c_n_m_fitting.reach = '38 cm'
        self.c_n_m_fitting.notes = 'changed notes'
        self.c_n_m_fitting.save()

        check_fitting = Fitting.objects.get(id=fitting_id)
        self.assertEqual(check_fitting.add_date, fitting_add)
        self.assertNotEqual(check_fitting.saddle_height, fitting_saddle)
        self.assertNotEqual(check_fitting.bar_height, fitting_bar)
        self.assertNotEqual(check_fitting.reach, fitting_reach)
        self.assertNotEqual(check_fitting.notes, fitting_notes)
        self.assertNotEqual(check_fitting.upd_date, fitting_upd)
