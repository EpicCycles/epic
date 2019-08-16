import unittest

from django.contrib.auth.models import User

from epic.helpers.quote_helper import copy_quote_with_changes
from epic.models.bike_models import Frame, Bike
from epic.models.brand_models import Brand, Part
from epic.models.customer_models import Customer, Fitting
from epic.models.framework_models import PartType, PartSection
from epic.models.quote_models import Quote, QuotePart, Charge, QuoteCharge


class TestQuoteHelper(unittest.TestCase):
    def setUp(self):
        Customer.objects.all().delete()
        PartSection.objects.all().delete()
        PartType.objects.all().delete()
        Part.objects.all().delete()
        Charge.objects.all().delete()
        Brand.objects.all().delete()
        Quote.objects.all().delete()
        QuotePart.objects.all().delete()
        QuoteCharge.objects.all().delete()
        Frame.objects.all().delete()
        Bike.objects.all().delete()
        User.objects.all().delete()
        self.customer = Customer.objects.create(first_name="Bod", last_name='Prince')
        self.customer2 = Customer.objects.create(first_name="Fred", last_name='Bloggs', email='f.b@c.com')
        self.fitting = Fitting.objects.create(saddle_height='12', bar_height='123', reach='34', customer=self.customer)
        self.part_section1 = PartSection.objects.filter(name='Section 1').first()
        if not self.part_section1:
            self.part_section1 = PartSection.objects.create(name='Section 1', placing=3)
        self.part_type1 = PartType.objects.filter(name='Wheels').first()
        if not self.part_type1:
            self.part_type1 = PartType.objects.create(name='Wheels',
                                                      includeInSection=self.part_section1, placing=1,
                                                      can_be_substituted=True, can_be_omitted=True,
                                                      customer_visible=True)
        self.brand1 = Brand.objects.create(brand_name='Brand 1', link='orbea.co.uk')
        self.part1 = Part.objects.create_part(self.part_type1, self.brand1, 'Part 1')
        self.test_quote = Quote.objects.create(customer=self.customer, quote_desc='description')
        self.test_quote_part1 = QuotePart.objects.create(quote=self.test_quote, partType=self.part_type1,
                                                         not_required=True)
        self.test_quote_part2 = QuotePart.objects.create(quote=self.test_quote, partType=self.part_type1,
                                                         part=self.part1)
        self.charge1 = Charge.objects.create(charge_name='charge 1', price=200)
        self.charge2 = Charge.objects.create(charge_name='charge 2', price=50)
        self.quote_charge1 = QuoteCharge.objects.create(quote=self.test_quote, charge=self.charge1, price=150)
        self.user = User.objects.create(first_name='a', last_name='b')
        self.frame1 = Frame.objects.create(brand=self.brand1, frame_name='frame1')
        self.bike1 = Bike.objects.create(frame=self.frame1, model_name='bike1')
        self.frame2 = Frame.objects.create(brand=self.brand1, frame_name='frame2')
        self.bike2 = Bike.objects.create(frame=self.frame2, model_name='bike2', rrp=1299)
        self.test_quote_bike = Quote.objects.create(fitting=self.fitting, bike=self.bike1, customer=self.customer,
                                                    quote_desc='description for bike quote', colour='Purple',
                                                    bike_price=12345, frame_size='53cm')

    def test_copy_quote_with_changes_none(self):
        new_quote = copy_quote_with_changes(self.test_quote_bike, self.user, None, None, None)
        self.assertEqual(new_quote.customer, self.test_quote_bike.customer)
        self.assertEqual(new_quote.bike, self.test_quote_bike.bike)
        self.assertEqual(new_quote.fitting, self.test_quote_bike.fitting)
        self.assertEqual(new_quote.quote_desc, self.test_quote_bike.quote_desc)
        self.assertEqual(new_quote.created_by, self.user)
        expected_version = 2
        self.assertEqual(new_quote.version, expected_version)

    def test_copy_quote_with_new_customer(self):
        new_quote = copy_quote_with_changes(self.test_quote_bike, self.user, None, None, self.customer2)
        self.assertEqual(new_quote.customer, self.customer2)
        self.assertEqual(new_quote.bike, self.test_quote_bike.bike)
        self.assertEqual(new_quote.fitting, None)
        self.assertEqual(new_quote.quote_desc, self.test_quote_bike.quote_desc)
        expected_version = 1
        self.assertEqual(new_quote.version, expected_version)

    def test_copy_quote_with_new_bike(self):
        new_quote = copy_quote_with_changes(self.test_quote_bike, self.user, None, self.bike2, None)
        self.assertEqual(new_quote.customer, self.test_quote_bike.customer)
        self.assertEqual(new_quote.bike, self.bike2)
        self.assertEqual(new_quote.colour, None)
        self.assertEqual(new_quote.frame_size, None)
        self.assertEqual(new_quote.bike_price, 1299)
        self.assertEqual(new_quote.fitting, self.test_quote_bike.fitting)
        self.assertEqual(new_quote.quote_desc, self.test_quote_bike.quote_desc)
        expected_version = self.test_quote_bike.version + 1
        self.assertEqual(new_quote.version, expected_version)
