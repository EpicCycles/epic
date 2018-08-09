from django.test import TestCase, RequestFactory

from epic.model_helpers.brand_helper import find_brand_for_string, find_brand_for_name
from epic.models import Brand, Part, PartSection, PartType


class AttributesTestCase(TestCase):

    def setUp(self):
        self.brand_default = Brand.objects.create(brand_name='Default')
        self.brand_one_word = Brand.objects.create(brand_name='Piglet')
        self.brand_starts_same = Brand.objects.create(brand_name='Piglet bland')
        self.brand_multiple_word = Brand.objects.create(brand_name='Hen and Chicks')
        self.part_section1 = PartSection.objects.create(name='Section1', placing=1)
        self.part_type1 = PartType.objects.create(shortName='Wheels', description='Wheels description',
                                                  includeInSection=self.part_section1, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_facing=True)

        self.part_single = Part.objects.create(brand=self.brand_multiple_word, partType=self.part_type1,
                                               part_name='Find Me 1')
        self.part_double1 = Part.objects.create(brand=self.brand_starts_same, partType=self.part_type1,
                                                part_name='Find Me 2')
        self.part_double2 = Part.objects.create(brand=self.brand_multiple_word, partType=self.part_type1,
                                                part_name='Find Me 2')
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

    def test_find_brand_for_string_found_starts_same(self):
        brand_list = Brand.objects.all()
        self.assertEqual(find_brand_for_string('Piglet bland detail', brand_list, None, None), self.brand_starts_same)
        self.assertEqual(find_brand_for_string('PIGLET Bland detail', brand_list, None, None), self.brand_starts_same)
        self.assertEqual(find_brand_for_string('piglet BLAND detail', brand_list, None, None), self.brand_starts_same)

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

    def test_find_brand_for_string_match_name_found(self):
        part_name_string = self.part_single.part_name
        brand_list = Brand.objects.all()
        self.assertEqual(find_brand_for_string(part_name_string, brand_list, self.brand_default, None), self.part_single.brand)
        self.assertEqual(find_brand_for_string(part_name_string.upper(), brand_list, self.brand_default, None), self.part_single.brand)
        self.assertEqual(find_brand_for_string(part_name_string.lower(), brand_list, self.brand_default, None), self.part_single.brand)

    def test_find_brand_for_string_match_name_not_found(self):
        part_name_string = 'DO not find me please'
        brand_list = Brand.objects.all()
        self.assertEqual(find_brand_for_string(part_name_string, brand_list, self.brand_default, None), self.brand_default)
        self.assertEqual(find_brand_for_string(part_name_string.upper(), brand_list, self.brand_default, None), self.brand_default)
        self.assertEqual(find_brand_for_string(part_name_string.lower(), brand_list, self.brand_default, None), self.brand_default)

    def test_find_brand_for_string_match_name_multiple_found(self):
        part_name_string = self.part_double1.part_name
        brand_list = Brand.objects.all()
        self.assertEqual(find_brand_for_string(part_name_string, brand_list, self.brand_default, None), self.brand_default)
        self.assertEqual(find_brand_for_string(part_name_string.upper(), brand_list, self.brand_default, None), self.brand_default)
        self.assertEqual(find_brand_for_string(part_name_string.lower(), brand_list, self.brand_default, None), self.brand_default)
