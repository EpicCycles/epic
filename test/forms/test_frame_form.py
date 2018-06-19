from decimal import Decimal

from django.test import TestCase

from epic.forms import FrameForm
from epic.models import PartSection, PartType, Supplier, Brand, Part, Frame, FramePart, FrameExclusion


class FrameFormTestCase(TestCase):
    def setUp(self):
        self.part_section1 = PartSection.objects.create(name='Section 1', placing=3)
        self.part_section2 = PartSection.objects.create(name='Section2', placing=2)
        self.part_section3 = PartSection.objects.create(name='Section3', placing=1)
        self.part_type1 = PartType.objects.create(shortName='Wheels', description='Wheels description',
                                                  includeInSection=self.part_section1, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_facing=True)
        self.part_type2 = PartType.objects.create(shortName='Lights', description='Wheels description',
                                                  includeInSection=self.part_section1, placing=2,
                                                  can_be_substituted=True, can_be_omitted=True, customer_facing=True)
        self.part_type3 = PartType.objects.create(shortName='Things', description='Things description',
                                                  includeInSection=self.part_section3, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_facing=True)
        self.supplier1 = Supplier.objects.create(supplier_name='Supplier 1')
        self.brand1 = Brand.objects.create(supplier=self.supplier1, brand_name='Brand 1', link='orbea.co.uk')
        self.brand2 = Brand.objects.create(brand_name='Brand 2')
        self.part1 = Part.objects.create_part(self.part_type2, self.brand1, 'Part 1')
        self.part2 = Part.objects.create_part(self.part_type1, self.brand1, 'Part 2')
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

    def test_frame_form_valid_data(self):
        form = FrameForm({
            'frame_name': 'replacement frame name',
            'brand': self.brand2.id,
            'model': 'new model name',
        }, instance=self.frame1)
        self.assertTrue(form.is_valid())
        self.assertEqual(form.errors, {})
        new_frame = form.save()
        self.assertEqual(new_frame.frame_name, "replacement frame name")
        self.assertEqual(new_frame.brand, self.brand2)
        self.assertEqual(new_frame.model, 'new model name')

    def test_frame_form_blank_data_all(self):
        form = FrameForm({
        }, instance=self.frame1)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            'frame_name': ['This field is required.'],
            'brand': ['This field is required.'],
            'model': ['This field is required.'],
        })

    def test_frame_form_all_data(self):
        form = FrameForm({
            'frame_name': 'replacement frame name',
            'brand': self.brand2.id,
            'model': 'new model name',
            'description': 'new description',
            'colour': 'red',
            'sizes': '53, 56'
        }, instance=self.frame1)
        self.assertTrue(form.is_valid())
        self.assertEqual(form.errors, {})
        new_frame = form.save()
        self.assertEqual(new_frame.frame_name, "replacement frame name")
        self.assertEqual(new_frame.brand, self.brand2)
        self.assertEqual(new_frame.model, 'new model name')
        self.assertEqual(new_frame.description, 'new description')
        self.assertEqual(new_frame.colour, 'red')
        self.assertEqual(new_frame.sizes, '53, 56')
