from decimal import Decimal

from django.test import TestCase
from epic.forms import FrameChangePartForm
from epic.models import PartSection, PartType, Supplier, Brand, Part, Frame, FramePart, FrameExclusion


class FrameChangePartFormTestCase(TestCase):
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
        self.frame3 = Frame.objects.create(brand=self.brand2, frame_name='Frame 2', model='Model 3',
                                           sell_price=Decimal('3345.99'), archived=True)
        self.frame_part1 = FramePart.objects.create(frame=self.frame1, part=self.part1)
        self.frame_part2 = FramePart.objects.create(frame=self.frame1, part=self.part2)
        self.frame_part3 = FramePart.objects.create(frame=self.frame1, part=self.part3)
        self.frame_exclusion1 = FrameExclusion.objects.create(frame=self.frame1, partType=self.part_type1)
        self.frame_exclusion2 = FrameExclusion.objects.create(frame=self.frame1, partType=self.part_type2)

    def test_frame_change_part_form_valid_data(self):
        form = FrameChangePartForm({
            'part_name': 'replacement frame name',
            'brand': self.brand2.id,
            'part_type': self.part_type1.id,
        })
        self.assertTrue(form.is_valid())
        self.assertEqual(form.errors, {})

    def test_frame_change_part_form_blank_data_all(self):
        form = FrameChangePartForm({
        })
        self.assertFalse(form.is_valid())

    def test_frame_change_part_form_no_data(self):
        form = FrameChangePartForm({
            'part_type': self.part_type3.id
        })

        self.assertTrue(form.is_valid())
        self.assertEqual(form.errors, {})


    def test_frame_change_part_form_all_data(self):
        form = FrameChangePartForm({
            'part_name': 'replacement frame name',
            'brand': self.brand2.id,
            'part_type': self.part_type3.id
        })
        self.assertTrue(form.is_valid())
        self.assertEqual(form.errors, {})

    def test_frame_change_part_form_not_relevant(self):
        form = FrameChangePartForm({
            'not_relevant': True,
            'part_type': self.part_type3.id
        })
        self.assertTrue(form.is_valid())
        self.assertEqual(form.errors, {})

    def test_frame_change_part_form_not_relevant_and_data(self):
        form1 = FrameChangePartForm({
            'not_relevant': True,
            'part_name': 'replacement frame name',
            'part_type': self.part_type3.id
        })
        self.assertFalse(form1.is_valid())
        self.assertEqual(form1.errors, {
            'not_relevant': ["Please untick this if a part is present."],
        })
        form2 = FrameChangePartForm({
            'not_relevant': True,
            'brand': self.brand2.id,
            'part_name': 'replacement frame name',
            'part_type': self.part_type3.id
        })
        self.assertFalse(form2.is_valid())
        self.assertEqual(form2.errors, {
            'not_relevant': ["Please untick this if a part is present."],
        })
        form3 = FrameChangePartForm({
            'not_relevant': True,
            'brand': self.brand2.id,
            'part_type': self.part_type3.id
        })
        self.assertFalse(form3.is_valid())
        self.assertEqual(form3.errors, {
            'not_relevant': ["Please untick this if a part is present."],
        })

    def test_frame_change_part_form_incomplete_data(self):
        form1 = FrameChangePartForm({
            'part_name': 'replacement frame name',
            'part_type': self.part_type3.id
        })
        self.assertFalse(form1.is_valid())
        self.assertEqual(form1.errors, {
            'part_name': ["Please specify a brand, or remove part name."],
        })
        form3 = FrameChangePartForm({
            'brand': self.brand2.id,
            'part_type': self.part_type3.id
        })
        self.assertFalse(form3.is_valid())
        self.assertEqual(form3.errors, {
            'brand': ["Please specify a part name, or remove brand."],
        })
