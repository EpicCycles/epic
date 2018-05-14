import unittest
from unittest.mock import MagicMock

import apostle

from epic.email_helpers.apostle_email import create_apostle_email


class TestApostleEmail(unittest.TestCase):
    def setUp(self):
        self.apostle = apostle
        self.apostle.Queue = MagicMock()

    def test_create_apostle_email_Missing(self):
        with self.assertRaises(TypeError):
            create_apostle_email()
        with self.assertRaises(TypeError):
            create_apostle_email('Template')
        with self.assertRaises(TypeError):
            create_apostle_email('Template', 'Recipient')

    def test_create_apostle_email_Empty(self):
        with self.assertRaises(ValueError):
            create_apostle_email('', 'Recipient', 'ab@cd.com')
        with self.assertRaises(ValueError):
            create_apostle_email('Template', '', 'ab@cd.com')
        with self.assertRaises(ValueError):
            create_apostle_email('Template', 'Recipient', '')

    def test_create_apostle_email_invalid(self):
        with self.assertRaises(ValueError):
            create_apostle_email('Template', 'Recipient', 'abcde.com')