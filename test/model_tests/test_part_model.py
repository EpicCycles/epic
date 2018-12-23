from django.db import IntegrityError
from django.test import TestCase

from epic.models.brand_models import Supplier, Brand, Part
from epic.models.framework_models import PartSection, PartType, PartTypeAttribute, TEXT, RADIO, NUMBER, SELECT, MULTIPLE_C, \
    AttributeOptions


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
        self.part_type_attribute1 = PartTypeAttribute.objects.create(partType=self.part_type1,
                                                                     attribute_name='attribute 1', placing=1,
                                                                     attribute_type=TEXT)
        self.part_type_attribute2 = PartTypeAttribute.objects.create(partType=self.part_type1,
                                                                     attribute_name='attribute 2', placing=2,
                                                                     attribute_type=RADIO, mandatory=False)
        self.part_type_attribute3 = PartTypeAttribute.objects.create(partType=self.part_type1,
                                                                     attribute_name='attribute 3', placing=3,
                                                                     attribute_type=NUMBER, in_use=False)
        self.part_type_attribute4 = PartTypeAttribute.objects.create(partType=self.part_type1,
                                                                     attribute_name='attribute 4', placing=4,
                                                                     attribute_type=SELECT, in_use=False,
                                                                     mandatory=False)
        self.attribute_value1 = AttributeOptions.objects.create(part_type_attribute=self.part_type_attribute1,
                                                                attribute_option='Option 1')
        self.attribute_value2 = AttributeOptions.objects.create(part_type_attribute=self.part_type_attribute1,
                                                                attribute_option='Option 2')
        self.supplier1 = Supplier.objects.create(supplier_name='Supplier 1')
        self.supplier2 = Supplier.objects.create(supplier_name='Supplier 2')
        self.brand1 = Brand.objects.create(supplier=self.supplier1, brand_name='Brand 1', link='orbea.co.uk')
        self.brand2 = Brand.objects.create(brand_name='Brand 2')
        self.part1 = Part.objects.create_part(self.part_type1, self.brand1, 'Part 1')
        self.part2 = Part.objects.create_part(self.part_type1, self.brand1, 'Part 2')

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

    def test_section_upate_errors(self):
        get_id = self.part_section1.id
        with self.assertRaises(ValueError):
            check_section = PartSection.objects.get(id=get_id)
            check_section.name = None
            check_section.save()
        with self.assertRaises(ValueError):
            check_section = PartSection.objects.get(id=get_id)
            check_section.name = ''
            check_section.save()
        with self.assertRaises(ValueError):
            check_section = PartSection.objects.get(id=get_id)
            check_section.placing = 0
            check_section.save()
        with self.assertRaises(ValueError):
            check_section = PartSection.objects.get(id=get_id)
            check_section.placing = None
            check_section.save()
        with self.assertRaises(ValueError):
            check_section = PartSection.objects.get(id=get_id)
            check_section.placing = -1
            check_section.save()

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
        with self.assertRaises(IntegrityError):
            PartType.objects.create(shortName='Valid', placing=1)

    def test_type_update_errors(self):
        get_id = self.part_type1.id
        with self.assertRaises(ValueError):
            change_type = PartType.objects.get(id=get_id)
            change_type.shortName = None
            change_type.save()
        with self.assertRaises(ValueError):
            change_type = PartType.objects.get(id=get_id)
            change_type.shortName = ''
            change_type.save()
        with self.assertRaises(ValueError):
            change_type = PartType.objects.get(id=get_id)
            change_type.placing = None
            change_type.save()
        with self.assertRaises(ValueError):
            change_type = PartType.objects.get(id=get_id)
            change_type.placing = 0
            change_type.save()
        with self.assertRaises(ValueError):
            change_type = PartType.objects.get(id=get_id)
            change_type.placing = -1
            change_type.save()
        with self.assertRaises(IntegrityError):
            change_type = PartType.objects.get(id=get_id)
            change_type.includeInSection = None
            change_type.save()

    def test_attribute_insert_error(self):
        with self.assertRaises(ValueError):
            PartTypeAttribute.objects.create()
        with self.assertRaises(ValueError):
            PartTypeAttribute.objects.create(attribute_name='has name')
        with self.assertRaises(ValueError):
            PartTypeAttribute.objects.create(attribute_name='')
        with self.assertRaises(ValueError):
            PartTypeAttribute.objects.create(attribute_name='has name', placing=0)
        with self.assertRaises(ValueError):
            PartTypeAttribute.objects.create(attribute_name='has name', placing=-1)
        with self.assertRaises(ValueError):
            PartTypeAttribute.objects.create(attribute_name='has name', placing=1, attribute_type='UNKNOWN')
        with self.assertRaises(Exception):
            PartTypeAttribute.objects.create(attribute_name='has name', placing=1)

    def test_attribute_update_error(self):
        get_id = self.part_type_attribute1.id
        with self.assertRaises(ValueError):
            check_attribute = PartTypeAttribute.objects.get(id=get_id)
            check_attribute.attribute_name = None
            check_attribute.save()
        with self.assertRaises(ValueError):
            check_attribute = PartTypeAttribute.objects.get(id=get_id)
            check_attribute.attribute_name = ''
            check_attribute.save()
        with self.assertRaises(ValueError):
            check_attribute = PartTypeAttribute.objects.get(id=get_id)
            check_attribute.placing = None
            check_attribute.save()
        with self.assertRaises(ValueError):
            check_attribute = PartTypeAttribute.objects.get(id=get_id)
            check_attribute.placing = 0
            check_attribute.save()
        with self.assertRaises(ValueError):
            check_attribute = PartTypeAttribute.objects.get(id=get_id)
            check_attribute.placing = -1
            check_attribute.save()
        with self.assertRaises(ValueError):
            check_attribute = PartTypeAttribute.objects.get(id=get_id)
            check_attribute.attribute_type = 'XXXX'
            check_attribute.save()
        with self.assertRaises(Exception):
            check_attribute = PartTypeAttribute.objects.get(id=get_id)
            check_attribute.partType = None
            check_attribute.save()

    def test_option_insert_error(self):
        with self.assertRaises(ValueError):
            AttributeOptions.objects.create()
        with self.assertRaises(ValueError):
            AttributeOptions.objects.create(part_type_attribute=self.part_type_attribute1)
        with self.assertRaises(ValueError):
            AttributeOptions.objects.create(part_type_attribute=self.part_type_attribute1, attribute_option='')
        with self.assertRaises(Exception):
            AttributeOptions.objects.create(attribute_option='Valid Option')

    def test_option_update_error(self):
        get_id = self.attribute_value1.id
        with self.assertRaises(ValueError):
            check_option = AttributeOptions.objects.get(id=get_id)
            check_option.attribute_option = None
            check_option.save()

        with self.assertRaises(ValueError):
            check_option = AttributeOptions.objects.get(id=get_id)
            check_option.attribute_option = ''
            check_option.save()

        with self.assertRaises(Exception):
            check_option = AttributeOptions.objects.get(id=get_id)
            check_option.part_type_attribute = None
            check_option.save()

    def test_supplier_insert_error(self):
        with self.assertRaises(ValueError):
            Supplier.objects.create()
        with self.assertRaises(ValueError):
            Supplier.objects.create(supplier_name=None)
        with self.assertRaises(ValueError):
            Supplier.objects.create(supplier_name='')

    def test_suppler_update_error(self):
        with self.assertRaises(ValueError):
            self.supplier1.supplier_name = ''
            self.supplier1.save()
        with self.assertRaises(ValueError):
            self.supplier1.supplier_name = None
            self.supplier1.save()

    def test_brand_insert_error(self):
        with self.assertRaises(ValueError):
            Brand.objects.create()
        with self.assertRaises(ValueError):
            Brand.objects.create(brand_name=None)
        with self.assertRaises(ValueError):
            Brand.objects.create(brand_name='')
        with self.assertRaises(ValueError):
            Brand.objects.create(brand_name='new brand', link='')
        with self.assertRaises(ValueError):
            Brand.objects.create(brand_name='new brand', link='epic&cycles.co.uk')

    def test_brand_update_error(self):
        get_id = self.brand1.id
        with self.assertRaises(ValueError):
            check_brand = Brand.objects.get(id=get_id)
            check_brand.brand_name = None
            check_brand.save()
        with self.assertRaises(ValueError):
            check_brand = Brand.objects.get(id=get_id)
            check_brand.brand_name = ''
            check_brand.save()
        with self.assertRaises(ValueError):
            check_brand = Brand.objects.get(id=get_id)
            check_brand.link = ''
            check_brand.save()
        with self.assertRaises(ValueError):
            check_brand = Brand.objects.get(id=get_id)
            check_brand.link = 'invalidlink'
            check_brand.save()

    def test_part_insert_error(self):
        with self.assertRaises(TypeError):
            Part.objects.create_part()
        with self.assertRaises(TypeError):
            Part.objects.create_part(self.part_type1)
        with self.assertRaises(TypeError):
            Part.objects.create_part(self.part_type1, self.brand1)
        with self.assertRaises(Exception):
            Part.objects.create_part(None, self.brand1, 'x')
        with self.assertRaises(Exception):
            Part.objects.create_part(self.part_type1, None, 'x')
        with self.assertRaises(ValueError):
            Part.objects.create_part(self.part_type1, self.brand1, '')
        with self.assertRaises(ValueError):
            Part.objects.create_part(self.part_type1, self.brand1, None)

    def test_part_update_error(self):
        get_id = self.part1.id
        with self.assertRaises(ValueError):
            test_part = Part.objects.get(id=get_id)
            test_part.part_name = ''
            test_part.save()
        with self.assertRaises(ValueError):
            test_part = Part.objects.get(id=get_id)
            test_part.part_name = None
            test_part.save()
        with self.assertRaises(Exception):
            test_part = Part.objects.get(id=get_id)
            test_part.brand = None
            test_part.save()
        with self.assertRaises(Exception):
            test_part = Part.objects.get(id=get_id)
            test_part.partType = None
            test_part.save()

    def test_section_create_duplicate(self):
        with self.assertRaises(Exception):
            PartSection.objects.create(name='Section1', placing=1)
        with self.assertRaises(Exception):
            PartSection.objects.create(name='SECTION1', placing=1)
        with self.assertRaises(Exception):
            PartSection.objects.create(name='section1', placing=1)

    def test_type_create_duplicate(self):
        with self.assertRaises(IntegrityError):
            PartType.objects.create(shortName='Lights', placing=1)

    def test_type_attribute_create_duplicate(self):
        with self.assertRaises(IntegrityError):
            PartTypeAttribute.objects.create(partType=self.part_type_attribute1.partType,
                                             attribute_name=self.part_type_attribute1.attribute_name, placing=1,
                                             attribute_type=TEXT)

    def test_option_value_create_duplicate(self):
        with self.assertRaises(IntegrityError):
            AttributeOptions.objects.create(part_type_attribute=self.attribute_value1.part_type_attribute,
                                            attribute_option=self.attribute_value1.attribute_option)

    def test_supplier_create_duplicate1(self):
        with self.assertRaises(IntegrityError):
            Supplier.objects.create(supplier_name='Supplier 1')

        with self.assertRaises(IntegrityError):
            Supplier.objects.create(supplier_name='supplier 1')

        with self.assertRaises(IntegrityError):
            Supplier.objects.create(supplier_name='SUPPLIER 1')

    def test_brand_create_duplicate(self):
        with self.assertRaises(IntegrityError):
            Brand.objects.create(brand_name=self.brand1.brand_name)
        with self.assertRaises(IntegrityError):
            Brand.objects.create(brand_name=self.brand1.brand_name.upper())
        with self.assertRaises(IntegrityError):
            Brand.objects.create(brand_name=self.brand1.brand_name.lower())

    def test_part_create_duplicate(self):
        with self.assertRaises(IntegrityError):
            Part.objects.create_part(self.part1.partType, self.part1.brand, self.part1.part_name)
        with self.assertRaises(IntegrityError):
            Part.objects.create_part(self.part1.partType, self.part1.brand, self.part1.part_name.upper())
        with self.assertRaises(IntegrityError):
            Part.objects.create_part(self.part1.partType, self.part1.brand, self.part1.part_name.lower())

    def test_section_update_duplicate(self):
        with self.assertRaises(IntegrityError):
            self.part_section1.name = self.part_section2.name
            self.part_section1.save()

    def test_type_update_duplicate(self):
        with self.assertRaises(IntegrityError):
            self.part_type1.shortName = self.part_type2.shortName
            self.part_type1.save()

    def test_attribute_update_duplicate(self):
        with self.assertRaises(IntegrityError):
            self.part_type_attribute1.partType = self.part_type_attribute2.partType
            self.part_type_attribute1.attribute_name = self.part_type_attribute2.attribute_name
            self.part_type_attribute1.save()

    def test_option_value_update_duplicate(self):
        with self.assertRaises(IntegrityError):
            self.attribute_value1.attribute_option = self.attribute_value2.attribute_option
            self.attribute_value1.save()

    def test_supplier_update_duplicate(self):
        with self.assertRaises(IntegrityError):
            self.supplier2.supplier_name = self.supplier1.supplier_name.lower()
            self.supplier2.save()

        with self.assertRaises(IntegrityError):
            self.supplier2.supplier_name = self.supplier1.supplier_name
            self.supplier2.save()

        with self.assertRaises(IntegrityError):
            self.supplier2.supplier_name = self.supplier1.supplier_name.upper()
            self.supplier2.save()

    def test_brand_update_duplicate(self):
        with self.assertRaises(IntegrityError):
            self.brand2.brand_name = self.brand1.brand_name
            self.brand2.save()
        with self.assertRaises(IntegrityError):
            self.brand2.brand_name = self.brand1.brand_name.upper()
            self.brand2.save()
        with self.assertRaises(IntegrityError):
            self.brand2.brand_name = self.brand1.brand_name.lower()
            self.brand2.save()

    def test_part_update_duplicate(self):
        with self.assertRaises(IntegrityError):
            self.part2.part_name = self.part1.part_name
            self.part2.save()
        with self.assertRaises(IntegrityError):
            self.part2.part_name = self.part1.part_name.upper()
            self.part2.save()
        with self.assertRaises(IntegrityError):
            self.part2.part_name = self.part1.part_name.lower()
            self.part2.save()

    def test_type_defaults(self):
        new_part_type = PartType.objects.create(shortName='Check', placing=4, includeInSection=self.part_section1)
        self.assertEqual(new_part_type.description, None)
        self.assertEqual(new_part_type.can_be_substituted, False)
        self.assertEqual(new_part_type.can_be_omitted, False)
        self.assertEqual(new_part_type.customer_facing, False)

    def test_attribute_defaults(self):
        new_attribute = PartTypeAttribute.objects.create(partType=self.part_type_attribute1.partType,
                                                         attribute_name='Test defaults', placing=1,
                                                         attribute_type=TEXT)
        self.assertEqual(new_attribute.in_use, True)
        self.assertEqual(new_attribute.mandatory, True)

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

    def test_attribute_update(self):
        attribute_id = self.part_type_attribute1.id
        old_part_type = self.part_type_attribute1.partType
        old_attribute_name = self.part_type_attribute1.attribute_name
        old_attribute_type = self.part_type_attribute1.attribute_type
        old_in_use = self.part_type_attribute1.in_use
        old_mandatory = self.part_type_attribute1.mandatory
        old_placing = self.part_type_attribute1.placing

        self.part_type_attribute1.in_use = False
        self.part_type_attribute1.save()
        check_attribute = PartTypeAttribute.objects.get(id=attribute_id)
        self.assertEqual(check_attribute.in_use, False)
        self.assertNotEqual(check_attribute.in_use, old_in_use)
        self.assertEqual(check_attribute.mandatory, old_mandatory)

        self.part_type_attribute1.partType = self.part_type2
        self.part_type_attribute1.attribute_name = 'Updated name'
        self.part_type_attribute1.attribute_type = MULTIPLE_C
        self.part_type_attribute1.placing = old_placing + 1
        self.part_type_attribute1.mandatory = False

        self.part_type_attribute1.save()
        check_attribute = PartTypeAttribute.objects.get(id=attribute_id)
        self.assertEqual(check_attribute.partType, self.part_type2)
        self.assertNotEqual(check_attribute.partType, old_part_type)
        self.assertEqual(check_attribute.attribute_name, 'Updated name')
        self.assertNotEqual(check_attribute.attribute_name, old_attribute_name)
        self.assertEqual(check_attribute.attribute_type, MULTIPLE_C)
        self.assertNotEqual(check_attribute.attribute_type, old_attribute_type)
        self.assertEqual(check_attribute.placing, old_placing + 1)
        self.assertNotEqual(check_attribute.placing, old_placing)
        self.assertEqual(check_attribute.in_use, False)
        self.assertNotEqual(check_attribute.in_use, old_in_use)
        self.assertEqual(check_attribute.mandatory, False)
        self.assertNotEqual(check_attribute.mandatory, old_mandatory)

    def test_supplier_updates(self):
        check_id = self.supplier1.id
        old_supplier_name = self.supplier1.supplier_name

        self.supplier1.supplier_name = 'Updated Name'
        self.supplier1.save()

        check_supplier = Supplier.objects.get(id=check_id)
        self.assertEqual(check_supplier.supplier_name, 'Updated Name')
        self.assertNotEqual(check_supplier, old_supplier_name)

    def test_brand_updates(self):
        check_id = self.brand1.id
        old_brand_name = self.brand1.brand_name
        old_link = self.brand1.link
        old_supplier = self.brand1.supplier

        self.brand1.supplier = None
        self.brand1.save()
        check_brand = Brand.objects.get(id=check_id)
        self.assertEqual(check_brand.brand_name, self.brand1.brand_name)
        self.assertEqual(check_brand.link, self.brand1.link)
        self.assertEqual(check_brand.supplier, None)
        self.assertNotEqual(check_brand.supplier, old_supplier)

        self.brand1.supplier = self.supplier2
        self.brand1.save()
        check_brand = Brand.objects.get(id=check_id)
        self.assertEqual(check_brand.brand_name, self.brand1.brand_name)
        self.assertEqual(check_brand.link, self.brand1.link)
        self.assertEqual(check_brand.supplier, self.supplier2)
        self.assertNotEqual(check_brand.supplier, old_supplier)

        self.brand1.link = None
        self.brand1.save()
        check_brand = Brand.objects.get(id=check_id)
        self.assertEqual(check_brand.brand_name, self.brand1.brand_name)
        self.assertEqual(check_brand.link, None)
        self.assertEqual(check_brand.supplier, self.supplier2)
        self.assertNotEqual(check_brand.link, old_link)

        self.brand1.brand_name = 'New Brand name'
        self.brand1.save()
        check_brand = Brand.objects.get(id=check_id)
        self.assertEqual(check_brand.brand_name, 'New Brand name')
        self.assertEqual(check_brand.link, None)
        self.assertEqual(check_brand.supplier, self.supplier2)
        self.assertNotEqual(check_brand.brand_name, old_brand_name)

    def test_part_updates(self):
        check_id = self.part1.id
        old_part_type = self.part1.partType
        old_brand = self.part1.brand
        old_part_name = self.part1.part_name

        self.part1.partType = self.part_type2
        self.part1.save()
        check_part = Part.objects.get(id=check_id)
        self.assertEqual(check_part.partType, self.part_type2)
        self.assertEqual(check_part.brand, old_brand)
        self.assertEqual(check_part.part_name, old_part_name)
        self.assertNotEqual(check_part.partType, old_part_type)

        self.part1.part_name = 'Changed Name'
        self.part1.save()
        check_part = Part.objects.get(id=check_id)
        self.assertEqual(check_part.partType, self.part_type2)
        self.assertEqual(check_part.brand, old_brand)
        self.assertEqual(check_part.part_name, 'Changed Name')
        self.assertNotEqual(check_part.part_name, old_part_name)

        self.part1.brand = self.brand2
        self.part1.save()
        check_part = Part.objects.get(id=check_id)
        self.assertEqual(check_part.partType, self.part_type2)
        self.assertEqual(check_part.brand, self.brand2)
        self.assertEqual(check_part.part_name, 'Changed Name')
        self.assertNotEqual(check_part.brand, old_brand)

    def test_section_string(self):
        self.assertEqual(str(self.part_section2), self.part_section2.name)

    def test_type_string(self):
        self.assertEqual(str(self.part_type1), self.part_type1.shortName)

    def test_attribute_string(self):
        self.assertEqual(str(self.part_type_attribute1), self.part_type_attribute1.attribute_name)

    def test_supplier_string(self):
        self.assertEqual(str(self.supplier1), self.supplier1.supplier_name)

    def test_brand_string(self):
        self.assertEqual(str(self.brand1), self.brand1.brand_name)

    def test_part_string(self):
        expected = f'{self.part1.partType.shortName}: {self.part1.brand.brand_name} {self.part1.part_name}'
        self.assertEqual(str(self.part1), expected)

    def test_attribute_needs_completing(self):
        self.assertEqual(self.part_type_attribute1.needs_completing(), True)
        self.assertEqual(self.part_type_attribute2.needs_completing(), False)
        self.assertEqual(self.part_type_attribute3.needs_completing(), False)
        self.assertEqual(self.part_type_attribute4.needs_completing(), False)

    def test_brand_has_link(self):
        self.assertEqual(self.brand1.has_link(), True)
        self.assertEqual(self.brand2.has_link(), False)

    def test_brand_build_link(self):
        self.assertEqual(self.brand1.build_link_new_tab().startswith('<a'), True)
        self.assertEqual(self.brand2.build_link_new_tab(), None)

    def test_part_javascript_object(self):
        expected = f'brand:"{self.part1.brand.id}",partType:"{self.part1.partType.id}",partName:"{self.part1.part_name}"'
        self.assertEqual(self.part1.getJavascriptObject(), expected)
