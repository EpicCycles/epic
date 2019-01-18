from django.test import TestCase

from epic.models.framework_models import PartSection, PartType, PartTypeAttribute, AttributeOptions
from epic.model_serializers.framework_serializer import SectionSerializer, PartTypeSerializer, \
    PartTypeAttributeSerializer, AttributeOptionsSerializer


class AttributesTestCase(TestCase):

    def setUp(self):
        self.part_section1 = PartSection.objects.create(name='Section1', placing=1)
        self.part_type1 = PartType.objects.create(name='Wheels', description='Wheels description',
                                                  includeInSection=self.part_section1, placing=1,
                                                  can_be_substituted=True, can_be_omitted=True, customer_visible=True)
        self.part_type_attribute = PartTypeAttribute.objects.create(attribute_name='BB Type',
                                                                    partType=self.part_type1,
                                                                    in_use=True,
                                                                    mandatory=True,
                                                                    placing=1,
                                                                    attribute_type='1')
        self.attribute_option = AttributeOptions.objects.create(part_type_attribute=self.part_type_attribute,
                                                                option_name='Option Value')

    def test_SectionSerializer_validators(self):
        serializer = SectionSerializer(data={'id': 2, 'name': 'Groupset'})
        self.assertEqual(serializer.is_valid(False), False)
        serializer = SectionSerializer(data={'id': 2, 'placing': 2})
        self.assertEqual(serializer.is_valid(False), False)
        serializer = SectionSerializer(data={'name': 'Groupset', 'placing': 'de'})
        self.assertEqual(serializer.is_valid(False), False)
        serializer = SectionSerializer(data={'name': 'Groupset', 'placing': 2})
        self.assertEqual(serializer.is_valid(False), True)
        serializer = SectionSerializer(data={'id': self.part_section1.id, 'name': 'Section New name', 'placing': 3})
        self.assertEqual(serializer.is_valid(False), True)

    def test_PartTypeSerializer_validators(self):
        # invalid section create
        serializer = PartTypeSerializer(
            data={'id': self.part_type1.id, 'name': 'Wheels', 'description': 'Wheels descriptions',
                  'includeInSection': 99998, 'placing': 1,
                  'can_be_substituted': True, 'can_be_omitted': True, 'customer_visible': True})
        self.assertEqual(serializer.is_valid(False), False)
        # missing section
        serializer = PartTypeSerializer(data={'name': 'Wheels', 'description': 'Wheelset descriptions',
                                              'placing': 2,
                                              'can_be_substituted': True, 'can_be_omitted': True,
                                              'customer_visible': True})
        self.assertEqual(serializer.is_valid(False), False)
        # missing short name update
        serializer = PartTypeSerializer(
            data={'id': self.part_type1.id, 'description': 'Wheels description',
                  'includeInSection': self.part_section1.id, 'placing': 1,
                  'can_be_substituted': True, 'can_be_omitted': True, 'customer_visible': True})
        self.assertEqual(serializer.is_valid(False), False)
        # missing short name new
        serializer = PartTypeSerializer(data={'description': 'Wheels description',
                                              'includeInSection': self.part_section1.id, 'placing': 1,
                                              'can_be_substituted': True, 'can_be_omitted': True,
                                              'customer_visible': True})
        self.assertEqual(serializer.is_valid(False), False)
        # missing placing update
        serializer = PartTypeSerializer(
            data={'id': self.part_type1.id, 'name': 'Wheels', 'description': 'Wheels description',
                  'includeInSection': self.part_section1.id,
                  'can_be_substituted': True, 'can_be_omitted': True, 'customer_visible': True})
        self.assertEqual(serializer.is_valid(False), False)
        # missing placing new
        serializer = PartTypeSerializer(data={'name': 'Wheels', 'description': 'Wheels description',
                                              'includeInSection': self.part_section1.id,
                                              'can_be_substituted': True, 'can_be_omitted': True,
                                              'customer_visible': True})
        self.assertEqual(serializer.is_valid(False), False)
        # invalid placing update
        serializer = PartTypeSerializer(
            data={'id': self.part_type1.id, 'name': 'Wheels', 'description': 'Wheels description',
                  'includeInSection': self.part_section1.id, 'placing': 0,
                  'can_be_substituted': True, 'can_be_omitted': True, 'customer_visible': True})
        self.assertEqual(serializer.is_valid(False), False)
        # invalid placing new
        serializer = PartTypeSerializer(data={'name': 'Wheels', 'description': 'Wheels description',
                                              'includeInSection': self.part_section1.id, 'placing': 'd',
                                              'can_be_substituted': True, 'can_be_omitted': True,
                                              'customer_visible': True})
        self.assertEqual(serializer.is_valid(False), False)
        # all fields is valid create
        serializer = PartTypeSerializer(instance=self.part_type1, data={'id': self.part_type1.id, 'name': 'Wheels',
                                                                        'description': 'Wheels description',
                                                                        'includeInSection': self.part_section1.id,
                                                                        'placing': 12,
                                                                        'can_be_substituted': True,
                                                                        'can_be_omitted': True,
                                                                        'customer_visible': True})
        self.assertEqual(serializer.is_valid(), True)
        # all fields is valid new
        serializer = PartTypeSerializer(data={'name': 'Wheelsdd', 'description': 'Wheels descriptiondd',
                                              'includeInSection': self.part_section1.id, 'placing': 2,
                                              'can_be_substituted': True, 'can_be_omitted': True,
                                              'customer_visible': True})
        self.assertEqual(serializer.is_valid(False), True)
        # missing optional fields or default fields is OK
        serializer = PartTypeSerializer(instance=self.part_type1, data={'id': self.part_type1.id, 'name': 'Wheels',
                                                                        'includeInSection': self.part_section1.id,
                                                                        'placing': 1})
        self.assertEqual(serializer.is_valid(False), True)
        # missing optional fields or default fields is OK for new row
        serializer = PartTypeSerializer(data={'name': 'Wheels2',
                                              'includeInSection': self.part_section1.id, 'placing': 2})
        self.assertEqual(serializer.is_valid(False), True)

    def test_PartTypeAttributeSerializer_validators(self):
        valid_part_type = self.part_type1.id
        # new create OK
        serializer = PartTypeAttributeSerializer(data={'attribute_name': 'BB Typefdfdf',
                                                       'partType': valid_part_type,
                                                       'in_use': True,
                                                       'mandatory': True,
                                                       'placing': 6,
                                                       'attribute_type': '2'})
        self.assertEqual(serializer.is_valid(False), True)

        # existing create OK
        serializer = PartTypeAttributeSerializer(instance=self.part_type_attribute,
                                                 data={'id': self.part_type_attribute.id,
                                                       'attribute_name': 'BB Type',
                                                       'partType': valid_part_type,
                                                       'in_use': True,
                                                       'mandatory': True,
                                                       'placing': 32,
                                                       'attribute_type': '1'})
        self.assertEqual(serializer.is_valid(False), True)

        # new create error missing attribute name
        serializer = PartTypeAttributeSerializer(data={'partType': valid_part_type,
                                                       'in_use': True,
                                                       'mandatory': True,
                                                       'placing': 6,
                                                       'attribute_type': '2'})
        self.assertEqual(serializer.is_valid(False), False)
        # new create error empty name
        serializer = PartTypeAttributeSerializer(data={'attribute_name': '',
                                                       'partType': valid_part_type,
                                                       'in_use': True,
                                                       'mandatory': True,
                                                       'placing': 6,
                                                       'attribute_type': '2'})
        self.assertEqual(serializer.is_valid(False), False)
        # new create error missing part type
        serializer = PartTypeAttributeSerializer(data={'attribute_name': 'BB Typefdfdf',
                                                       'in_use': True,
                                                       'mandatory': True,
                                                       'placing': 6,
                                                       'attribute_type': '2'})
        self.assertEqual(serializer.is_valid(False), False)
        # new create error invalid parttype
        serializer = PartTypeAttributeSerializer(data={'attribute_name': 'BB Typefdfdf',
                                                       'partType': 9999999,
                                                       'in_use': True,
                                                       'mandatory': True,
                                                       'placing': 6,
                                                       'attribute_type': '2'})
        self.assertEqual(serializer.is_valid(False), False)
        # new create error missing placing
        serializer = PartTypeAttributeSerializer(data={'attribute_name': 'BB Typefdfdf',
                                                       'partType': valid_part_type,
                                                       'in_use': True,
                                                       'mandatory': True,
                                                       'attribute_type': '2'})
        self.assertEqual(serializer.is_valid(False), False)
        # new create error invalid placing
        serializer = PartTypeAttributeSerializer(data={'attribute_name': 'BB Typefdfdf',
                                                       'partType': valid_part_type,
                                                       'in_use': True,
                                                       'mandatory': True,
                                                       'placing': 'd',
                                                       'attribute_type': '2'})
        # new create error missing attributetype
        serializer = PartTypeAttributeSerializer(data={'attribute_name': 'BB Typefdfdf',
                                                       'partType': valid_part_type,
                                                       'in_use': True,
                                                       'mandatory': True,
                                                       'placing': 6})

        # existing create OK
        serializer = PartTypeAttributeSerializer(instance=self.part_type_attribute,
                                                 data={'id': self.part_type_attribute.id,
                                                       'attribute_name': 'BB Type',
                                                       'partType': valid_part_type,
                                                       'in_use': True,
                                                       'mandatory': True,
                                                       'placing': 32,
                                                       'attribute_type': '1'})
        self.assertEqual(serializer.is_valid(False), True)
        # existing create error missing attribute name
        serializer = PartTypeAttributeSerializer(instance=self.part_type_attribute,
                                                 data={'id': self.part_type_attribute.id,
                                                       'attribute_name': '',
                                                       'partType': valid_part_type,
                                                       'in_use': True,
                                                       'mandatory': True,
                                                       'placing': 32,
                                                       'attribute_type': '1'})
        self.assertEqual(serializer.is_valid(False), False)
        # existing create error missing part type
        serializer = PartTypeAttributeSerializer(instance=self.part_type_attribute,
                                                 data={'id': self.part_type_attribute.id,
                                                       'attribute_name': 'BB Type',
                                                       'partType': '',
                                                       'in_use': True,
                                                       'mandatory': True,
                                                       'placing': 32,
                                                       'attribute_type': '1'})
        self.assertEqual(serializer.is_valid(False), False)
        # existing create error invalid part type
        serializer = PartTypeAttributeSerializer(instance=self.part_type_attribute,
                                                 data={'id': self.part_type_attribute.id,
                                                       'attribute_name': 'BB Type',
                                                       'partType': 9999999,
                                                       'in_use': True,
                                                       'mandatory': True,
                                                       'placing': 32,
                                                       'attribute_type': '1'})
        self.assertEqual(serializer.is_valid(False), False)
        # existing create error missing placing
        serializer = PartTypeAttributeSerializer(instance=self.part_type_attribute,
                                                 data={'id': self.part_type_attribute.id,
                                                       'attribute_name': 'BB Type',
                                                       'partType': valid_part_type,
                                                       'in_use': True,
                                                       'mandatory': True,
                                                       'placing': '',
                                                       'attribute_type': '1'})
        self.assertEqual(serializer.is_valid(False), False)
        # existing create error invalid placing
        serializer = PartTypeAttributeSerializer(instance=self.part_type_attribute,
                                                 data={'id': self.part_type_attribute.id,
                                                       'attribute_name': 'BB Type',
                                                       'partType': valid_part_type,
                                                       'in_use': True,
                                                       'mandatory': True,
                                                       'placing': 'gh',
                                                       'attribute_type': '1'})
        self.assertEqual(serializer.is_valid(False), False)
        # existing create error missing attributetype
        serializer = PartTypeAttributeSerializer(instance=self.part_type_attribute,
                                                 data={'id': self.part_type_attribute.id,
                                                       'attribute_name': 'BB Type',
                                                       'partType': valid_part_type,
                                                       'in_use': True,
                                                       'mandatory': True,
                                                       'placing': 32,
                                                       'attribute_type': ''})
        self.assertEqual(serializer.is_valid(False), False)
        # existing create error invalid atttributetype
        serializer = PartTypeAttributeSerializer(instance=self.part_type_attribute,
                                                 data={'id': self.part_type_attribute.id,
                                                       'attribute_name': 'BB Type',
                                                       'partType': valid_part_type,
                                                       'in_use': True,
                                                       'mandatory': True,
                                                       'placing': 32,
                                                       'attribute_type': '178'})
        self.assertEqual(serializer.is_valid(False), False)

    def test_AttributeOptionsSerializer_validators(self):
        valid_part_type_attribute = self.part_type_attribute.id
        # new create OK
        serializer = AttributeOptionsSerializer(data={'part_type_attribute': valid_part_type_attribute,
                                                      'attribute_option': 'Give me a new one'})
        self.assertEqual(serializer.is_valid(False), True)
        # update OK
        serializer = AttributeOptionsSerializer(instance=self.attribute_option, data={'id': self.attribute_option.id,
                                                                                      'part_type_attribute': valid_part_type_attribute,
                                                                                      'attribute_option': 'Give me another new one'})
        self.assertEqual(serializer.is_valid(False), True)

        # new create error missing attribute
        serializer = AttributeOptionsSerializer(data={'attribute_option': 'Give me a new one'})
        self.assertEqual(serializer.is_valid(False), False)
        # new create error  invalid attribute
        serializer = AttributeOptionsSerializer(data={'part_type_attribute': 9999999,
                                                      'attribute_option': 'Give me a new one'})
        self.assertEqual(serializer.is_valid(False), False)
        # new create error missing name
        serializer = AttributeOptionsSerializer(data={'part_type_attribute': valid_part_type_attribute})
        self.assertEqual(serializer.is_valid(False), False)
        # new create error empty name
        serializer = AttributeOptionsSerializer(data={'part_type_attribute': valid_part_type_attribute,
                                                      'attribute_option': ''})
        self.assertEqual(serializer.is_valid(False), False)
        # new create error missing everything
        serializer = AttributeOptionsSerializer(data={})
        self.assertEqual(serializer.is_valid(False), False)

        # update error missing attribute
        serializer = AttributeOptionsSerializer(instance=self.attribute_option,
                                                data={'part_type_attribute': '',
                                                      'attribute_option': 'Give me another new one'})
        self.assertEqual(serializer.is_valid(False), False)

        # update error invalid attribute
        serializer = AttributeOptionsSerializer(instance=self.attribute_option,
                                                data={'part_type_attribute': 999999,
                                                      'attribute_option': 'Give me another new one'})
        self.assertEqual(serializer.is_valid(False), False)

        # update error missing name
        serializer = AttributeOptionsSerializer(instance=self.attribute_option,
                                                data={'part_type_attribute': valid_part_type_attribute,
                                                      'attribute_option': ''})
        self.assertEqual(serializer.is_valid(False), False)
