from decimal import Decimal

from django.contrib.auth.models import User
from django.db import IntegrityError
from django.test import TestCase, RequestFactory

from epic.forms import QuotePartForm
from epic.models import PartSection, PartType, PartTypeAttribute, TEXT, RADIO, NUMBER, SELECT, AttributeOptions, \
    Supplier, Brand, Part, Frame, FramePart, FrameExclusion, Quote, Fitting, Customer, QuotePart, BIKE, \
    PART, ISSUED, ARCHIVED, QuotePartAttribute


class QuoteModeltestCase(TestCase):
    def setUp(self):
        self.part_section1 = PartSection.objects.create(name='Section1', placing=1)
        self.part_section2 = PartSection.objects.create(name='Section2', placing=2)
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
        self.part_type5 = PartType.objects.create(shortName='I am new', description='Wheels description',
                                                  includeInSection=self.part_section1, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_facing=True)
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
        self.attribute_value1 = AttributeOptions.objects.create(part_type_attribute=self.part_type_attribute1,
                                                                attribute_option='Option 1')
        self.attribute_value2 = AttributeOptions.objects.create(part_type_attribute=self.part_type_attribute1,
                                                                attribute_option='Option 2')
        self.supplier1 = Supplier.objects.create(supplier_name='Supplier 1')
        self.supplier2 = Supplier.objects.create(supplier_name='Supplier 2')
        self.brand1 = Brand.objects.create(supplier=self.supplier1, brand_name='Brand 1', link='orbea.co.uk')
        self.brand2 = Brand.objects.create(brand_name='Brand 2')
        self.part1 = Part.objects.create_part(self.part_type1, self.brand1, 'Part 1')
        self.part2 = Part.objects.create_part(self.part_type1, self.brand1, 'Part 2')
        self.part_with_mandatory_attributes = Part.objects.create_part(self.part_type2, self.brand1,
                                                                       'Part breaks things')
        self.frame1 = Frame.objects.create(brand=self.brand1, frame_name='Frame 1', model='Model 1',
                                           sell_price=Decimal('2345.99'))
        self.frame2 = Frame.objects.create(brand=self.brand2, frame_name='Frame 2', model='Model 2',
                                           sell_price=Decimal('3345.99'))
        self.frame_part1 = FramePart.objects.create(frame=self.frame1, part=self.part1)
        self.frame_part2 = FramePart.objects.create(frame=self.frame1, part=self.part2)
        self.frame_exclusion1 = FrameExclusion.objects.create(frame=self.frame1, partType=self.part_type1)
        self.frame_exclusion2 = FrameExclusion.objects.create(frame=self.frame1, partType=self.part_type2)
        self.customer = Customer.objects.create(first_name='A', last_name='Customer')
        self.customer2 = Customer.objects.create(first_name='Anew', last_name='Shop-Customer')
        self.fitting = Fitting.objects.create(customer=self.customer, saddle_height='22', bar_height='23',
                                              reach='reach')
        self.user1 = User.objects.create_user(username='javed', email='javed@javed.com', password='my_secret')
        self.user2 = User.objects.create_user(username='Anna', email='Anna@javed.com', password='blah')
        self.quote1 = Quote.objects.create(customer=self.customer, quote_desc='Desc 1',
                                           quote_type=PART, created_by=self.user1)
        self.quote1_part1 = QuotePart.objects.create(quote=self.quote1, partType=self.part_type1, part=self.part1,
                                                     quantity=1, sell_price=9.99)

        self.quote2 = Quote.objects.create(customer=self.customer, quote_desc='Desc 2',
                                           quote_type=BIKE, created_by=self.user1, frame=self.frame1)
        self.quote2_part1 = QuotePart.objects.create(quote=self.quote2, partType=self.part1.partType, part=self.part1,
                                                     quantity=1, sell_price=234.5)
        self.quote2_part2 = QuotePart.objects.create(quote=self.quote2, partType=self.part2.partType, part=self.part2,
                                                     quantity=1, sell_price=26.99, replacement_part=True,
                                                     trade_in_price=23.99)
        self.quote2_part3 = QuotePart.objects.create(quote=self.quote2, partType=self.part_type2, replacement_part=True,
                                                     quantity=None, trade_in_price=99.99)
        self.quote3 = Quote.objects.create(customer=self.customer, quote_desc='Test attributes', quote_type=PART,
                                           created_by=self.user2)
        self.quote3_part = QuotePart.objects.create(quote=self.quote3, partType=self.part_type2,
                                                    part=self.part_with_mandatory_attributes, quantity=1, sell_price=23)
        self.requestFactory = RequestFactory()
        self.request = self.requestFactory.get('/epic/quote')
        self.request.user = self.user2

    def test_quote_insert_errors(self):
        with self.assertRaises(ValueError):
            Quote.objects.create(quote_desc='')
        with self.assertRaises(ValueError):
            Quote.objects.create()
        with self.assertRaises(ValueError):
            Quote.objects.create(quote_desc='BIKE no frame', quote_type=BIKE)
        with self.assertRaises(ValueError):
            Quote.objects.create(quote_desc='PART with frame', quote_type=PART, frame=self.frame1)
        with self.assertRaises(Exception):
            Quote.objects.create(quote_desc='Description')
        with self.assertRaises(ValueError):
            Quote.objects.create(quote_desc='Description', quote_type='XX')
        with self.assertRaises(ValueError):
            Quote.objects.create(quote_desc='Description', quote_status='XX')

    def test_quote_part_insert_errors(self):
        with self.assertRaises(Exception):
            QuotePart.objects.create()
        with self.assertRaises(ValueError):
            QuotePart.objects.create(quote=self.quote1, partType=self.part_type2)
        with self.assertRaises(ValueError):
            QuotePart.objects.create(quote=self.quote1, partType=self.part_type2, part=self.part1)
        with self.assertRaises(ValueError):
            QuotePart.objects.create(quote=self.quote1, partType=self.part_type2, replacement_part=True)
        with self.assertRaises(ValueError):
            QuotePart.objects.create(quote=self.quote1, partType=self.part_type2, trade_in_price=23)
        with self.assertRaises(ValueError):
            QuotePart.objects.create(quote=self.quote2, partType=self.part_type2, trade_in_price=23)
        with self.assertRaises(ValueError):
            QuotePart.objects.create(quote=self.quote2, partType=self.part_type2, replacement_part=True)
        with self.assertRaises(ValueError):
            QuotePart.objects.create(quote=self.quote2, partType=self.part_type3, replacement_part=True)
        with self.assertRaises(ValueError):
            QuotePart.objects.create(quote=self.quote2, partType=self.part_type4, replacement_part=True)

    def test_quote_part_attribute_insert_errors(self):
        with self.assertRaises(Exception):
            QuotePartAttribute.objects.create()
        with self.assertRaises(Exception):
            QuotePartAttribute.objects.create(quotePart=self.quote1_part1)
        with self.assertRaises(Exception):
            QuotePartAttribute.objects.create(partTypeAttribute=self.part_type_attribute1)
        with self.assertRaises(ValueError):
            QuotePartAttribute.objects.create(quotePart=self.quote1_part1, partTypeAttribute=self.part_type_attribute3)
        with self.assertRaises(ValueError):
            QuotePartAttribute.objects.create(quotePart=self.quote2_part3, partTypeAttribute=self.part_type_attribute3)
        with self.assertRaises(IntegrityError):
            QuotePartAttribute.objects.create(quotePart=self.quote3_part, partTypeAttribute=self.part_type_attribute1)

    def test_quote_update_errors1(self):
        check_id = self.quote1.id
        with self.assertRaises(ValueError):
            test_quote = Quote.objects.get(id=check_id)
            test_quote.quote_desc = None
            test_quote.save()

        with self.assertRaises(ValueError):
            test_quote = Quote.objects.get(id=check_id)
            test_quote.quote_desc = ''
            test_quote.save()

        with self.assertRaises(ValueError):
            test_quote = Quote.objects.get(id=check_id)
            test_quote.quote_type = BIKE
            test_quote.frame = None
            test_quote.save()
        with self.assertRaises(ValueError):
            test_quote = Quote.objects.get(id=check_id)
            test_quote.frame = self.frame1
            test_quote.save()
        with self.assertRaises(ValueError):
            test_quote = Quote.objects.get(id=check_id)
            test_quote.quote_type = 'XX'
            test_quote.save()
        with self.assertRaises(ValueError):
            test_quote = Quote.objects.get(id=check_id)
            test_quote.quote_status = 'XX'
            test_quote.save()

    def test_quote_update_exception(self):
        with self.assertRaises(Exception):
            self.quote1.customer = None
            self.quote1.save()

    def test_quote_part_update_errors(self):
        check_id_part = self.quote1_part1.id
        check_id_bike = self.quote2_part3.id
        with self.assertRaises(ValueError):
            test_part = QuotePart.objects.get(id=check_id_part)
            test_part.replacement_part = True
            test_part.save()
        with self.assertRaises(ValueError):
            test_part = QuotePart.objects.get(id=check_id_part)
            test_part.trade_in_price = 2
            test_part.save()
        with self.assertRaises(ValueError):
            test_part = QuotePart.objects.get(id=check_id_part)
            test_part.partType = self.part_type3
            test_part.save()
        with self.assertRaises(ValueError):
            test_part = QuotePart.objects.get(id=check_id_bike)
            test_part.trade_in_price = 2
            test_part.replacement_part = False
            test_part.save()
        with self.assertRaises(ValueError):
            test_part = QuotePart.objects.get(id=check_id_bike)
            test_part.partType = self.part_type3
            test_part.save()
        with self.assertRaises(ValueError):
            test_part = QuotePart.objects.get(id=check_id_bike)
            test_part.partType = self.part_type4
            test_part.save()

    def test_quote_part_attribute_update_errors(self):
        check_id = QuotePartAttribute.objects.filter(quotePart=self.quote3_part,
                                                     partTypeAttribute=self.part_type_attribute1).first().id
        with self.assertRaises(ValueError):
            test_object = QuotePartAttribute.objects.get(id=check_id)
            test_object.quotePart = self.quote2_part3
            test_object.save()
        with self.assertRaises(ValueError):
            test_object = QuotePartAttribute.objects.get(id=check_id)
            test_object.partTypeAttribute = self.part_type_attribute4
            test_object.save()
        with self.assertRaises(IntegrityError):
            test_object = QuotePartAttribute.objects.get(id=check_id)
            test_object.partTypeAttribute = self.part_type_attribute2
            test_object.save()

    def test_quote_string(self):
        expected = f'{self.quote1.quote_desc} ({str(self.quote1.version)})'
        self.assertEqual(expected, str(self.quote1))

    def test_quote_part_string(self):
        self.assertTrue(str(self.quote2_part3).endswith('No part ***'))
        self.assertFalse(str(self.quote2_part2).endswith('No part ***'))
        self.assertTrue(str(self.quote2_part2).endswith('***'))
        self.assertEqual(str(self.quote1_part1.part), str(self.quote1_part1))
        self.assertEqual(str(self.quote2_part1.part), str(self.quote2_part1))

    def test_quote_part_attribute_string(self):
        attribute = QuotePartAttribute.objects.filter(quotePart=self.quote3_part).first()
        self.assertTrue(str(attribute).endswith(': NOT SET'))
        attribute.attribute_value = 'Bingo'
        attribute.save()
        self.assertTrue(str(attribute).endswith(': Bingo'))

    def test_quote_is_bike(self):
        self.assertEqual(False, self.quote1.is_bike())
        self.assertEqual(True, self.quote2.is_bike())

    def test_quote_lifecycle_tests_part(self):
        # base settings
        self.assertEqual(False, self.quote1.can_be_issued)
        self.assertEqual(True, self.quote1.can_be_edited())

        # Issue has no effect
        status_before = self.quote1.quote_status
        self.quote1.issue()
        self.assertEqual(status_before, self.quote1.quote_status)

        self.quote1.keyed_sell_price = self.quote1.sell_price
        self.quote1.save()
        self.assertEqual(True, self.quote1.can_be_issued)
        self.assertEqual(True, self.quote1.can_be_edited())
        self.assertEqual(False, self.quote1.can_be_reissued())

        # add a quote part that requires attributes
        temp_quote_part = QuotePart.objects.create(quote=self.quote1,
                                                   partType=self.part_with_mandatory_attributes.partType,
                                                   part=self.part_with_mandatory_attributes, quantity=1)
        self.quote1.save()
        self.assertEqual(False, self.quote1.can_be_issued)

        # quote with no parts cannot be issued
        QuotePart.objects.filter(quote=self.quote1).delete()
        self.quote1.save()
        self.assertEqual(False, self.quote1.can_be_issued)

        # quote with part inc
        QuotePart.objects.create(quote=self.quote1, partType=self.part_type1, part=self.part1,
                                 quantity=1, sell_price=234.5)
        self.quote1.save()
        self.assertEqual(True, self.quote1.can_be_issued)

        # Issue quote and check updates
        self.quote1.issue()
        self.assertNotEqual(status_before, self.quote1.quote_status)
        self.assertEqual(ISSUED, self.quote1.quote_status)
        self.assertEqual(False, self.quote1.can_be_issued)
        self.assertEqual(False, self.quote1.can_be_edited())
        self.assertEqual(True, self.quote1.can_be_reissued())

        self.quote1.archive()
        self.assertEqual(ARCHIVED, self.quote1.quote_status)
        self.assertEqual(False, self.quote1.can_be_issued)
        self.assertEqual(False, self.quote1.can_be_edited())
        self.assertEqual(True, self.quote1.can_be_reissued())

    def test_quote_lifecycle_tests_bike(self):
        self.assertEqual(False, self.quote2.can_be_issued)

        self.quote2.keyed_sell_price = self.quote2.sell_price
        self.quote2.frame_size = '53cm'
        self.quote2.colour = 'Red'
        self.quote2.colour_price = Decimal('0')
        self.quote2.frame_sell_price = Decimal('999.99')
        self.quote2.save()
        self.assertEqual(True, self.quote2.can_be_issued)
        self.assertEqual(True, self.quote2.can_be_edited())

        # change each bit in turn to check method
        self.quote2.keyed_sell_price = None
        self.quote2.save()
        self.assertEqual(False, self.quote2.can_be_issued)

        self.quote2.keyed_sell_price = self.quote2.sell_price
        self.quote2.frame_size = None
        self.quote2.save()
        self.assertEqual(False, self.quote2.can_be_issued)

        self.quote2.frame_size = '53cm'
        self.quote2.colour = None
        self.quote2.save()
        self.assertEqual(False, self.quote2.can_be_issued)

        self.quote2.colour = 'Red'
        self.quote2.colour_price = None
        self.quote2.save()
        self.assertEqual(False, self.quote2.can_be_issued)

        self.quote2.colour_price = Decimal('0')
        self.quote2.frame_sell_price = None
        self.quote2.save()
        self.assertEqual(False, self.quote2.can_be_issued)

        self.quote2.frame_sell_price = Decimal('999.99')
        self.quote2.save()
        self.assertEqual(True, self.quote2.can_be_issued)

        # add a quote part that requires attributes
        temp_quote_part = QuotePart.objects.create(quote=self.quote2,
                                                   partType=self.part_with_mandatory_attributes.partType,
                                                   part=self.part_with_mandatory_attributes, quantity=1)
        self.quote2.save()
        self.assertEqual(False, self.quote2.can_be_issued)

        # quote with no parts can be issued (because bike
        QuotePart.objects.filter(quote=self.quote2).delete()
        self.quote2.save()
        self.assertEqual(True, self.quote2.can_be_issued)

        # quote with part inc
        QuotePart.objects.create(quote=self.quote2, partType=self.part_type1, part=self.part1,
                                 quantity=1, sell_price=234.5)
        self.quote2.save()
        self.assertEqual(True, self.quote2.can_be_issued)

    def test_quote_recalculate_prices(self):
        # test simple quote no lines - price is 0
        QuotePart.objects.filter(quote=self.quote1).delete()
        self.assertEqual(Decimal(0), self.quote1.recalculate_prices())

        # if parts then price is sum of parts
        # 1 part
        QuotePart.objects.create(quote=self.quote1, partType=self.part_type1, part=self.part1,
                                 quantity=1, sell_price=Decimal(234.5))
        self.assertEqual(Decimal(234.5), self.quote1.recalculate_prices())
        # 2 parts second wih quantity > 1
        QuotePart.objects.create(quote=self.quote1, partType=self.part_type1, part=self.part1,
                                 quantity=2, sell_price=Decimal(20))
        self.assertEqual(Decimal(274.5), self.quote1.recalculate_prices())

        # test bike quote no lines - price is frame price
        QuotePart.objects.filter(quote=self.quote1).delete()
        new_quote = Quote.objects.create(quote_desc='new bike', customer=self.customer, frame=self.frame2)
        self.assertEqual(self.frame2.sell_price, new_quote.recalculate_prices())

        new_quote.colour_price = Decimal('100')
        new_quote.save()
        expected_price = self.frame2.sell_price + new_quote.colour_price
        self.assertEqual(expected_price, new_quote.recalculate_prices())

        QuotePart.objects.create(quote=new_quote, partType=self.part_type1, part=self.part1,
                                 quantity=1, sell_price=Decimal(234.5))
        QuotePart.objects.create(quote=new_quote, partType=self.part_type1, part=self.part1,
                                 quantity=2, sell_price=Decimal(20))
        expected_price += Decimal(274.5)
        self.assertEqual(expected_price, new_quote.recalculate_prices())

        QuotePart.objects.create(quote=new_quote, replacement_part=True, trade_in_price=Decimal('50'),
                                 partType=self.part_type2)
        expected_price -= Decimal('50')
        self.assertEqual(expected_price, new_quote.recalculate_prices())

        QuotePart.objects.create(quote=new_quote, partType=self.part_type1, part=self.part2,
                                 sell_price=Decimal('99.99'),
                                 replacement_part=True, trade_in_price=Decimal('50'))
        expected_price += Decimal('49.99')
        self.assertEqual(expected_price, new_quote.recalculate_prices())

    def test_copy_quote_part_to_new_quote(self):
        new_part = QuotePart.objects.copy_quote_part_to_new_quote(self.quote2, self.quote1_part1)
        self.assertEqual(self.quote2, new_part.quote)
        self.assertEqual(self.quote1_part1.partType, new_part.partType)
        self.assertEqual(self.quote1_part1.quantity, new_part.quantity)
        self.assertEqual(self.quote1_part1.sell_price, new_part.sell_price)
        self.assertEqual(self.quote1_part1.trade_in_price, new_part.trade_in_price)
        self.assertEqual(self.quote1_part1.replacement_part, new_part.replacement_part)

    def test_create_quote_part_with_form(self):
        form = QuotePartForm({'part_type': self.part_type1.id,
                              'brand': self.brand1.id,
                              'part_name': 'New part',
                              'quantity': '1',
                              'sell_price': '45.99',
                              'is_bike': False,
                              'replacement_part': False,
                              'trade_in_price': ''}, initial={'is_bike': False, })
        self.assertTrue(form.is_valid())

        new_part = QuotePart.objects.create_quote_part(self.quote1, form)
        self.assertEqual(self.quote1, new_part.quote)
        self.assertEqual(self.part_type1, new_part.partType)
        self.assertEqual(self.brand1, new_part.part.brand)
        self.assertEqual('New part', new_part.part.part_name)
        self.assertEqual(Decimal('1'), new_part.quantity)
        self.assertEqual(Decimal('45.99'), new_part.sell_price)
        self.assertEqual(None, new_part.trade_in_price)
        self.assertEqual(False, new_part.replacement_part)

    def test_create_replacement_quote_part_with_form(self):
        form = QuotePartForm({'part_type': self.part_type4.id,
                              'brand': self.brand1.id,
                              'part_name': 'New part',
                              'quantity': '1',
                              'sell_price': '45.99',
                              'is_bike': False,
                              'replacement_part': True,
                              'trade_in_price': '23.99'}, initial={'is_bike': False, })
        self.assertTrue(form.is_valid())

        new_part = QuotePart.objects.create_quote_part(self.quote2, form)
        self.assertEqual(self.quote2, new_part.quote)
        self.assertEqual(self.part_type4, new_part.partType)
        self.assertEqual(self.brand1, new_part.part.brand)
        self.assertEqual('New part', new_part.part.part_name)
        self.assertEqual(Decimal('1'), new_part.quantity)
        self.assertEqual(Decimal('45.99'), new_part.sell_price)
        self.assertEqual(Decimal('23.99'), new_part.trade_in_price)
        self.assertEqual(True, new_part.replacement_part)

    def test_create_omitted_quote_part_with_form(self):
        form = QuotePartForm({'part_type': self.part_type5.id,
                              'is_bike': False,
                              'replacement_part': True,
                              'trade_in_price': '23.99'}, initial={'is_bike': False, })
        self.assertTrue(form.is_valid())

        new_part = QuotePart.objects.create_quote_part(self.quote2, form)
        self.assertEqual(self.quote2, new_part.quote)
        self.assertEqual(self.part_type5, new_part.partType)
        self.assertEqual(None, new_part.part)
        self.assertEqual(1, new_part.quantity)
        self.assertEqual(None, new_part.sell_price)
        self.assertEqual(Decimal('23.99'), new_part.trade_in_price)
        self.assertEqual(True, new_part.replacement_part)

    def test_get_attributes_for_quote_part(self):
        expected_attributes = QuotePartAttribute.objects.filter(quotePart=self.quote1_part1)
        self.assertEqual(expected_attributes.count(), self.quote1_part1.get_attributes().count())

    def test_quote_part_attributes_is_missing(self):
        mandatory_attribute = QuotePartAttribute.objects.get(quotePart=self.quote3_part,
                                                             partTypeAttribute=self.part_type_attribute1)
        self.assertTrue(mandatory_attribute.is_missing())
        mandatory_attribute.attribute_value = 'has value'
        mandatory_attribute.save()
        self.assertFalse(mandatory_attribute.is_missing())

        optional_attribute = QuotePartAttribute.objects.get(quotePart=self.quote3_part,
                                                            partTypeAttribute=self.part_type_attribute2)
        self.assertFalse(mandatory_attribute.is_missing())
        optional_attribute.attribute_value = 'value set'
        optional_attribute.save()
        self.assertFalse(mandatory_attribute.is_missing())
