from django.test import TestCase

from epic.forms import QuotePartForm
from epic.models import PartSection, PartType, PartTypeAttribute, TEXT, RADIO, NUMBER, SELECT, Supplier, Brand


class QuotePartFormTestCase(TestCase):

    def setUp(self):
        self.part_section1 = PartSection.objects.create(name='Section1', placing=1)
        self.part_section2 = PartSection.objects.create(name='Section2', placing=2)
        self.supplier1 = Supplier.objects.create(supplier_name='Supplier 1')
        self.supplier2 = Supplier.objects.create(supplier_name='Supplier 2')
        self.part_type1 = PartType.objects.create(shortName='Wheels', description='Wheels description',
                                                  includeInSection=self.part_section1, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_facing=True)
        self.part_type2 = PartType.objects.create(shortName='Lights', description='Wheels description',
                                                  includeInSection=self.part_section1, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_facing=True)
        self.part_type3 = PartType.objects.create(shortName='Leave me alone', description='Wheels description',
                                                  includeInSection=self.part_section1, placing=1,
                                                  can_be_substituted=False, can_be_omitted=True, customer_facing=True)
        self.part_type4 = PartType.objects.create(shortName='I am unique', description='Wheels description',
                                                  includeInSection=self.part_section1, placing=1,
                                                  can_be_substituted=True, can_be_omitted=False, customer_facing=True)
        self.part_type_attribute1 = PartTypeAttribute.objects.create(partType=self.part_type2,
                                                                     attribute_name='attribute 1', placing=1,
                                                                     attribute_type=TEXT)
        self.part_type_attribute2 = PartTypeAttribute.objects.create(partType=self.part_type2,
                                                                     attribute_name='attribute 2', placing=2,
                                                                     attribute_type=RADIO, mandatory=False)
        self.part_type_attribute3 = PartTypeAttribute.objects.create(partType=self.part_type2,
                                                                     attribute_name='attribute 3', placing=3,
                                                                     attribute_type=NUMBER, in_use=False)
        self.part_type_attribute4 = PartTypeAttribute.objects.create(partType=self.part_type1,
                                                                     attribute_name='attribute 4', placing=4,
                                                                     attribute_type=SELECT, in_use=False,
                                                                     mandatory=False)
        self.brand1 = Brand.objects.create(supplier=self.supplier1, brand_name='Brand 1', link='orbea.co.uk')
        self.brand2 = Brand.objects.create(brand_name='Brand 2')

    def test_valid_data(self):
        form = QuotePartForm({'part_type': self.part_type1.id,
                              'brand': self.brand1.id,
                              'part_name': 'New part',
                              'quantity': '1',
                              'sell_price': '45.99',
                              'is_bike': False,
                              'replacement_part': False,
                              'trade_in_price': ''}, initial={'is_bike': False, })
        self.assertTrue(form.is_valid())

    def test_blank_part_type_with_part(self):
        form = QuotePartForm({
            'brand': self.brand1.id,
            'part_name': 'New part',
            'quantity': '1',
            'sell_price': '45.99',
            'is_bike': False,
            'replacement_part': False,
            'trade_in_price': ''}, initial={'is_bike': False, })
        self.assertFalse(form.is_valid())

    def test_part_missing_brand(self):
        form = QuotePartForm({'part_type': self.part_type1.id,
                              'part_name': 'New part',
                              'quantity': '1',
                              'sell_price': '45.99',
                              'is_bike': False,
                              'replacement_part': False,
                              'trade_in_price': ''}, initial={'is_bike': False, })
        self.assertFalse(form.is_valid())

    def test_part_missing_part_name(self):
        form = QuotePartForm({'part_type': self.part_type1.id,
                              'brand': self.brand1.id,
                              'quantity': '1',
                              'sell_price': '45.99',
                              'is_bike': False,
                              'replacement_part': False,
                              'trade_in_price': ''}, initial={'is_bike': False, })
        self.assertFalse(form.is_valid())

    def test_part_missing_quantity(self):
        form = QuotePartForm({'part_type': self.part_type1.id,
                              'brand': self.brand1.id,
                              'part_name': 'New part',
                              'sell_price': '45.99',
                              'is_bike': False,
                              'replacement_part': False,
                              'trade_in_price': ''}, initial={'is_bike': False, })
        self.assertFalse(form.is_valid())

    def test_part_missing_sell_price(self):
        form = QuotePartForm({'part_type': self.part_type1.id,
                              'brand': self.brand1.id,
                              'part_name': 'New part',
                              'quantity': '1',
                              'is_bike': False,
                              'replacement_part': False,
                              'trade_in_price': ''}, initial={'is_bike': False, })
        self.assertFalse(form.is_valid())

    def test_trade_in_not_replacement(self):
        form = QuotePartForm({'part_type': self.part_type1.id,
                              'brand': self.brand1.id,
                              'part_name': 'New part',
                              'quantity': '1',
                              'sell_price': '45.99',
                              'is_bike': False,
                              'replacement_part': False,
                              'trade_in_price': '23.99'}, initial={'is_bike': False, })
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'trade_in_price': ['Trade in price should be blank when part is not substituted or omitted.'],
        })

    def test_replacement_no_price(self):
        form = QuotePartForm({'part_type': self.part_type1.id,
                              'brand': self.brand1.id,
                              'part_name': 'New part',
                              'quantity': '1',
                              'sell_price': '45.99',
                              'is_bike': False,
                              'replacement_part': True,
                              'trade_in_price': ''}, initial={'is_bike': False, })
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'trade_in_price': ['Trade in price required, can be zero, when part is substituted or omitted.'],
        })

    def test_omission_allowed(self):
        form = QuotePartForm({'part_type': self.part_type2.id,
                              'is_bike': False,
                              'replacement_part': True,
                              'trade_in_price': '23.99'}, initial={'is_bike': False, })
        self.assertTrue(form.is_valid())

    def test_replacement_allowed_with_part(self):
        form = QuotePartForm({'part_type': self.part_type4.id,
                              'brand': self.brand1.id,
                              'part_name': 'New part',
                              'quantity': '1',
                              'sell_price': '45.99',
                              'is_bike': False,
                              'replacement_part': True,
                              'trade_in_price': '23.99'}, initial={'is_bike': False, })
        self.assertTrue(form.is_valid())

    def test_replacement_not_allowed_with_part(self):
        form = QuotePartForm({'part_type': self.part_type3.id,
                              'brand': self.brand1.id,
                              'part_name': 'New part',
                              'quantity': '1',
                              'sell_price': '45.99',
                              'is_bike': False,
                              'replacement_part': True,
                              'trade_in_price': '23.99'}, initial={'is_bike': False, })
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'part_type': ['This part cannot be substituted or omitted.'],
        })

    def test_omission_not_allowed(self):
        form = QuotePartForm({'part_type': self.part_type4.id,
                              'is_bike': False,
                              'replacement_part': True,
                              'trade_in_price': '23.99'}, initial={'is_bike': False, })
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'part_type': ['This part cannot be omitted.'],
        })
