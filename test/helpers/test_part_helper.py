from django.test import TestCase

from epic.model_helpers.part_helper import find_or_create_part
from epic.models.framework_models import PartSection, PartType
from epic.models.brand_models import Supplier, Brand, Part


class PartHelperTestCase(TestCase):
    def setUp(self):
        self.part_section1 = PartSection.objects.create(name='Section 1', placing=3)
        self.part_section2 = PartSection.objects.create(name='Section2', placing=2)
        self.part_section3 = PartSection.objects.create(name='Section3', placing=1)
        self.part_type1 = PartType.objects.create(name='Wheels',
                                                  includeInSection=self.part_section1, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_visible=True)
        self.part_type2 = PartType.objects.create(name='Lights',
                                                  includeInSection=self.part_section1, placing=2,
                                                  can_be_substituted=True, can_be_omitted=True, customer_visible=True)
        self.part_type3 = PartType.objects.create(name='Things',
                                                  includeInSection=self.part_section3, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_visible=True)
        self.brand1 = Brand.objects.create(brand_name='Brand 1', link='orbea.co.uk')
        self.brand2 = Brand.objects.create(brand_name='Brand 2')
        self.part1 = Part.objects.create_part(self.part_type2, self.brand1, 'Part 1')
        self.part2 = Part.objects.create_part(self.part_type1, self.brand1, 'Part 2')
        self.part3 = Part.objects.create_part(self.part_type3, self.brand2, 'Part 3')

    def test_find_or_create_part_found(self):
        self.assertEqual(self.part1, find_or_create_part(self.brand1, self.part_type2, 'Part 1', True))

    def test_find_or_create_part_created(self):
        expected_count = Part.objects.all().count() + 1
        created_part = find_or_create_part(self.brand1, self.part_type2, 'Part x', False)
        final_count = Part.objects.all().count()

        self.assertNotEqual(self.part1, created_part)
        self.assertNotEqual(self.part2, created_part)
        self.assertNotEqual(self.part3, created_part)
        self.assertEqual(expected_count, final_count)

    def test_find_or_create_part_not_created(self):
        expected_count = Part.objects.all().count()
        created_part = find_or_create_part(self.brand1, self.part_type2, 'Part x', True)
        final_count = Part.objects.all().count()

        self.assertEqual(created_part, None)
        self.assertEqual(expected_count, final_count)
