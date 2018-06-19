from django.test import TestCase, RequestFactory

from epic.model_helpers.brand_helper import find_brand_for_string, find_brand_for_name
from epic.models import Brand


class AttributesTestCase(TestCase):

    def setUp(self):
        self.brand_one_word = Brand.objects.create(brand_name='Piglet')
        self.brand_multiple_word = Brand.objects.create(brand_name='Hen and Chicks')
        self.requestFactory = RequestFactory()

    def test_find_brand_for_string_missing_values(self):
        with self.assertRaises(TypeError):
            find_brand_for_string()
        with self.assertRaises(TypeError):
            find_brand_for_string('New part')
        with self.assertRaises(TypeError):
            find_brand_for_string('New part', [])
        with self.assertRaises(TypeError):
            find_brand_for_string('New part', [], self.brand_one_word)

    def test_find_brand_for_string_not_found(self):
        self.assertEqual(find_brand_for_string('XXXXxx part detail', [], None, None), None)

    def test_find_brand_for_string_not_in_list(self):
        self.assertEqual(find_brand_for_string('Piglet part detail', [], None, None), None)

    def test_find_brand_for_string_found_one_word(self):
        brand_list = Brand.objects.all()
        self.assertEqual(find_brand_for_string('Piglet part detail', brand_list, None, None), self.brand_one_word)
        self.assertEqual(find_brand_for_string('PIGLET part detail', brand_list, None, None), self.brand_one_word)
        self.assertEqual(find_brand_for_string('piglet part detail', brand_list, None, None), self.brand_one_word)

    def test_find_brand_for_string_found_multiple_words(self):
        brand_list = Brand.objects.all()
        self.assertEqual(find_brand_for_string('Hen and Chicks part detail', brand_list, None, None),
                         self.brand_multiple_word)
        self.assertEqual(find_brand_for_string('hen and Chicks part detail', brand_list, None, None),
                         self.brand_multiple_word)
        self.assertEqual(find_brand_for_string('HEN and chicks part detail', brand_list, None, None),
                         self.brand_multiple_word)
        self.assertEqual(
            find_brand_for_string('HEN and chicks part detail', [self.brand_multiple_word], self.brand_one_word, None),
            self.brand_multiple_word)

    def test_find_brand_for_string_use_default(self):
        self.assertEqual(find_brand_for_string('Hen and Cocks part detail', [], self.brand_one_word, None),
                         self.brand_one_word)
        self.assertEqual(
            find_brand_for_string('Hen and Cocks part detail', [self.brand_multiple_word], self.brand_one_word, None),
            self.brand_one_word)

    def test_find_brand_for_name_missing_values(self):
        with self.assertRaises(TypeError):
            find_brand_for_name()
        with self.assertRaises(TypeError):
            find_brand_for_name('New name')

    def test_find_brand_for_name_empty_values(self):
        with self.assertRaises(ValueError):
            find_brand_for_name('', self.requestFactory)

    def test_find_brand_for_name_found(self):
        self.assertEqual(find_brand_for_name('Hen and Chicks', self.requestFactory),
                         self.brand_multiple_word)
        self.assertEqual(find_brand_for_name('hen and Chicks', self.requestFactory),
                         self.brand_multiple_word)
        self.assertEqual(find_brand_for_name('HEN and chicks', self.requestFactory),
                         self.brand_multiple_word)
        self.assertEqual(
            find_brand_for_name('HEN and chicks', self.requestFactory),
            self.brand_multiple_word)

    def test_find_brand_for_name_new(self):
        new_brand_name = 'HEN & CHICK'
        self.assertEqual(find_brand_for_name(new_brand_name, self.requestFactory).brand_name,
                         new_brand_name)
