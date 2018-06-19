from _decimal import Decimal

from django.test import TestCase

from epic.model_helpers.frame_helper import frame_display
from epic.models import PartSection, PartType, Supplier, Brand, Part, Frame, FramePart, FrameExclusion


class FrameModeltestCase(TestCase):
    def setUp(self):
        self.part_section1 = PartSection.objects.create(name='Section1', placing=1)
        self.part_section2 = PartSection.objects.create(name='Section2', placing=2)
        self.part_section3 = PartSection.objects.create(name='Section3', placing=2)
        self.part_section4 = PartSection.objects.create(name='Section4', placing=2)
        self.part_type1 = PartType.objects.create(shortName='Wheels', description='Wheels description',
                                                  includeInSection=self.part_section1, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_facing=True)
        self.part_type2 = PartType.objects.create(shortName='Lights', description='Wheels description',
                                                  includeInSection=self.part_section1, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_facing=True)
        self.part_type2a = PartType.objects.create(shortName='Lights2', description='light not partss description',
                                                   includeInSection=self.part_section1, placing=1,
                                                   can_be_substituted=True, can_be_omitted=True, customer_facing=True)
        self.part_type3 = PartType.objects.create(shortName='Panniers', description='panniers description',
                                                  includeInSection=self.part_section2, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_facing=True)
        self.part_type4 = PartType.objects.create(shortName='Bongos', description='bongos description',
                                                  includeInSection=self.part_section2, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_facing=True)
        self.supplier1 = Supplier.objects.create(supplier_name='Supplier 1')
        self.supplier2 = Supplier.objects.create(supplier_name='Supplier 2')
        self.brand1 = Brand.objects.create(supplier=self.supplier1, brand_name='Brand 1', link='orbea.co.uk')
        self.brand2 = Brand.objects.create(brand_name='Brand 2')
        self.part1 = Part.objects.create_part(self.part_type1, self.brand1, 'Part 1')
        self.part2 = Part.objects.create_part(self.part_type2, self.brand1, 'Part 2')
        self.part3 = Part.objects.create_part(self.part_type3, self.brand2, 'Part 3')
        self.frame1 = Frame.objects.create(brand=self.brand1, frame_name='Frame 1', model='Model 1',
                                           sell_price=Decimal('2345.99'))
        self.frame2 = Frame.objects.create(brand=self.brand2, frame_name='Frame 2', model='Model 2',
                                           sell_price=Decimal('3345.99'))
        self.frame_part1 = FramePart.objects.create(frame=self.frame1, part=self.part1)
        self.frame_part2 = FramePart.objects.create(frame=self.frame1, part=self.part2)
        self.frame_part3 = FramePart.objects.create(frame=self.frame1, part=self.part3)
        self.frame_exclusion1 = FrameExclusion.objects.create(frame=self.frame1, partType=self.part_type1)
        self.frame_exclusion2 = FrameExclusion.objects.create(frame=self.frame1, partType=self.part_type2)

    def test_frame_display(self):
        self.assertEqual(0, len(frame_display(self.frame2)))
        expected_count = FramePart.objects.filter(frame=self.frame1).count()
        self.assertEqual(expected_count, len(frame_display(self.frame1)))
