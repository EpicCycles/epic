from django.test import TestCase

from epic.model_serializers.quote_serializer import QuotePartSerializer, ChargeSerializer
from epic.models.brand_models import Brand
from epic.models.framework_models import PartSection
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
        self.test_quote1 = Quote.objects.create(customer=self.customer, quote_desc='description')
        self.test_quote2 = Quote.objects.create(customer=self.customer, quote_desc='description', quote_status=ARCHIVED,
                                                quote_price=1234)
        self.test_quote1_part1 = QuotePart.objects.create(quote=self.test_quote1, partType=self.part_type1,
                                                          not_required=True, trade_in_price=2)
        self.test_quote1_part2 = QuotePart.objects.create(quote=self.test_quote1, partType=self.part_type1,
                                                          part=self.part1, part_price=100, quantity=2)
        self.charge1 = Charge.objects.create(charge_name='charge 1', price=200)
        self.charge2 = Charge.objects.create(charge_name='charge 2', price=50)
        self.quote_charge1 = QuoteCharge.objects.create(quote=self.test_quote1, charge=self.charge1, price=150)

    def test_quote1_issue(self):
        self.assertNotEqual(self.test_quote1.quote_status, ISSUED)
        self.assertEqual(self.test_quote1.issued_date, None)
        self.test_quote1.issue()
        self.assertEqual(self.test_quote1.quote_status, ISSUED)
        self.assertNotEqual(self.test_quote1.issued_date, None)

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

    def test_quote1_recalculate_price(self):
        self.assertEqual(self.test_quote1.calculated_price, None)
        self.test_quote1.recalculate_price()

        self.assertEqual(self.test_quote1.calculated_price, 348)

        QuoteCharge.objects.create(quote=self.test_quote1, charge=self.charge2, price=-50)
        self.test_quote1.recalculate_price()
        self.assertEqual(self.test_quote1.calculated_price, 298)

        self.test_quote1_part2.quantity = 1
        self.test_quote1_part2.save()

        self.test_quote1.recalculate_price()
        self.assertEqual(self.test_quote1.calculated_price, 198)

