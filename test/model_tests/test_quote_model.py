from django.test import TestCase

from epic.models.brand_models import Brand, Part
from epic.models.framework_models import PartSection, PartType
from epic.models.quote_models import *


class QuoteModelSerializersTestCase(TestCase):
    def setUp(self):
        self.customer = Customer.objects.create(first_name="Bod", last_name='Prince')
        self.part_section1 = PartSection.objects.create(name='Section1', placing=1)
        self.part_type1 = PartType.objects.create(name='Wheels',
                                                  includeInSection=self.part_section1, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_visible=True)
        self.brand1 = Brand.objects.create(brand_name='Brand 1', link='orbea.co.uk')
        self.part1 = Part.objects.create_part(self.part_type1, self.brand1, 'Part 1')
        self.test_quote1 = Quote.objects.create(customer=self.customer, quote_desc='description', quote_price=1234.56)
        self.test_quote2 = Quote.objects.create(customer=self.customer, quote_desc='description', quote_status=ARCHIVED,
                                                quote_price=1234)
        self.charge1 = Charge.objects.create(charge_name='charge 1', price=200)
        self.charge2 = Charge.objects.create(charge_name='charge 2', price=50)

    def test_quote1_issue(self):
        self.assertNotEqual(self.test_quote1.quote_status, ISSUED)
        self.assertEqual(self.test_quote1.issued_date, None)
        self.test_quote1.issue()
        self.assertEqual(self.test_quote1.quote_status, ISSUED)
        self.assertNotEqual(self.test_quote1.issued_date, None)

    def test_quote1_order(self):
        self.assertNotEqual(self.test_quote1.quote_status, ORDERED)
        self.test_quote1.order()
        self.assertEqual(self.test_quote1.quote_status, ORDERED)

    def test_quote1_archive(self):
        self.assertNotEqual(self.test_quote1.quote_status, ARCHIVED)
        self.test_quote1.archive()
        self.assertEqual(self.test_quote1.quote_status, ARCHIVED)

    def test_quote2_archive_reset(self):
        self.assertEqual(self.test_quote2.quote_status, ARCHIVED)
        self.assertNotEqual(self.test_quote2.quote_price, None)
        self.test_quote2.archive_reset()
        self.assertEqual(self.test_quote2.quote_status, INITIAL)
        self.assertEqual(self.test_quote2.quote_price, None)
