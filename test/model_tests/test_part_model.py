from django.db import IntegrityError
from django.test import TestCase

from epic.models import PartSection, PartType


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

    def test_section_insert_errors(self):
        with self.assertRaises(ValueError):
            PartSection.objects.create()
        with self.assertRaises(ValueError):
            PartSection.objects.create(name='Valid')
        with self.assertRaises(ValueError):
            PartSection.objects.create(placing=1)
        with self.assertRaises(ValueError):
            PartSection.objects.create(name='', placing=1)
        with self.assertRaises(ValueError):
            PartSection.objects.create(name='Valid', placing=0)
        with self.assertRaises(ValueError):
            PartSection.objects.create(name='Valid', placing=-1)

    def test_type_insert_errors(self):
        with self.assertRaises(ValueError):
            PartType.objects.create()
        with self.assertRaises(ValueError):
            PartType.objects.create(shortName='Valid')
        with self.assertRaises(ValueError):
            PartType.objects.create(placing=1)
        with self.assertRaises(ValueError):
            PartType.objects.create(shortName='', placing=1)
        with self.assertRaises(ValueError):
            PartType.objects.create(shortName='Valid', placing=0)
        with self.assertRaises(ValueError):
            PartType.objects.create(shortName='Valid', placing=-1)

    def test_section_create_duplicate(self):
        with self.assertRaises(IntegrityError):
            PartSection.objects.create(name='Section1', placing=1)

    def test_type_create_duplicate(self):
        with self.assertRaises(IntegrityError):
            PartType.objects.create(shortName='Lights', placing=1)

    def test_section_update_duplicate(self):
        with self.assertRaises(IntegrityError):
            self.part_section1.name = self.part_section2.name
            self.part_section1.save()

    def test_stype_update_duplicate(self):
        with self.assertRaises(IntegrityError):
            self.part_type1.shortName = self.part_type2.shortName
            self.part_type1.save()

    def test_type_defaults(self):
        new_part_type = PartType.objects.create(shortName='Check', placing=4, includeInSection=self.part_section1)
        self.assertEqual(new_part_type.description, None)
        self.assertEqual(new_part_type.can_be_substituted, False)
        self.assertEqual(new_part_type.can_be_omitted, False)
        self.assertEqual(new_part_type.customer_facing, False)

    def test_section_update(self):
        section_id = self.part_section1.id
        section_name = self.part_section1.name
        section_placing = self.part_section1.placing

        self.part_section1.name = 'New Name 1'
        self.part_section1.placing = 6
        self.part_section1.save()

        check_section = PartSection.objects.get(id=section_id)
        self.assertEqual(check_section.name, 'New Name 1')
        self.assertNotEqual(check_section.name, section_name)
        self.assertEqual(check_section.placing, 6)
        self.assertNotEqual(check_section.placing, section_placing)

    def test_type_update(self):
        part_id = self.part_type1.id
        short_name = self.part_type1.shortName
        description = self.part_type1.description
        includeInSection = self.part_type1.includeInSection
        placing = self.part_type1.placing
        can_be_substituted = self.part_type1.can_be_substituted
        can_be_omitted = self.part_type1.can_be_omitted
        customer_facing = self.part_type1.customer_facing

        self.part_type1.shortName = 'Bob'
        self.part_type1.description = 'Bob desc'
        self.part_type1.includeInSection = self.part_section2
        self.part_type1.placing = 24
        self.part_type1.can_be_substituted = False
        self.part_type1.can_be_omitted = False
        self.part_type1.customer_facing = False
        self.part_type1.save()

        check_type = PartType.objects.get(id=part_id)
        self.assertEqual(check_type.shortName, 'Bob')
        self.assertNotEqual(check_type.shortName, short_name)
        self.assertEqual(check_type.description, 'Bob desc')
        self.assertNotEqual(check_type.description, description)
        self.assertEqual(check_type.includeInSection, self.part_section2)
        self.assertNotEqual(check_type.includeInSection, includeInSection)
        self.assertEqual(check_type.placing, 24)
        self.assertNotEqual(check_type.placing, placing)
        self.assertEqual(check_type.can_be_substituted, False)
        self.assertNotEqual(check_type.can_be_substituted, can_be_substituted)
        self.assertEqual(check_type.can_be_omitted, False)
        self.assertNotEqual(check_type.can_be_omitted, can_be_omitted)
        self.assertEqual(check_type.customer_facing, False)
        self.assertNotEqual(check_type.customer_facing, customer_facing)

    def test_section_string(self):
        self.assertEqual(str(self.part_section2), self.part_section2.name)

    def test_type_string(self):
        self.assertEqual(str(self.part_type1), self.part_type1.shortName)
