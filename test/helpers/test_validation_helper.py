import unittest
from _decimal import Decimal

from epic.helpers.validation_helper import decimal_for_string, is_valid_email, is_valid_url


class TestValidationHelper(unittest.TestCase):

    def test_decimal_for_string(self):
        self.assertEqual(decimal_for_string('£1.00'), Decimal('1.00'))
        self.assertEqual(decimal_for_string('£0.99'), Decimal('0.99'))
        self.assertEqual(decimal_for_string('£x'), None)
        self.assertEqual(decimal_for_string('£0.99p'), None)
        self.assertEqual(decimal_for_string('£'), None)
        self.assertEqual(decimal_for_string(''), None)
        self.assertEqual(decimal_for_string('one'), None)
        self.assertEqual(decimal_for_string('1'), Decimal('1.00'))
        self.assertEqual(decimal_for_string('1.99'), Decimal('1.99'))
        self.assertEqual(decimal_for_string('1000.99'), Decimal('1000.99'))
        self.assertEqual(decimal_for_string('1,000.99'), None)

    def test_is_valid_url(self):
        self.assertEqual(is_valid_url('.com'), False)
        self.assertEqual(is_valid_url('http://www.epiccycles.com'), True)
        self.assertEqual(is_valid_url('https://www.epiccycles.com'), True)
        self.assertEqual(is_valid_url('www.epiccycles.com'), True)
        self.assertEqual(is_valid_url('epiccycles.com'), True)
        self.assertEqual(is_valid_url('http://www.epic-cycles.com'), True)
        self.assertEqual(is_valid_url('https://www.epic-cycles.com'), True)
        self.assertEqual(is_valid_url('www.epic-cycles.com'), True)
        self.assertEqual(is_valid_url('epic-cycles.com'), True)
        self.assertEqual(is_valid_url('epic-cycles.co.uk'), True)
        self.assertEqual(is_valid_url('www.epic_cycles.co.uk'), True)
