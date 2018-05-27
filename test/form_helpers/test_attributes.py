from django.test import TestCase

from epic.form_helpers.attributes import getAttributeChoiceDict, getAttributeForm, TextAttributeForm, \
    NumberAttributeForm, RadioAttributeForm, ChoiceAttributeForm
from epic.models import PartType, PartSection, PartTypeAttribute, TEXT, RADIO, AttributeOptions, SELECT, NUMBER, \
    Customer, Quote, QuotePart, Brand, Part, QuotePartAttribute, PART


class AttributesTestCase(TestCase):

    def setUp(self):
        part_section = PartSection.objects.create(name='Dummy Section', placing=1)
        part_type = PartType.objects.create(shortName='AttributesTestCase Type', includeInSection=part_section,
                                            placing=1)
        self.att_no_choices = PartTypeAttribute.objects.create(partType=part_type, attribute_name='Att 1', in_use=True,
                                                               mandatory=True, placing=1, attribute_type=TEXT)
        self.att_number = PartTypeAttribute.objects.create(partType=part_type, attribute_name='Att Number', in_use=True,
                                                           mandatory=True, placing=4, attribute_type=NUMBER)
        self.att_no_default = PartTypeAttribute.objects.create(partType=part_type, attribute_name='Att 2', in_use=True,
                                                               mandatory=True, placing=2, attribute_type=RADIO)
        self.att_default = PartTypeAttribute.objects.create(partType=part_type, attribute_name='Att 3', in_use=True,
                                                            mandatory=True, placing=3, attribute_type=SELECT)
        AttributeOptions.objects.create(part_type_attribute=self.att_no_default, attribute_option='firstOption')
        AttributeOptions.objects.create(part_type_attribute=self.att_default, attribute_option='option 1')
        AttributeOptions.objects.create(part_type_attribute=self.att_default, attribute_option='option 2')
        customer = Customer.objects.create(first_name='A', last_name='ttributesTestCase')
        quote = Quote.objects.create(customer=customer, quote_desc='AttributesTestCase', quote_type=PART)
        brand = Brand.objects.create(brand_name='B')
        part = Part.objects.create_part(part_type, brand, 'Part for AttributesTestCase')
        self.quote_part = QuotePart.objects.create(quote=quote, partType=part_type, part=part)

    def test_getAttributeChoiceDict_missing_values(self):
        with self.assertRaises(TypeError):
            getAttributeChoiceDict()

    def test_getAttributeChoiceDict_no_choices(self):
        self.assertEqual(getAttributeChoiceDict(self.att_no_choices), [])

    def test_getAttributeChoiceDict_single_choice(self):
        self.assertEqual(getAttributeChoiceDict(self.att_no_default), [['firstOption', 'firstOption']])

    def test_getAttributeChoiceDict_multiple_choices(self):
        self.assertEqual(getAttributeChoiceDict(self.att_default),
                         [['option 1', 'option 1'], ['option 2', 'option 2']])

    def test_getAttributeForm_missing_values(self):
        quote_part_attribute = QuotePartAttribute.objects.filter(partTypeAttribute=self.att_no_choices).first()

        with self.assertRaises(TypeError):
            getAttributeForm(quote_part_attribute)

    def test_getAttributeForm_missing_prefix(self):
        with self.assertRaises(TypeError):
            getAttributeForm()

    def test_getAttributeForm_instance_type_text(self):
        quote_part_attribute = QuotePartAttribute.objects.filter(partTypeAttribute=self.att_no_choices).first()
        self.assertIsInstance(getAttributeForm(quote_part_attribute, ""), TextAttributeForm,
                              'Text attribute form no prefix')
        self.assertIsInstance(getAttributeForm(quote_part_attribute, "prefix"), TextAttributeForm,
                              'Text attribute form with prefix')

    def test_getAttributeForm_instance_type_number(self):
        quote_part_attribute = QuotePartAttribute.objects.filter(partTypeAttribute=self.att_number).first()
        self.assertIsInstance(getAttributeForm(quote_part_attribute, ""), NumberAttributeForm,
                              'number attribute form no prefix')
        self.assertIsInstance(getAttributeForm(quote_part_attribute, "prefix"), NumberAttributeForm,
                              'number attribute form with prefix')

    def test_getAttributeForm_instance_type_radio(self):
        quote_part_attribute = QuotePartAttribute.objects.filter(partTypeAttribute=self.att_no_default).first()
        self.assertIsInstance(getAttributeForm(quote_part_attribute, ""), RadioAttributeForm,
                              'Radio attribute form no prefix')
        self.assertIsInstance(getAttributeForm(quote_part_attribute, "prefix"), RadioAttributeForm,
                              'Radio attribute form with prefix')

    def test_getAttributeForm_instance_type_select(self):
        self.quote_part.save()
        quote_part_attribute = QuotePartAttribute.objects.filter(partTypeAttribute=self.att_default).first()
        self.assertIsInstance(getAttributeForm(quote_part_attribute, ""), ChoiceAttributeForm,
                              'select attribute form no prefix')
        self.assertIsInstance(getAttributeForm(quote_part_attribute, "prefix"), ChoiceAttributeForm,
                              'select attribute form with prefix')
