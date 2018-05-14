import unittest
from unittest import mock
from unittest.mock import MagicMock, call

import apostle

from epic.email_helpers.apostle_email import create_apostle_email, send_apostle_email


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

    # @patch('epic.email_helpers.apostle_email.apostle.Queue.add')
    # @patch('epic.email_helpers.apostle_email.apostle.Queue.deliver')
    @mock.patch('epic.email_helpers.apostle_email.apostle.Queue')
    def test_send_apostle_email(self, mock_queue):
        apostle_mail = 'dummy object'
        # check set up ok
        # assert apostle.Queue().add is mock_add
        # assert apostle.Queue().deliver is mock_deliver

        # test call
        send_apostle_email(apostle_mail)

        # Assert that lower_1 was called before lower_2
        calls = [call(), call().add('dummy object'), call().deliver()]

        mock_queue.assert_has_calls(calls)
