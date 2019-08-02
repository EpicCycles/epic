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
        self.test_quote = Quote.objects.create(customer=self.customer, quote_desc='description')
        self.test_quote_part1 = QuotePart.objects.create(quote=self.test_quote, partType=self.part_type1,
                                                         not_required=True)
        self.test_quote_part2 = QuotePart.objects.create(quote=self.test_quote, partType=self.part_type1,
                                                         part=self.part1)
        self.charge1 = Charge.objects.create(charge_name='charge 1', price=200)
        self.charge2 = Charge.objects.create(charge_name='charge 2', price=50)
        self.quote_charge1 = QuoteCharge.objects.create(quote=self.test_quote, charge=self.charge1, price=150)

    def test_quote_part_validate(self):
        serializer = QuotePartSerializer(data={})
        self.assertEqual(serializer.is_valid(), False)

        serializer = QuotePartSerializer(data={'quote': self.test_quote.id})
        self.assertEqual(serializer.is_valid(), False)

        serializer = QuotePartSerializer(
            data={'quote': self.test_quote.id, 'partType': self.part_type1.id, 'not_required': True})
        self.assertEqual(serializer.is_valid(), True)

        serializer = QuotePartSerializer(
            data={'quote': self.test_quote.id, 'partType': self.part_type1.id, 'part': self.part1.id})
        self.assertEqual(serializer.is_valid(), False)

        serializer = QuotePartSerializer(
            data={'quote': self.test_quote.id, 'partType': self.part_type1.id, 'part': self.part1.id, 'quantity': 1})
        self.assertEqual(serializer.is_valid(), True)

    def test_charge_data(self):
        serializer = ChargeSerializer(self.charge1)
        self.assertEqual(serializer.data.get('can_be_deleted'), False)
        serializer = ChargeSerializer(self.charge2)
        self.assertEqual(serializer.data.get('can_be_deleted'), True)
