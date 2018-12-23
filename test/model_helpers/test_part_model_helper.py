from django.test import TestCase

from epic.model_helpers.part_helper import find_or_create_part
from epic.models.brand_models import Supplier, Brand, Part
from epic.models.framework_models import PartSection, PartType


class PartModelTestCase(TestCase):
    def setUp(self):
        self.part_section1 = PartSection.objects.create(name='Section1', placing=1)
        self.part_section2 = PartSection.objects.create(name='Section2', placing=2)
        self.part_type1 = PartType.objects.create(shortName='Wheels', description='Wheels description',
                                                  includeInSection=self.part_section1, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_facing=True)
        self.part_type2 = PartType.objects.create(shortName='Lights', description='Wheels description',
                                                  includeInSection=self.part_section1, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_facing=True)
        self.supplier1 = Supplier.objects.create(supplier_name='Supplier 1')
        self.supplier2 = Supplier.objects.create(supplier_name='Supplier 2')
        self.brand1 = Brand.objects.create(supplier=self.supplier1, brand_name='Brand 1', link='orbea.co.uk')
        self.brand2 = Brand.objects.create(brand_name='Brand 2')
        self.part1 = Part.objects.create_part(self.part_type1, self.brand1, 'Part 1')
        self.part2 = Part.objects.create_part(self.part_type1, self.brand1, 'Part 2')

    def test_find_or_create_part(self):
        parts_before_test = Part.objects.all().count()
        self.assertEqual(self.part1, find_or_create_part(self.brand1, self.part_type1, 'Part 1', True))
        self.assertEqual(self.part1, find_or_create_part(self.brand1, self.part_type1, 'PART 1', True))
        self.assertEqual(self.part1, find_or_create_part(self.brand1, self.part_type1, 'part 1', True))

        find_or_create_part(self.brand2, self.part_type1, self.part1.part_name, True)
        expected_count = parts_before_test + 1
        self.assertEqual(expected_count, Part.objects.all().count())
