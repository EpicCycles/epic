from decimal import Decimal

from django.contrib.auth.models import User
from django.test import TestCase, RequestFactory

from epic.model_helpers.frame_helper import frame_display
from epic.model_helpers.quote_helper import quote_display
from epic.models import PartSection, PartType, PartTypeAttribute, TEXT, RADIO, NUMBER, SELECT, AttributeOptions, \
    Supplier, Brand, Part, Frame, FramePart, FrameExclusion, Quote, Fitting, Customer, QuotePart, BIKE, \
    PART


class QuoteModeltestCase(TestCase):
    def setUp(self):
        self.part_section1 = PartSection.objects.create(name='Section1', placing=2)
        self.part_section2 = PartSection.objects.create(name='Section2', placing=1)
        self.part_type1 = PartType.objects.create(shortName='Wheels', description='Wheels description',
                                                  includeInSection=self.part_section1, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_facing=True)
        self.part_type2 = PartType.objects.create(shortName='Lights', description='Wheels description',
                                                  includeInSection=self.part_section2, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_facing=False)
        self.part_type3 = PartType.objects.create(shortName='Leave me alone', description='Wheels description',
                                                  includeInSection=self.part_section1, placing=1,
                                                  can_be_substituted=False, can_be_omitted=True, customer_facing=True)
        self.part_type4 = PartType.objects.create(shortName='I am unique', description='Wheels description',
                                                  includeInSection=self.part_section2, placing=1,
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
        self.part2 = Part.objects.create_part(self.part_type2, self.brand1, 'Part 2')
        self.part3 = Part.objects.create_part(self.part_type3, self.brand1, 'Part 3')
        self.part4 = Part.objects.create_part(self.part_type4, self.brand1, 'Part 4')
        self.part5 = Part.objects.create_part(self.part_type5, self.brand1, 'Part 5')
        self.part1a = Part.objects.create_part(self.part_type1, self.brand2, 'Part 1a')
        self.part2a = Part.objects.create_part(self.part_type2, self.brand1, 'Part 2a')
        self.part3a = Part.objects.create_part(self.part_type3, self.brand2, 'Part 3a')
        self.part4a = Part.objects.create_part(self.part_type4, self.brand1, 'Part 4a')
        self.part5a = Part.objects.create_part(self.part_type5, self.brand2, 'Part 5a')
        self.part_with_mandatory_attributes = Part.objects.create_part(self.part_type2, self.brand1,
                                                                       'Part breaks things')
        self.part3 = Part.objects.create_part(self.part_type3, self.brand2, 'Part 3')
        self.frame1 = Frame.objects.create(brand=self.brand1, frame_name='Frame 1', model='Model 1',
                                           sell_price=Decimal('2345.99'))
        self.frame2 = Frame.objects.create(brand=self.brand2, frame_name='Frame 2', model='Model 2',
                                           sell_price=Decimal('3345.99'))
        self.frame_part1 = FramePart.objects.create(frame=self.frame1, part=self.part1)
        self.frame_part2 = FramePart.objects.create(frame=self.frame1, part=self.part2)
        self.frame_part3 = FramePart.objects.create(frame=self.frame1, part=self.part3)
        self.frame_part4 = FramePart.objects.create(frame=self.frame1, part=self.part4)
        self.frame_part5 = FramePart.objects.create(frame=self.frame1, part=self.part5)
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
                                                     quantity=1, sell_price=19.99)
        self.quote1_part2 = QuotePart.objects.create(quote=self.quote1, partType=self.part2.partType, part=self.part2,
                                                     quantity=1, sell_price=9.99)
        self.quote1_part5 = QuotePart.objects.create(quote=self.quote1, partType=self.part5.partType, part=self.part5,
                                                     quantity=1, sell_price=29.99)
        self.quote1_part5a = QuotePart.objects.create(quote=self.quote1, partType=self.part5a.partType,
                                                      part=self.part5a,
                                                      quantity=2, sell_price=49.99)

        self.quote2 = Quote.objects.create(customer=self.customer, quote_desc='Desc 2',
                                           quote_type=BIKE, created_by=self.user1, frame=self.frame1)
        self.quote2_part1 = QuotePart.objects.create(quote=self.quote2, partType=self.part1.partType, part=self.part1,
                                                     quantity=1, sell_price=234.5)
        self.quote2_part2 = QuotePart.objects.create(quote=self.quote2, partType=self.part2.partType, part=self.part2,
                                                     quantity=1, sell_price=26.99, replacement_part=True,
                                                     trade_in_price=23.99)
        self.quote2_part3 = QuotePart.objects.create(quote=self.quote2, partType=self.part_type5, replacement_part=True,
                                                     quantity=None, trade_in_price=99.99)
        self.quote3 = Quote.objects.create(customer=self.customer, quote_desc='Test attributes', quote_type=PART,
                                           created_by=self.user2)
        self.quote3_part = QuotePart.objects.create(quote=self.quote3, partType=self.part_type2,
                                                    part=self.part_with_mandatory_attributes, quantity=1, sell_price=23)
        self.requestFactory = RequestFactory()
        self.request = self.requestFactory.get('/epic/quote')
        self.request.user = self.user2

    def test_quote_display_empty_parts(self):
        new_part_quote = Quote.objects.create(customer=self.customer, quote_desc='no parts 1',
                                              quote_type=PART, created_by=self.user1)
        self.assertEqual([], quote_display(new_part_quote, False))
        self.assertEqual([], quote_display(new_part_quote, True))

    def test_quote_display_empty_bike(self):
        new_bike_quote = Quote.objects.create(customer=self.customer, quote_desc='Desc 2',
                                              quote_type=BIKE, created_by=self.user1, frame=self.frame1)
        expected_display = frame_display(new_bike_quote.frame)
        self.assertEqual(expected_display, quote_display(new_bike_quote, False))
        self.assertEqual(expected_display, quote_display(new_bike_quote, True))

    def test_quote_display_parts(self):
        expected_list_length = QuotePart.objects.filter(quote=self.quote1).count()
        self.assertEqual(expected_list_length, len(quote_display(self.quote1, False)))
        self.assertEqual(expected_list_length, len(quote_display(self.quote1, True)))

    def test_quote_display_bike(self):
        expected_full_list = FramePart.objects.filter(frame=self.quote2.frame).count() + QuotePart.objects.filter(
            quote=self.quote2, replacement_part=False).count()
        self.assertEqual(expected_full_list, len(quote_display(self.quote2, False)))
        expected_customer_list = FramePart.objects.filter(frame=self.quote2.frame,
                                                          part__partType__customer_facing=True).count() + \
                                 QuotePart.objects.filter(quote=self.quote2, replacement_part=False).count() + \
                                 QuotePart.objects.filter(quote=self.quote2, replacement_part=True,
                                                          partType__customer_facing=False).count()

        self.assertEqual(expected_customer_list, len(quote_display(self.quote2, True)))
