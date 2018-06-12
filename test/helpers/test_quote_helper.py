from decimal import Decimal
from unittest import mock

from django.contrib.auth.models import User
from django.test import TestCase, RequestFactory

from epic.helpers.quote_helper import quote_requote, quote_requote_reset_prices, quote_archive, copy_quote_with_changes
from epic.models import PartSection, PartType, PartTypeAttribute, AttributeOptions, Supplier, Brand, Part, Quote, \
    Customer, SELECT, ARCHIVED, INITIAL, TEXT, RADIO, NUMBER, PART, Frame, BIKE, QuotePart, ORDERED, Fitting


class QuoteHelperTestCase(TestCase):
    def setUp(self):
        self.part_section1 = PartSection.objects.create(name='Section1', placing=1)
        self.part_section2 = PartSection.objects.create(name='Section2', placing=2)
        self.part_type1 = PartType.objects.create(shortName='Wheels', description='Wheels description',
                                                  includeInSection=self.part_section1, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_facing=True)
        self.part_type2 = PartType.objects.create(shortName='Lights', description='Wheels description',
                                                  includeInSection=self.part_section1, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_facing=True)
        self.part_type_attribute1 = PartTypeAttribute.objects.create(partType=self.part_type1,
                                                                     attribute_name='attribute 1', placing=1,
                                                                     attribute_type=TEXT)
        self.part_type_attribute2 = PartTypeAttribute.objects.create(partType=self.part_type1,
                                                                     attribute_name='attribute 2', placing=2,
                                                                     attribute_type=RADIO, mandatory=False)
        self.part_type_attribute3 = PartTypeAttribute.objects.create(partType=self.part_type1,
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
        self.customer = Customer.objects.create(first_name='A', last_name='Customer')
        self.customer2 = Customer.objects.create(first_name='Anew', last_name='Shop-Customer')
        self.fitting = Fitting.objects.create(customer=self.customer, saddle_height='22', bar_height='23',
                                              reach='reach')
        self.user1 = User.objects.create_user(username='javed', email='javed@javed.com', password='my_secret')
        self.user2 = User.objects.create_user(username='Anna', email='Anna@javed.com', password='blah')
        self.frame1 = Frame.objects.create(brand=self.brand1, frame_name='Frame 1', model='Model 1',
                                           sell_price=Decimal('2345.99'))
        self.frame2 = Frame.objects.create(brand=self.brand2, frame_name='Frame 2', model='Model 2',
                                           sell_price=Decimal('3345.99'))

        self.quote1 = Quote.objects.create(customer=self.customer, quote_desc='Desc 1', keyed_sell_price=23,
                                           sell_price=234.56, frame_sell_price=0,
                                           quote_type=PART, quote_status=ARCHIVED, created_by=self.user1)
        self.quote1_part1 = QuotePart.objects.create(quote=self.quote1, partType=self.part_type1, part=self.part1,
                                                     quantity=1, sell_price=9.99)

        self.quote2 = Quote.objects.create(customer=self.customer, quote_desc='Desc 2', keyed_sell_price=23,
                                           quote_type=BIKE, quote_status=ORDERED, created_by=self.user1,
                                           frame=self.frame1, sell_price=23, frame_sell_price=Decimal('3456.78'),
                                           frame_size='53cm',
                                           fitting=self.fitting, colour='Red', colour_price=Decimal('23.00'))
        self.quote1_part1 = QuotePart.objects.create(quote=self.quote2, partType=self.part_type1, part=self.part1,
                                                     quantity=1, sell_price=234.5)
        self.quote1_part2 = QuotePart.objects.create(quote=self.quote2, partType=self.part_type1, part=self.part1,
                                                     quantity=1, sell_price=26.99, trade_in_price=23.99)
        self.quote1_part3 = QuotePart.objects.create(quote=self.quote2, partType=self.part_type2, part=self.part1,
                                                     quantity=None, trade_in_price=99.99)

        self.requestFactory = RequestFactory()
        self.request = self.requestFactory.get('/epic/quote')
        self.request.user = self.user2

    @mock.patch('epic.helpers.quote_helper.create_note_for_requote')
    @mock.patch('django.contrib.messages.info')
    def test_quote_requote(self, mock_info, mock_create_note_for_requote):
        quote_id = self.quote1.id
        old_quote_status = self.quote1.quote_status
        old_quote_created = self.quote1.created_date
        old_quote_created_by = self.quote1.created_by
        old_quote_updated = self.quote1.upd_date
        old_quote_keyed_sell_price = self.quote1.keyed_sell_price
        old_quote_frame_sell_price = self.quote1.frame_sell_price
        old_quote_sell_price = self.quote1.sell_price
        self.quote1.recalculate_prices()
        expected_quote_sell_price = self.quote1.sell_price

        old_quote_part_details = []

        for quote_part in QuotePart.objects.filter(quote=self.quote1):
            old_quote_part_details.append(
                [quote_part.id, quote_part.partType, quote_part.part, quote_part.quantity, quote_part.sell_price,
                 quote_part.trade_in_price, quote_part.replacement_part, quote_part.is_incomplete])

        quote_requote(self.request, self.quote1)
        self.assertTrue(mock_create_note_for_requote.called)
        self.assertTrue(mock_info.called)
        mock_info.assert_called_once_with(self.request, f'Quote status reset to initial - {str(self.quote1)}')
        mock_create_note_for_requote.assert_called_once_with(self.quote1, self.request.user)

        check_quote = Quote.objects.get(id=quote_id)
        self.assertEqual(check_quote.created_date, old_quote_created)
        self.assertEqual(check_quote.created_by, old_quote_created_by)
        self.assertNotEqual(check_quote.sell_price, old_quote_sell_price)
        self.assertEqual(check_quote.frame_sell_price, old_quote_frame_sell_price)
        self.assertEqual(check_quote.sell_price, expected_quote_sell_price)
        self.assertEqual(check_quote.keyed_sell_price, old_quote_keyed_sell_price)
        self.assertEqual(check_quote.quote_status, INITIAL)
        self.assertNotEqual(check_quote.upd_date, old_quote_updated)
        self.assertNotEqual(check_quote.quote_status, old_quote_status)

        for quote_part_details in old_quote_part_details:
            quote_part = QuotePart.objects.get(id=quote_part_details[0])
            self.assertEqual(quote_part_details[1], quote_part.partType)
            self.assertEqual(quote_part_details[2], quote_part.part)
            self.assertEqual(quote_part_details[3], quote_part.quantity)
            self.assertEqual(quote_part_details[4], quote_part.sell_price)
            self.assertEqual(quote_part_details[5], quote_part.trade_in_price)
            self.assertEqual(quote_part_details[6], quote_part.replacement_part)
            self.assertEqual(quote_part_details[7], quote_part.is_incomplete)

    @mock.patch('epic.helpers.quote_helper.create_note_for_requote')
    @mock.patch('django.contrib.messages.info')
    def test_quote_requote_reset_prices_parts(self, mock_info, mock_create_note_for_requote):
        quote_id = self.quote1.id
        old_quote_status = self.quote1.quote_status
        old_quote_created = self.quote1.created_date
        old_quote_created_by = self.quote1.created_by
        old_quote_keyed_sell_price = self.quote1.keyed_sell_price
        old_quote_frame_sell_price = self.quote1.frame_sell_price
        old_quote_sell_price = self.quote1.sell_price
        old_quote_updated = self.quote1.upd_date

        old_quote_part_details = []

        for quote_part in QuotePart.objects.filter(quote=self.quote1):
            old_quote_part_details.append(
                [quote_part.id, quote_part.partType, quote_part.part, quote_part.quantity, quote_part.sell_price,
                 quote_part.trade_in_price, quote_part.replacement_part, quote_part.is_incomplete])

        quote_requote_reset_prices(self.request, self.quote1)
        self.assertTrue(mock_create_note_for_requote.called)
        self.assertTrue(mock_info.called)
        mock_info.assert_called_once_with(self.request,
                                          f'Quote status reset to initial and all prices reset - {str(self.quote1)}')
        mock_create_note_for_requote.assert_called_once_with(self.quote1, self.request.user)

        check_quote = Quote.objects.get(id=quote_id)
        check_quote.recalculate_prices()
        expected_quote_sell_price = check_quote.sell_price

        check_quote = Quote.objects.get(id=quote_id)
        self.assertEqual(check_quote.created_date, old_quote_created)
        self.assertEqual(check_quote.created_by, old_quote_created_by)
        self.assertEqual(check_quote.quote_status, INITIAL)
        self.assertEqual(check_quote.sell_price, expected_quote_sell_price)
        self.assertEqual(check_quote.sell_price, old_quote_sell_price)
        self.assertEqual(check_quote.frame_sell_price, None)
        self.assertNotEqual(check_quote.frame_sell_price, old_quote_frame_sell_price)
        self.assertEqual(check_quote.keyed_sell_price, None)
        self.assertNotEqual(check_quote.keyed_sell_price, old_quote_keyed_sell_price)
        self.assertNotEqual(check_quote.upd_date, old_quote_updated)
        self.assertNotEqual(check_quote.quote_status, old_quote_status)

        for quote_part_details in old_quote_part_details:
            quote_part = QuotePart.objects.get(id=quote_part_details[0])
            self.assertEqual(quote_part_details[1], quote_part.partType)
            self.assertEqual(quote_part_details[2], quote_part.part)
            self.assertEqual(quote_part_details[3], quote_part.quantity)
            self.assertEqual(None, quote_part.sell_price)
            self.assertEqual(None, quote_part.trade_in_price)
            if quote_part_details[4]:
                self.assertNotEqual(quote_part_details[4], quote_part.sell_price)
            if quote_part_details[5]:
                self.assertNotEqual(quote_part_details[5], quote_part.trade_in_price)
            self.assertEqual(quote_part_details[6], quote_part.replacement_part)
            self.assertEqual(True, quote_part.is_incomplete)
            if not quote_part_details[7]:
                self.assertNotEqual(quote_part_details[7], quote_part.is_incomplete)

    @mock.patch('epic.helpers.quote_helper.create_note_for_requote')
    @mock.patch('django.contrib.messages.info')
    def test_quote_requote_reset_prices_bike(self, mock_info, mock_create_note_for_requote):
        quote_id = self.quote2.id
        old_quote_status = self.quote2.quote_status
        old_quote_created = self.quote2.created_date
        old_quote_created_by = self.quote2.created_by
        old_quote_keyed_sell_price = self.quote2.keyed_sell_price
        old_quote_frame_sell_price = self.quote2.frame_sell_price
        old_quote_sell_price = self.quote2.sell_price
        old_quote_updated = self.quote2.upd_date

        old_quote_part_details = []

        for quote_part in QuotePart.objects.filter(quote=self.quote2):
            old_quote_part_details.append(
                [quote_part.id, quote_part.partType, quote_part.part, quote_part.quantity, quote_part.sell_price,
                 quote_part.trade_in_price, quote_part.replacement_part, quote_part.is_incomplete])

        quote_requote_reset_prices(self.request, self.quote2)
        self.assertTrue(mock_create_note_for_requote.called)
        self.assertTrue(mock_info.called)
        mock_info.assert_called_once_with(self.request,
                                          f'Quote status reset to initial and all prices reset - {str(self.quote2)}')
        mock_create_note_for_requote.assert_called_once_with(self.quote2, self.request.user)

        check_quote = Quote.objects.get(id=quote_id)
        check_quote.recalculate_prices()
        expected_quote_sell_price = check_quote.sell_price

        check_quote = Quote.objects.get(id=quote_id)
        self.assertEqual(check_quote.created_date, old_quote_created)
        self.assertEqual(check_quote.created_by, old_quote_created_by)
        self.assertEqual(check_quote.quote_status, INITIAL)
        self.assertEqual(check_quote.sell_price, expected_quote_sell_price)
        self.assertNotEqual(check_quote.sell_price, old_quote_sell_price)
        self.assertEqual(check_quote.frame_sell_price, self.quote2.frame.sell_price)
        self.assertNotEqual(check_quote.frame_sell_price, old_quote_frame_sell_price)
        self.assertEqual(check_quote.keyed_sell_price, None)
        self.assertNotEqual(check_quote.keyed_sell_price, old_quote_keyed_sell_price)
        self.assertNotEqual(check_quote.upd_date, old_quote_updated)
        self.assertNotEqual(check_quote.quote_status, old_quote_status)

        for quote_part_details in old_quote_part_details:
            quote_part = QuotePart.objects.get(id=quote_part_details[0])
            self.assertEqual(quote_part_details[1], quote_part.partType)
            self.assertEqual(quote_part_details[2], quote_part.part)
            self.assertEqual(quote_part_details[3], quote_part.quantity)
            self.assertEqual(None, quote_part.sell_price)
            self.assertEqual(None, quote_part.trade_in_price)
            if quote_part_details[4]:
                self.assertNotEqual(quote_part_details[4], quote_part.sell_price)
            if quote_part_details[5]:
                self.assertNotEqual(quote_part_details[5], quote_part.trade_in_price)
            self.assertEqual(quote_part_details[6], quote_part.replacement_part)
            self.assertEqual(True, quote_part.is_incomplete)
            if not quote_part_details[7]:
                self.assertNotEqual(quote_part_details[7], quote_part.is_incomplete)

    @mock.patch('epic.helpers.quote_helper.create_note_for_quote_archive')
    @mock.patch('django.contrib.messages.info')
    def test_quote_archive_no(self, mock_info, mock_create_note_for_archive):
        quote_id = self.quote1.id
        old_quote_status = self.quote1.quote_status
        old_quote_created = self.quote1.created_date
        old_quote_created_by = self.quote1.created_by
        old_quote_updated = self.quote1.upd_date
        old_quote_keyed_sell_price = self.quote1.keyed_sell_price
        old_quote_frame_sell_price = self.quote1.frame_sell_price
        old_quote_sell_price = self.quote1.sell_price
        old_quote_part_details = []

        for quote_part in QuotePart.objects.filter(quote=self.quote1):
            old_quote_part_details.append(
                [quote_part.id, quote_part.partType, quote_part.part, quote_part.quantity, quote_part.sell_price,
                 quote_part.trade_in_price, quote_part.replacement_part, quote_part.is_incomplete])

        quote_archive(self.request, self.quote1)
        self.assertFalse(mock_create_note_for_archive.called)
        self.assertFalse(mock_info.called)

        check_quote = Quote.objects.get(id=quote_id)
        self.assertEqual(check_quote.created_date, old_quote_created)
        self.assertEqual(check_quote.created_by, old_quote_created_by)
        self.assertEqual(check_quote.sell_price, old_quote_sell_price)
        self.assertEqual(check_quote.frame_sell_price, old_quote_frame_sell_price)
        self.assertEqual(check_quote.keyed_sell_price, old_quote_keyed_sell_price)
        self.assertEqual(check_quote.quote_status, ARCHIVED)
        self.assertEqual(check_quote.upd_date, old_quote_updated)
        self.assertEqual(check_quote.quote_status, old_quote_status)

        for quote_part_details in old_quote_part_details:
            quote_part = QuotePart.objects.get(id=quote_part_details[0])
            self.assertEqual(quote_part_details[1], quote_part.partType)
            self.assertEqual(quote_part_details[2], quote_part.part)
            self.assertEqual(quote_part_details[3], quote_part.quantity)
            self.assertEqual(quote_part_details[4], quote_part.sell_price)
            self.assertEqual(quote_part_details[5], quote_part.trade_in_price)
            self.assertEqual(quote_part_details[6], quote_part.replacement_part)
            self.assertEqual(quote_part_details[7], quote_part.is_incomplete)

    @mock.patch('epic.helpers.quote_helper.create_note_for_quote_archive')
    @mock.patch('django.contrib.messages.info')
    def test_quote_archive_yes(self, mock_info, mock_create_note_for_archive):
        quote_id = self.quote2.id
        old_quote_status = self.quote2.quote_status
        old_quote_created = self.quote2.created_date
        old_quote_created_by = self.quote2.created_by
        old_quote_updated = self.quote2.upd_date
        old_quote_keyed_sell_price = self.quote2.keyed_sell_price
        old_quote_frame_sell_price = self.quote2.frame_sell_price
        old_quote_sell_price = self.quote2.sell_price
        self.quote2.recalculate_prices()
        expected_quote_sell_price = self.quote2.sell_price

        old_quote_part_details = []

        for quote_part in QuotePart.objects.filter(quote=self.quote2):
            old_quote_part_details.append(
                [quote_part.id, quote_part.partType, quote_part.part, quote_part.quantity, quote_part.sell_price,
                 quote_part.trade_in_price, quote_part.replacement_part, quote_part.is_incomplete])

        quote_archive(self.request, self.quote2)
        self.assertTrue(mock_create_note_for_archive.called)
        self.assertTrue(mock_info.called)
        mock_info.assert_called_once_with(self.request, f'Quote archived - {str(self.quote2)}')
        mock_create_note_for_archive.assert_called_once_with(self.quote2, self.request.user)

        check_quote = Quote.objects.get(id=quote_id)
        self.assertEqual(check_quote.created_date, old_quote_created)
        self.assertEqual(check_quote.created_by, old_quote_created_by)
        self.assertNotEqual(check_quote.sell_price, old_quote_sell_price)
        self.assertEqual(check_quote.frame_sell_price, old_quote_frame_sell_price)
        self.assertEqual(check_quote.sell_price, expected_quote_sell_price)
        self.assertEqual(check_quote.keyed_sell_price, old_quote_keyed_sell_price)
        self.assertEqual(check_quote.quote_status, ARCHIVED)
        self.assertNotEqual(check_quote.upd_date, old_quote_updated)
        self.assertNotEqual(check_quote.quote_status, old_quote_status)

        for quote_part_details in old_quote_part_details:
            quote_part = QuotePart.objects.get(id=quote_part_details[0])
            self.assertEqual(quote_part_details[1], quote_part.partType)
            self.assertEqual(quote_part_details[2], quote_part.part)
            self.assertEqual(quote_part_details[3], quote_part.quantity)
            self.assertEqual(quote_part_details[4], quote_part.sell_price)
            self.assertEqual(quote_part_details[5], quote_part.trade_in_price)
            self.assertEqual(quote_part_details[6], quote_part.replacement_part)
            self.assertEqual(quote_part_details[7], quote_part.is_incomplete)

    def test_quote_copy_errors(self):
        with self.assertRaises(TypeError):
            copy_quote_with_changes(self.quote2, self.request, self.fitting, None)
        with self.assertRaises(TypeError):
            copy_quote_with_changes(self.quote2, self.request, None, self.fitting)
        with self.assertRaises(ValueError):
            copy_quote_with_changes(self.quote1, self.request, self.frame2, None)

    def test_quote_copy_no_changes_parts(self):
        # save old details
        old_quote_id = self.quote1.id
        old_quote_type = self.quote1.quote_type
        old_quote_status = self.quote1.quote_status
        old_quote_version = self.quote1.version
        old_quote_customer = self.quote1.customer
        old_quote_frame = self.quote1.frame
        old_quote_frame_size = self.quote1.frame_size
        old_quote_colour = self.quote1.colour
        old_quote_colour_price = self.quote1.colour_price
        old_quote_fitting = self.quote1.fitting
        old_quote_description = self.quote1.quote_desc
        old_quote_created = self.quote1.created_date
        old_quote_created_by = self.quote1.created_by
        old_quote_updated = self.quote1.upd_date
        old_quote_keyed_sell_price = self.quote1.keyed_sell_price
        old_quote_frame_sell_price = self.quote1.frame_sell_price
        old_quote_sell_price = self.quote1.sell_price
        old_quote_part_details = []

        for quote_part in QuotePart.objects.filter(quote=self.quote1):
            old_quote_part_details.append(
                [quote_part.id, quote_part.partType, quote_part.part, quote_part.quantity, quote_part.sell_price,
                 quote_part.trade_in_price, quote_part.replacement_part, quote_part.is_incomplete])

        new_quote = copy_quote_with_changes(self.quote1, self.request, None, None)
        expected_new_quote_version = old_quote_version + 1
        self.assertNotEqual(new_quote.id, old_quote_id)
        self.assertNotEqual(new_quote.created_date, old_quote_created)
        self.assertNotEqual(new_quote.version, old_quote_version)
        self.assertEqual(new_quote.version, expected_new_quote_version)
        self.assertNotEqual(new_quote.created_by, old_quote_created_by)
        self.assertEqual(new_quote.quote_type, old_quote_type)
        self.assertEqual(new_quote.customer, old_quote_customer)
        self.assertEqual(new_quote.frame, old_quote_frame)
        self.assertEqual(new_quote.frame_size, old_quote_frame_size)
        self.assertEqual(new_quote.colour, old_quote_colour)
        self.assertEqual(new_quote.colour_price, old_quote_colour_price)
        self.assertEqual(new_quote.fitting, old_quote_fitting)
        self.assertEqual(new_quote.quote_desc, old_quote_description)
        self.assertEqual(new_quote.sell_price, old_quote_sell_price)
        self.assertEqual(new_quote.frame_sell_price, old_quote_frame_sell_price)
        self.assertEqual(new_quote.keyed_sell_price, old_quote_keyed_sell_price)
        self.assertEqual(new_quote.quote_status, INITIAL)
        self.assertNotEqual(new_quote.upd_date, old_quote_updated)
        self.assertNotEqual(new_quote.quote_status, old_quote_status)

        for quote_part_details in old_quote_part_details:
            new_quote_part_exists = QuotePart.objects.filter(quote=new_quote, partType=quote_part_details[1],
                                                             part=quote_part_details[2], quantity=quote_part_details[3],
                                                             sell_price=quote_part_details[4],
                                                             trade_in_price=quote_part_details[5],
                                                             replacement_part=quote_part_details[6],
                                                             is_incomplete=quote_part_details[7]).exists()
            self.assertTrue(new_quote_part_exists)

    def test_quote_copy_new_cust_parts(self):
        # save old details
        old_quote_id = self.quote1.id
        old_quote_type = self.quote1.quote_type
        old_quote_status = self.quote1.quote_status
        old_quote_version = self.quote1.version
        old_quote_customer = self.quote1.customer
        old_quote_frame = self.quote1.frame
        old_quote_frame_size = self.quote1.frame_size
        old_quote_colour = self.quote1.colour
        old_quote_colour_price = self.quote1.colour_price
        old_quote_fitting = self.quote1.fitting
        old_quote_description = self.quote1.quote_desc
        old_quote_created = self.quote1.created_date
        old_quote_created_by = self.quote1.created_by
        old_quote_updated = self.quote1.upd_date
        old_quote_keyed_sell_price = self.quote1.keyed_sell_price
        old_quote_frame_sell_price = self.quote1.frame_sell_price
        old_quote_sell_price = self.quote1.sell_price
        old_quote_part_details = []

        for quote_part in QuotePart.objects.filter(quote=self.quote1):
            old_quote_part_details.append(
                [quote_part.id, quote_part.partType, quote_part.part, quote_part.quantity, quote_part.sell_price,
                 quote_part.trade_in_price, quote_part.replacement_part, quote_part.is_incomplete])

        new_quote = copy_quote_with_changes(self.quote1, self.request, None, self.customer2)
        expected_new_quote_version = 1
        self.assertNotEqual(new_quote.id, old_quote_id)
        self.assertNotEqual(new_quote.created_date, old_quote_created)
        # self.assertNotEqual(new_quote.version, old_quote_version)
        self.assertEqual(new_quote.version, expected_new_quote_version)
        self.assertNotEqual(new_quote.created_by, old_quote_created_by)
        self.assertEqual(new_quote.created_by, self.request.user)
        self.assertEqual(new_quote.quote_type, old_quote_type)
        self.assertNotEqual(new_quote.customer, old_quote_customer)
        self.assertEqual(new_quote.customer, self.customer2)
        self.assertEqual(new_quote.frame, old_quote_frame)
        self.assertEqual(new_quote.frame_size, old_quote_frame_size)
        self.assertEqual(new_quote.colour, old_quote_colour)
        self.assertEqual(new_quote.colour_price, old_quote_colour_price)
        self.assertEqual(new_quote.fitting, old_quote_fitting)
        self.assertEqual(new_quote.quote_desc, old_quote_description)
        self.assertEqual(new_quote.sell_price, old_quote_sell_price)
        self.assertEqual(new_quote.frame_sell_price, old_quote_frame_sell_price)
        self.assertEqual(new_quote.keyed_sell_price, old_quote_keyed_sell_price)
        self.assertEqual(new_quote.quote_status, INITIAL)
        self.assertNotEqual(new_quote.upd_date, old_quote_updated)
        self.assertNotEqual(new_quote.quote_status, old_quote_status)

        for quote_part_details in old_quote_part_details:
            new_quote_part_exists = QuotePart.objects.filter(quote=new_quote, partType=quote_part_details[1],
                                                             part=quote_part_details[2], quantity=quote_part_details[3],
                                                             sell_price=quote_part_details[4],
                                                             trade_in_price=quote_part_details[5],
                                                             replacement_part=quote_part_details[6],
                                                             is_incomplete=quote_part_details[7]).exists()
            self.assertTrue(new_quote_part_exists)

    def test_quote_copy_no_changes_frame(self):
        # save old details
        old_quote_id = self.quote2.id
        old_quote_type = self.quote2.quote_type
        old_quote_status = self.quote2.quote_status
        old_quote_version = self.quote2.version
        old_quote_customer = self.quote2.customer
        old_quote_frame = self.quote2.frame
        old_quote_frame_size = self.quote2.frame_size
        old_quote_colour = self.quote2.colour
        old_quote_colour_price = self.quote2.colour_price
        old_quote_fitting = self.quote2.fitting
        old_quote_description = self.quote2.quote_desc
        old_quote_created = self.quote2.created_date
        old_quote_created_by = self.quote2.created_by
        old_quote_updated = self.quote2.upd_date
        old_quote_keyed_sell_price = self.quote2.keyed_sell_price
        old_quote_frame_sell_price = self.quote2.frame_sell_price
        old_quote_sell_price = self.quote2.sell_price
        old_quote_part_details = []

        for quote_part in QuotePart.objects.filter(quote=self.quote2):
            old_quote_part_details.append(
                [quote_part.id, quote_part.partType, quote_part.part, quote_part.quantity, quote_part.sell_price,
                 quote_part.trade_in_price, quote_part.replacement_part, quote_part.is_incomplete])

        new_quote = copy_quote_with_changes(self.quote2, self.request, None, None)
        expected_new_quote_version = old_quote_version + 1
        self.assertNotEqual(new_quote.id, old_quote_id)
        self.assertNotEqual(new_quote.created_date, old_quote_created)
        self.assertNotEqual(new_quote.version, old_quote_version)
        self.assertEqual(new_quote.version, expected_new_quote_version)
        self.assertNotEqual(new_quote.created_by, old_quote_created_by)
        self.assertEqual(new_quote.quote_type, old_quote_type)
        self.assertEqual(new_quote.customer, old_quote_customer)
        self.assertEqual(new_quote.frame, old_quote_frame)
        self.assertEqual(new_quote.frame_size, old_quote_frame_size)
        self.assertEqual(new_quote.colour, old_quote_colour)
        self.assertEqual(new_quote.colour_price, old_quote_colour_price)
        self.assertEqual(new_quote.fitting, old_quote_fitting)
        self.assertEqual(new_quote.quote_desc, old_quote_description)
        self.assertEqual(new_quote.sell_price, old_quote_sell_price)
        self.assertEqual(new_quote.frame_sell_price, old_quote_frame_sell_price)
        self.assertEqual(new_quote.keyed_sell_price, old_quote_keyed_sell_price)
        self.assertEqual(new_quote.quote_status, INITIAL)
        self.assertNotEqual(new_quote.upd_date, old_quote_updated)
        self.assertNotEqual(new_quote.quote_status, old_quote_status)

        for quote_part_details in old_quote_part_details:
            new_quote_part_exists = QuotePart.objects.filter(quote=new_quote, partType=quote_part_details[1],
                                                             part=quote_part_details[2], quantity=quote_part_details[3],
                                                             sell_price=quote_part_details[4],
                                                             trade_in_price=quote_part_details[5],
                                                             replacement_part=quote_part_details[6]).exists()
            self.assertTrue(new_quote_part_exists)

    def test_quote_copy_change_frame_frame(self):
        # save old details
        old_quote_id = self.quote2.id
        old_quote_type = self.quote2.quote_type
        old_quote_status = self.quote2.quote_status
        old_quote_version = self.quote2.version
        old_quote_customer = self.quote2.customer
        old_quote_frame = self.quote2.frame
        old_quote_frame_size = self.quote2.frame_size
        old_quote_colour = self.quote2.colour
        old_quote_colour_price = self.quote2.colour_price
        old_quote_fitting = self.quote2.fitting
        old_quote_description = self.quote2.quote_desc
        old_quote_created = self.quote2.created_date
        old_quote_created_by = self.quote2.created_by
        old_quote_updated = self.quote2.upd_date
        old_quote_keyed_sell_price = self.quote2.keyed_sell_price
        old_quote_frame_sell_price = self.quote2.frame_sell_price
        old_quote_sell_price = self.quote2.sell_price
        old_quote_part_details = []

        for quote_part in QuotePart.objects.filter(quote=self.quote2):
            old_quote_part_details.append(
                [quote_part.id, quote_part.partType, quote_part.part, quote_part.quantity, quote_part.sell_price,
                 quote_part.trade_in_price, quote_part.replacement_part, quote_part.is_incomplete])

        new_quote = copy_quote_with_changes(self.quote2, self.request, self.frame2, None)
        expected_new_quote_version = old_quote_version + 1
        self.assertNotEqual(new_quote.id, old_quote_id)
        self.assertNotEqual(new_quote.created_date, old_quote_created)
        self.assertNotEqual(new_quote.version, old_quote_version)
        self.assertEqual(new_quote.version, expected_new_quote_version)
        self.assertNotEqual(new_quote.created_by, old_quote_created_by)
        self.assertEqual(new_quote.created_by, self.request.user)
        self.assertEqual(new_quote.quote_type, old_quote_type)
        self.assertEqual(new_quote.customer, old_quote_customer)
        self.assertNotEqual(new_quote.frame, old_quote_frame)
        self.assertEqual(new_quote.frame, self.frame2)
        self.assertNotEqual(new_quote.frame_size, old_quote_frame_size)
        self.assertEqual(new_quote.frame_size, None)
        self.assertNotEqual(new_quote.colour, old_quote_colour)
        self.assertEqual(new_quote.colour, None)
        self.assertNotEqual(new_quote.colour_price, old_quote_colour_price)
        self.assertEqual(new_quote.colour_price, None)
        self.assertEqual(new_quote.fitting, old_quote_fitting)
        self.assertEqual(new_quote.quote_desc, old_quote_description)
        self.assertNotEqual(new_quote.sell_price, old_quote_sell_price)
        self.assertNotEqual(new_quote.frame_sell_price, old_quote_frame_sell_price)
        self.assertEqual(new_quote.frame_sell_price, self.frame2.sell_price)
        self.assertNotEqual(new_quote.keyed_sell_price, old_quote_keyed_sell_price)
        self.assertEqual(new_quote.keyed_sell_price, None)
        self.assertEqual(new_quote.quote_status, INITIAL)
        self.assertNotEqual(new_quote.upd_date, old_quote_updated)
        self.assertNotEqual(new_quote.quote_status, old_quote_status)

        for quote_part_details in old_quote_part_details:
            new_quote_part_exists = QuotePart.objects.filter(quote=new_quote, partType=quote_part_details[1],
                                                             part=quote_part_details[2], quantity=quote_part_details[3],
                                                             sell_price=quote_part_details[4],
                                                             trade_in_price=quote_part_details[5],
                                                             replacement_part=quote_part_details[6]).exists()
            self.assertTrue(new_quote_part_exists)

    def test_quote_copy_change_cust_frame(self):
        # save old details
        old_quote_id = self.quote2.id
        old_quote_type = self.quote2.quote_type
        old_quote_status = self.quote2.quote_status
        old_quote_version = self.quote2.version
        old_quote_customer = self.quote2.customer
        old_quote_frame = self.quote2.frame
        old_quote_frame_size = self.quote2.frame_size
        old_quote_colour = self.quote2.colour
        old_quote_colour_price = self.quote2.colour_price
        old_quote_fitting = self.quote2.fitting
        old_quote_description = self.quote2.quote_desc
        old_quote_created = self.quote2.created_date
        old_quote_created_by = self.quote2.created_by
        old_quote_updated = self.quote2.upd_date
        old_quote_keyed_sell_price = self.quote2.keyed_sell_price
        old_quote_frame_sell_price = self.quote2.frame_sell_price
        old_quote_sell_price = self.quote2.sell_price
        old_quote_part_details = []

        for quote_part in QuotePart.objects.filter(quote=self.quote2):
            old_quote_part_details.append(
                [quote_part.id, quote_part.partType, quote_part.part, quote_part.quantity, quote_part.sell_price,
                 quote_part.trade_in_price, quote_part.replacement_part, quote_part.is_incomplete])

        new_quote = copy_quote_with_changes(self.quote2, self.request, None, self.customer2)
        expected_new_quote_version = 1
        self.assertNotEqual(new_quote.id, old_quote_id)
        self.assertNotEqual(new_quote.created_date, old_quote_created)
        self.assertEqual(new_quote.version, expected_new_quote_version)
        self.assertNotEqual(new_quote.created_by, old_quote_created_by)
        self.assertEqual(new_quote.quote_type, old_quote_type)
        self.assertNotEqual(new_quote.customer, old_quote_customer)
        self.assertEqual(new_quote.customer, self.customer2)
        self.assertEqual(new_quote.frame, old_quote_frame)
        self.assertEqual(new_quote.frame_size, old_quote_frame_size)
        self.assertEqual(new_quote.colour, old_quote_colour)
        self.assertEqual(new_quote.colour_price, old_quote_colour_price)
        self.assertNotEqual(new_quote.fitting, old_quote_fitting)
        self.assertEqual(new_quote.fitting, None)
        self.assertEqual(new_quote.quote_desc, old_quote_description)
        self.assertEqual(new_quote.sell_price, old_quote_sell_price)
        self.assertEqual(new_quote.frame_sell_price, old_quote_frame_sell_price)
        self.assertEqual(new_quote.keyed_sell_price, old_quote_keyed_sell_price)
        self.assertEqual(new_quote.quote_status, INITIAL)
        self.assertNotEqual(new_quote.upd_date, old_quote_updated)
        self.assertNotEqual(new_quote.quote_status, old_quote_status)

        for quote_part_details in old_quote_part_details:
            new_quote_part_exists = QuotePart.objects.filter(quote=new_quote, partType=quote_part_details[1],
                                                             part=quote_part_details[2], quantity=quote_part_details[3],
                                                             sell_price=quote_part_details[4],
                                                             trade_in_price=quote_part_details[5],
                                                             replacement_part=quote_part_details[6]).exists()
            self.assertTrue(new_quote_part_exists)

    def test_quote_copy_change_both_frame(self):
        # save old details
        old_quote_id = self.quote2.id
        old_quote_type = self.quote2.quote_type
        old_quote_status = self.quote2.quote_status
        old_quote_version = self.quote2.version
        old_quote_customer = self.quote2.customer
        old_quote_frame = self.quote2.frame
        old_quote_frame_size = self.quote2.frame_size
        old_quote_colour = self.quote2.colour
        old_quote_colour_price = self.quote2.colour_price
        old_quote_fitting = self.quote2.fitting
        old_quote_description = self.quote2.quote_desc
        old_quote_created = self.quote2.created_date
        old_quote_created_by = self.quote2.created_by
        old_quote_updated = self.quote2.upd_date
        old_quote_keyed_sell_price = self.quote2.keyed_sell_price
        old_quote_frame_sell_price = self.quote2.frame_sell_price
        old_quote_sell_price = self.quote2.sell_price
        old_quote_part_details = []

        for quote_part in QuotePart.objects.filter(quote=self.quote2):
            old_quote_part_details.append(
                [quote_part.id, quote_part.partType, quote_part.part, quote_part.quantity, quote_part.sell_price,
                 quote_part.trade_in_price, quote_part.replacement_part, quote_part.is_incomplete])

        new_quote = copy_quote_with_changes(self.quote2, self.request, self.frame2, self.customer2)
        expected_new_quote_version = 1
        self.assertNotEqual(new_quote.id, old_quote_id)
        self.assertNotEqual(new_quote.created_date, old_quote_created)
        # self.assertNotEqual(new_quote.version, old_quote_version)
        self.assertEqual(new_quote.version, expected_new_quote_version)
        self.assertNotEqual(new_quote.created_by, old_quote_created_by)
        self.assertEqual(new_quote.created_by, self.request.user)
        self.assertEqual(new_quote.quote_type, old_quote_type)
        self.assertNotEqual(new_quote.customer, old_quote_customer)
        self.assertEqual(new_quote.customer, self.customer2)
        self.assertNotEqual(new_quote.frame, old_quote_frame)
        self.assertEqual(new_quote.frame, self.frame2)
        self.assertNotEqual(new_quote.frame_size, old_quote_frame_size)
        self.assertEqual(new_quote.frame_size, None)
        self.assertNotEqual(new_quote.colour, old_quote_colour)
        self.assertEqual(new_quote.colour, None)
        self.assertNotEqual(new_quote.colour_price, old_quote_colour_price)
        self.assertEqual(new_quote.colour_price, None)
        self.assertNotEqual(new_quote.fitting, old_quote_fitting)
        self.assertEqual(new_quote.fitting, None)
        self.assertEqual(new_quote.quote_desc, old_quote_description)
        self.assertNotEqual(new_quote.sell_price, old_quote_sell_price)
        self.assertNotEqual(new_quote.frame_sell_price, old_quote_frame_sell_price)
        self.assertEqual(new_quote.frame_sell_price, self.frame2.sell_price)
        self.assertNotEqual(new_quote.keyed_sell_price, old_quote_keyed_sell_price)
        self.assertEqual(new_quote.keyed_sell_price, None)
        self.assertEqual(new_quote.quote_status, INITIAL)
        self.assertNotEqual(new_quote.upd_date, old_quote_updated)
        self.assertNotEqual(new_quote.quote_status, old_quote_status)

        for quote_part_details in old_quote_part_details:
            new_quote_part_exists = QuotePart.objects.filter(quote=new_quote, partType=quote_part_details[1],
                                                             part=quote_part_details[2], quantity=quote_part_details[3],
                                                             sell_price=quote_part_details[4],
                                                             trade_in_price=quote_part_details[5],
                                                             replacement_part=quote_part_details[6]).exists()
            self.assertTrue(new_quote_part_exists)
