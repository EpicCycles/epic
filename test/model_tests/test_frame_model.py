from decimal import Decimal

from django.db import IntegrityError
from django.test import TestCase

from epic.models import PartSection, PartType, PartTypeAttribute, TEXT, RADIO, NUMBER, SELECT, AttributeOptions, \
    Supplier, Brand, Part, Frame, FramePart, FrameExclusion


class FrameModeltestCase(TestCase):
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
        self.frame1 = Frame.objects.create(brand=self.brand1, frame_name='Frame 1', model='Model 1',
                                           sell_price=Decimal('2345.99'))
        self.frame2 = Frame.objects.create(brand=self.brand2, frame_name='Frame 2', model='Model 2',
                                           sell_price=Decimal('3345.99'))
        self.frame_part1 = FramePart.objects.create(frame=self.frame1, part=self.part1)
        self.frame_part2 = FramePart.objects.create(frame=self.frame1, part=self.part2)
        self.frame_exclusion1 = FrameExclusion.objects.create(frame=self.frame1, partType=self.part_type1)
        self.frame_exclusion2 = FrameExclusion.objects.create(frame=self.frame1, partType=self.part_type2)

    def test_frame_insert_errors(self):
        with self.assertRaises(ValueError):
            Frame.objects.create()
        with self.assertRaises(ValueError):
            Frame.objects.create(brand=self.brand1)
        with self.assertRaises(ValueError):
            Frame.objects.create(brand=self.brand1, frame_name='New frame')
        with self.assertRaises(ValueError):
            Frame.objects.create(brand=self.brand1, model='New model')

    def test_frame_part_insert_errors(self):
        with self.assertRaises(Exception):
            FramePart.objects.create()
        with self.assertRaises(Exception):
            FramePart.objects.create(frame=self.frame1)
        with self.assertRaises(Exception):
            FramePart.objects.create(part=self.part1)

    def test_frame_exclusion_insert_errors(self):
        with self.assertRaises(Exception):
            FrameExclusion.objects.create()
        with self.assertRaises(Exception):
            FrameExclusion.objects.create(frame=self.frame1)
        with self.assertRaises(Exception):
            FrameExclusion.objects.create(partType=self.part_type1)

    def test_frame_manager_sparse_errors(self):
        with self.assertRaises(TypeError):
            Frame.objects.create_frame_sparse()
        with self.assertRaises(TypeError):
            Frame.objects.create_frame_sparse(None)
        with self.assertRaises(TypeError):
            Frame.objects.create_frame_sparse(self.brand1)
        with self.assertRaises(TypeError):
            Frame.objects.create_frame_sparse(self.brand1, 'Frame test')
        with self.assertRaises(ValueError):
            Frame.objects.create_frame_sparse(self.brand1, 'Frame test', None)
        with self.assertRaises(ValueError):
            Frame.objects.create_frame_sparse(self.brand1, None, 'Frame Model')
        with self.assertRaises(ValueError):
            Frame.objects.create_frame_sparse(None, 'Frame test', 'Frame Model')
        with self.assertRaises(TypeError):
            Frame.objects.create_frame_sparse('Brand', 'Frame name', 'Model for test')

    def test_frame_manager_full_errors(self):
        with self.assertRaises(TypeError):
            Frame.objects.create_frame()
        with self.assertRaises(TypeError):
            Frame.objects.create_frame(None)
        with self.assertRaises(TypeError):
            Frame.objects.create_frame(self.brand1)
        with self.assertRaises(TypeError):
            Frame.objects.create_frame(self.brand1, 'Frame test')
        with self.assertRaises(TypeError):
            Frame.objects.create_frame(self.brand1, 'Frame test', None)
        with self.assertRaises(ValueError):
            Frame.objects.create_frame(self.brand1, None, 'Frame Model', None)
        with self.assertRaises(ValueError):
            Frame.objects.create_frame(None, 'Frame test', 'Frame Model', None)
        with self.assertRaises(TypeError):
            Frame.objects.create_frame('Brand', 'Frame name', 'Model for test', None)
        with self.assertRaises(ValueError):
            Frame.objects.create_frame(self.brand1, 'Frame test', None, 'full description with long text')
        with self.assertRaises(ValueError):
            Frame.objects.create_frame(self.brand1, None, 'Frame Model', 'full description with long text')
        with self.assertRaises(ValueError):
            Frame.objects.create_frame(None, 'Frame test', 'Frame Model', 'full description with long text')
        with self.assertRaises(TypeError):
            Frame.objects.create_frame('Brand', 'Frame name', 'Model for test', 'full description with long text')

    def test_frame_part_manager_create_errors(self):
        with self.assertRaises(Exception):
            FramePart.objects.create_frame_part()
        with self.assertRaises(Exception):
            FramePart.objects.create_frame_part(self.frame2)
        with self.assertRaises(ValueError):
            FramePart.objects.create_frame_part(self.frame2, None)
        with self.assertRaises(TypeError):
            FramePart.objects.create_frame_part(self.frame2, self.part_section1)
        with self.assertRaises(ValueError):
            FramePart.objects.create_frame_part(None, self.part1)
        with self.assertRaises(TypeError):
            FramePart.objects.create_frame_part(self.brand2, self.part1)

    def test_frame_exclusion_manager_create_errors(self):
        with self.assertRaises(Exception):
            FrameExclusion.objects.create_frame_exclusion()
        with self.assertRaises(Exception):
            FrameExclusion.objects.create_frame_exclusion(self.frame2)
        with self.assertRaises(ValueError):
            FrameExclusion.objects.create_frame_exclusion(self.frame2, None)
        with self.assertRaises(TypeError):
            FrameExclusion.objects.create_frame_exclusion(self.frame2, self.part_section1)
        with self.assertRaises(ValueError):
            FrameExclusion.objects.create_frame_exclusion(None, self.part_type1)
        with self.assertRaises(TypeError):
            FrameExclusion.objects.create_frame_exclusion(self.brand2, self.part_type1)

    def test_frame_update_errors(self):
        check_id = self.frame1.id
        with self.assertRaises(ValueError):
            test_frame = Frame.objects.get(id=check_id)
            test_frame.frame_name = None
            test_frame.save()
        with self.assertRaises(ValueError):
            test_frame = Frame.objects.get(id=check_id)
            test_frame.model = None
            test_frame.save()

    def test_frame_part_update_errors(self):
        check_id = self.frame_part1.id
        with self.assertRaises(Exception):
            test_frame_part = FramePart.objects.get(id=check_id)
            test_frame_part.frame = None
            test_frame_part.save()
        with self.assertRaises(Exception):
            test_frame_part = FramePart.objects.get(id=check_id)
            test_frame_part.part = None
            test_frame_part.save()

    def test_frame_exclusion_update_errors(self):
        check_id = self.frame_exclusion1.id
        with self.assertRaises(Exception):
            test_frame_exclusion = FrameExclusion.objects.get(id=check_id)
            test_frame_exclusion.frame = None
            test_frame_exclusion.save()
        with self.assertRaises(Exception):
            test_frame_exclusion = FrameExclusion.objects.get(id=check_id)
            test_frame_exclusion.partType = None
            test_frame_exclusion.save()

    def test_frame_create_duplicate(self):
        with self.assertRaises(IntegrityError):
            Frame.objects.create_frame_sparse(self.frame1.brand, self.frame1.frame_name, self.frame1.model)
        with self.assertRaises(IntegrityError):
            Frame.objects.create_frame_sparse(self.frame1.brand, self.frame1.frame_name.upper(), self.frame1.model)
        with self.assertRaises(IntegrityError):
            Frame.objects.create_frame_sparse(self.frame1.brand, self.frame1.frame_name, self.frame1.model.upper())
        with self.assertRaises(IntegrityError):
            Frame.objects.create_frame_sparse(self.frame1.brand, self.frame1.frame_name.lower(), self.frame1.model)
        with self.assertRaises(IntegrityError):
            Frame.objects.create_frame_sparse(self.frame1.brand, self.frame1.frame_name, self.frame1.model.lower())

    def test_frame_part_create_duplicate(self):
        with self.assertRaises(IntegrityError):
            FramePart.objects.create_frame_part(self.frame_part1.frame, self.frame_part1.part)
        with self.assertRaises(IntegrityError):
            FramePart.objects.create(frame=self.frame_part1.frame, part=self.frame_part1.part)

    def test_frame_exclusion_create_duplicate(self):
        with self.assertRaises(IntegrityError):
            FrameExclusion.objects.create_frame_exclusion(self.frame_exclusion1.frame, self.frame_exclusion1.partType)
        with self.assertRaises(IntegrityError):
            FrameExclusion.objects.create(frame=self.frame_exclusion1.frame, partType=self.frame_exclusion1.partType)

    def test_frame_update_duplicate(self):
        check_id = self.frame1.id
        with self.assertRaises(IntegrityError):
            test_frame = Frame.objects.get(id=check_id)
            test_frame.brand = self.frame2.brand
            test_frame.frame_name = self.frame2.frame_name
            test_frame.model = self.frame2.model
            test_frame.save()
        with self.assertRaises(IntegrityError):
            test_frame = Frame.objects.get(id=check_id)
            test_frame.brand = self.frame2.brand
            test_frame.frame_name = self.frame2.frame_name.upper()
            test_frame.model = self.frame2.model
            test_frame.save()
        with self.assertRaises(IntegrityError):
            test_frame = Frame.objects.get(id=check_id)
            test_frame.brand = self.frame2.brand
            test_frame.frame_name = self.frame2.frame_name
            test_frame.model = self.frame2.model.upper()
            test_frame.save()
        with self.assertRaises(IntegrityError):
            test_frame = Frame.objects.get(id=check_id)
            test_frame.brand = self.frame2.brand
            test_frame.frame_name = self.frame2.frame_name.lower()
            test_frame.model = self.frame2.model
            test_frame.save()
        with self.assertRaises(IntegrityError):
            test_frame = Frame.objects.get(id=check_id)
            test_frame.brand = self.frame2.brand
            test_frame.frame_name = self.frame2.frame_name
            test_frame.model = self.frame2.model.lower()
            test_frame.save()

    def test_frame_part_update_duplicate(self):
        check_id = self.frame_part1.id
        with self.assertRaises(IntegrityError):
            test_frame_part = FramePart.objects.get(id=check_id)
            test_frame_part.frame = self.frame_part2.frame
            test_frame_part.part = self.frame_part2.part
            test_frame_part.save()

    def test_frame_exclusion_update_duplicate(self):
        check_id = self.frame_exclusion1.id
        with self.assertRaises(IntegrityError):
            test_frame_exclusion = FrameExclusion.objects.get(id=check_id)
            test_frame_exclusion.frame = self.frame_exclusion2.frame
            test_frame_exclusion.partType = self.frame_exclusion2.partType
            test_frame_exclusion.save()

    def test_frame_insert_defaults(self):
        test_frame_1 = Frame.objects.create_frame_sparse(self.brand2, 'test frame 2', 'Test Model 1')
        self.assertEqual(test_frame_1.brand, self.brand2)
        self.assertEqual(test_frame_1.frame_name, 'test frame 2')
        self.assertEqual(test_frame_1.model, 'Test Model 1')
        self.assertEqual(test_frame_1.description, None)
        self.assertEqual(test_frame_1.colour, None)
        self.assertEqual(test_frame_1.sell_price, None)
        self.assertEqual(test_frame_1.sizes, None)
        test_frame_2 = Frame.objects.create_frame(self.brand2, 'test frame 2', 'Test Model 2', None)
        self.assertEqual(test_frame_2.brand, self.brand2)
        self.assertEqual(test_frame_2.frame_name, 'test frame 2')
        self.assertEqual(test_frame_2.model, 'Test Model 2')
        self.assertEqual(test_frame_2.description, None)
        self.assertEqual(test_frame_2.colour, None)
        self.assertEqual(test_frame_2.sell_price, None)
        self.assertEqual(test_frame_2.sizes, None)
        test_frame_3 = Frame.objects.create_frame(self.brand2, 'test frame 2', 'Test Model 3', 'test description')
        self.assertEqual(test_frame_3.brand, self.brand2)
        self.assertEqual(test_frame_3.frame_name, 'test frame 2')
        self.assertEqual(test_frame_3.model, 'Test Model 3')
        self.assertEqual(test_frame_3.description, 'test description')
        self.assertEqual(test_frame_3.colour, None)
        self.assertEqual(test_frame_3.sell_price, None)
        self.assertEqual(test_frame_3.sizes, None)

    def test_frame_insert_values(self):
        test_frame = Frame.objects.create(brand=self.brand2, frame_name='New test',
                                          model='New Model', description='New description',
                                          colour='New colous', sell_price=Decimal('1234.56'),
                                          sizes='Range of sizes')
        self.assertEqual(test_frame.brand, self.brand2)
        self.assertEqual(test_frame.frame_name, 'New test')
        self.assertEqual(test_frame.model, 'New Model')
        self.assertEqual(test_frame.description, 'New description')
        self.assertEqual(test_frame.colour, 'New colous')
        self.assertEqual(test_frame.sell_price, Decimal('1234.56'))
        self.assertEqual(test_frame.sizes, 'Range of sizes')

    def test_frame_update_values1(self):
        check_id = self.frame1.id
        old_brand = self.frame1.brand
        old_frame_name = self.frame1.frame_name
        old_model = self.frame1.model
        old_description = self.frame1.description
        old_colour = self.frame1.colour
        old_sell_price = self.frame1.sell_price
        old_sizes = self.frame1.sizes

        test_frame = Frame.objects.get(id=check_id)
        test_frame.save()
        test_updated_frame = Frame.objects.get(id=check_id)
        self.assertEqual(old_brand, test_updated_frame.brand)
        self.assertEqual(old_frame_name, test_updated_frame.frame_name)
        self.assertEqual(old_model, test_updated_frame.model)
        self.assertEqual(old_description, test_updated_frame.description)
        self.assertEqual(old_colour, test_updated_frame.colour)
        self.assertEqual(old_sell_price, test_updated_frame.sell_price)
        self.assertEqual(old_sizes, test_updated_frame.sizes)

    def test_frame_update_values2(self):
        check_id = self.frame1.id
        old_brand = self.frame1.brand
        old_frame_name = self.frame1.frame_name
        old_model = self.frame1.model
        old_description = self.frame1.description
        old_colour = self.frame1.colour
        old_sell_price = self.frame1.sell_price
        old_sizes = self.frame1.sizes

        test_frame = Frame.objects.get(id=check_id)
        test_frame.brand = self.brand2
        test_frame.save()
        test_updated_frame = Frame.objects.get(id=check_id)
        self.assertNotEqual(old_brand, test_updated_frame.brand)
        self.assertEqual(self.brand2, test_updated_frame.brand)
        self.assertEqual(old_frame_name, test_updated_frame.frame_name)
        self.assertEqual(old_model, test_updated_frame.model)
        self.assertEqual(old_description, test_updated_frame.description)
        self.assertEqual(old_colour, test_updated_frame.colour)
        self.assertEqual(old_sell_price, test_updated_frame.sell_price)
        self.assertEqual(old_sizes, test_updated_frame.sizes)

    def test_frame_update_values3(self):
        check_id = self.frame1.id
        old_brand = self.frame1.brand
        old_frame_name = self.frame1.frame_name
        old_model = self.frame1.model
        old_description = self.frame1.description
        old_colour = self.frame1.colour
        old_sell_price = self.frame1.sell_price
        old_sizes = self.frame1.sizes

        test_frame = Frame.objects.get(id=check_id)
        test_frame.frame_name = 'Corrected name'
        test_frame.save()
        test_updated_frame = Frame.objects.get(id=check_id)
        self.assertEqual(old_brand, test_updated_frame.brand)
        self.assertNotEqual(old_frame_name, test_updated_frame.frame_name)
        self.assertEqual('Corrected name', test_updated_frame.frame_name)
        self.assertEqual(old_model, test_updated_frame.model)
        self.assertEqual(old_description, test_updated_frame.description)
        self.assertEqual(old_colour, test_updated_frame.colour)
        self.assertEqual(old_sell_price, test_updated_frame.sell_price)
        self.assertEqual(old_sizes, test_updated_frame.sizes)

    def test_frame_update_values4(self):
        check_id = self.frame1.id
        old_brand = self.frame1.brand
        old_frame_name = self.frame1.frame_name
        old_model = self.frame1.model
        old_description = self.frame1.description
        old_colour = self.frame1.colour
        old_sell_price = self.frame1.sell_price
        old_sizes = self.frame1.sizes

        test_frame = Frame.objects.get(id=check_id)
        test_frame.model = 'My Model'
        test_frame.save()
        test_updated_frame = Frame.objects.get(id=check_id)
        self.assertEqual(old_brand, test_updated_frame.brand)
        self.assertEqual(old_frame_name, test_updated_frame.frame_name)
        self.assertNotEqual(old_model, test_updated_frame.model)
        self.assertEqual('My Model', test_updated_frame.model)
        self.assertEqual(old_description, test_updated_frame.description)
        self.assertEqual(old_colour, test_updated_frame.colour)
        self.assertEqual(old_sell_price, test_updated_frame.sell_price)
        self.assertEqual(old_sizes, test_updated_frame.sizes)

    def test_frame_update_values5(self):
        check_id = self.frame1.id
        old_brand = self.frame1.brand
        old_frame_name = self.frame1.frame_name
        old_model = self.frame1.model
        old_description = self.frame1.description
        old_colour = self.frame1.colour
        old_sell_price = self.frame1.sell_price
        old_sizes = self.frame1.sizes

        test_frame = Frame.objects.get(id=check_id)
        test_frame.description = 'Spanking new description'
        test_frame.save()
        test_updated_frame = Frame.objects.get(id=check_id)
        self.assertEqual(old_brand, test_updated_frame.brand)
        self.assertEqual(old_frame_name, test_updated_frame.frame_name)
        self.assertEqual(old_model, test_updated_frame.model)
        self.assertNotEqual(old_description, test_updated_frame.description)
        self.assertEqual('Spanking new description', test_updated_frame.description)
        self.assertEqual(old_colour, test_updated_frame.colour)
        self.assertEqual(old_sell_price, test_updated_frame.sell_price)
        self.assertEqual(old_sizes, test_updated_frame.sizes)

    def test_frame_update_values6(self):
        check_id = self.frame1.id
        old_brand = self.frame1.brand
        old_frame_name = self.frame1.frame_name
        old_model = self.frame1.model
        old_description = self.frame1.description
        old_colour = self.frame1.colour
        old_sell_price = self.frame1.sell_price
        old_sizes = self.frame1.sizes

        test_frame = Frame.objects.get(id=check_id)
        test_frame.colour = 'New range of colours'
        test_frame.save()
        test_updated_frame = Frame.objects.get(id=check_id)
        self.assertEqual(old_brand, test_updated_frame.brand)
        self.assertEqual(old_frame_name, test_updated_frame.frame_name)
        self.assertEqual(old_model, test_updated_frame.model)
        self.assertEqual(old_description, test_updated_frame.description)
        self.assertNotEqual(old_colour, test_updated_frame.colour)
        self.assertEqual('New range of colours', test_updated_frame.colour)
        self.assertEqual(old_sell_price, test_updated_frame.sell_price)
        self.assertEqual(old_sizes, test_updated_frame.sizes)

    def test_frame_update_values7(self):
        check_id = self.frame1.id
        old_brand = self.frame1.brand
        old_frame_name = self.frame1.frame_name
        old_model = self.frame1.model
        old_description = self.frame1.description
        old_colour = self.frame1.colour
        old_sell_price = self.frame1.sell_price
        old_sizes = self.frame1.sizes

        test_frame = Frame.objects.get(id=check_id)
        test_frame.sell_price = Decimal('999.99')
        test_frame.save()
        test_updated_frame = Frame.objects.get(id=check_id)
        self.assertEqual(old_brand, test_updated_frame.brand)
        self.assertEqual(old_frame_name, test_updated_frame.frame_name)
        self.assertEqual(old_model, test_updated_frame.model)
        self.assertEqual(old_description, test_updated_frame.description)
        self.assertEqual(old_colour, test_updated_frame.colour)
        self.assertNotEqual(old_sell_price, test_updated_frame.sell_price)
        self.assertEqual(Decimal('999.99'), test_updated_frame.sell_price)
        self.assertEqual(old_sizes, test_updated_frame.sizes)

    def test_frame_update_values8(self):
        check_id = self.frame1.id
        old_brand = self.frame1.brand
        old_frame_name = self.frame1.frame_name
        old_model = self.frame1.model
        old_description = self.frame1.description
        old_colour = self.frame1.colour
        old_sell_price = self.frame1.sell_price
        old_sizes = self.frame1.sizes

        test_frame = Frame.objects.get(id=check_id)
        test_frame.sizes = 'New Size Values'
        test_frame.save()
        test_updated_frame = Frame.objects.get(id=check_id)
        self.assertEqual(old_brand, test_updated_frame.brand)
        self.assertEqual(old_frame_name, test_updated_frame.frame_name)
        self.assertEqual(old_model, test_updated_frame.model)
        self.assertEqual(old_description, test_updated_frame.description)
        self.assertEqual(old_colour, test_updated_frame.colour)
        self.assertEqual(old_sell_price, test_updated_frame.sell_price)
        self.assertNotEqual(old_sizes, test_updated_frame.sizes)
        self.assertEqual('New Size Values', test_updated_frame.sizes)

    def test_frame_string(self):
        expected = f'{self.frame1.brand.brand_name}: {self.frame1.frame_name} {self.frame1.model}'
        self.assertEqual(expected, str(self.frame1))

    def test_frame_part_string(self):
        expected = f'{self.frame_part1.part.partType.shortName}: {str(self.frame_part1.part.brand)} {self.frame_part1.part.part_name}'
        self.assertEqual(expected, str(self.frame_part1))

    def test_frame_exception_string(self):
        expected = f'{str(self.frame_exclusion1.partType)} n/a'
        self.assertEqual(expected, str(self.frame_exclusion1))
