from django import forms
from django.forms import HiddenInput, RadioSelect

from epic.models import QuotePartAttribute, TEXT, NUMBER, RADIO, SELECT, MULTIPLE_C, MULTIPLE_S, AttributeOptions, \
    PartTypeAttribute


def getAttributeForm(object: QuotePartAttribute, form_prefix):
    attribute_name = str(object.partTypeAttribute)
    attribute_value = object.attribute_value
    if object.partTypeAttribute.attribute_type is TEXT:
        if form_prefix is not "":
            return TextAttributeForm(initial={'attribute_name': attribute_name, 'attribute_value': attribute_value},
                                     prefix=form_prefix)
        else:
            return TextAttributeForm(initial={'attribute_name': attribute_name, 'attribute_value': attribute_value})
    elif object.partTypeAttribute.attribute_type is NUMBER:
        if form_prefix is not "":
            return NumberAttributeForm(
                initial={'attribute_name': attribute_name, 'attribute_value': attribute_value}, prefix=form_prefix)
        else:
            return NumberAttributeForm(
                initial={'attribute_name': attribute_name, 'attribute_value': attribute_value})
    elif object.partTypeAttribute.attribute_type is SELECT:
        if form_prefix is not "":
            return ChoiceAttributeForm(
                initial={'attribute_name': attribute_name, 'attribute_value': attribute_value}, prefix=form_prefix,
                value_choices=getAttributeChoiceDict(object.partTypeAttribute))
        else:
            return ChoiceAttributeForm(
                initial={'attribute_name': attribute_name, 'attribute_value': attribute_value},
                value_choices=getAttributeChoiceDict(object.partTypeAttribute))
    elif object.partTypeAttribute.attribute_type is RADIO:
        if form_prefix is not "":
            return RadioAttributeForm(
                initial={'attribute_name': attribute_name, 'attribute_value': attribute_value},
                prefix=form_prefix, value_choices=getAttributeChoiceDict(object.partTypeAttribute))
        else:
            return RadioAttributeForm(
                initial={'attribute_name': attribute_name, 'attribute_value': attribute_value},
                value_choices=getAttributeChoiceDict(object.partTypeAttribute))


def getAttributeFormUpdated(request_post, request_files, object, form_prefix):

    if isinstance(object, QuotePartAttribute):
        if object.partTypeAttribute.attribute_type is TEXT:
            if form_prefix is not "":
                return TextAttributeForm(request_post, request_files, prefix=form_prefix)
            else:
                return TextAttributeForm(request_post, request_files)
        elif object.partTypeAttribute.attribute_type is NUMBER:
            if form_prefix is not "":
                return NumberAttributeForm(request_post, request_files, prefix=form_prefix)
            else:
                return NumberAttributeForm(request_post, request_files)
        elif object.partTypeAttribute.attribute_type is SELECT:
            if form_prefix is not "":
                return ChoiceAttributeForm(request_post, request_files, prefix=form_prefix,
                                           value_choices=getAttributeChoiceDict(object.partTypeAttribute))
            else:
                return ChoiceAttributeForm(request_post, request_files, value_choices=getAttributeChoiceDict(object.partTypeAttribute))
        elif object.partTypeAttribute.attribute_type is RADIO:
            if form_prefix is not "":
                return RadioAttributeForm(request_post, request_files, prefix=form_prefix,
                                          value_choices=getAttributeChoiceDict(object.partTypeAttribute))
            else:
                return RadioAttributeForm(request_post, request_files, value_choices=getAttributeChoiceDict(object.partTypeAttribute))


def getAttributeChoiceDict(part_tpe_attribute: PartTypeAttribute):
    attribute_options = AttributeOptions.objects.filter(part_type_attribute=part_tpe_attribute)
    value_choices = [["",""]]
    for attribute_value in attribute_options:
        value_choices.append([attribute_value.attribute_option, attribute_value.attribute_option])
    return value_choices


# attributes for quote parts - choice type
class ChoiceAttributeForm(forms.Form):
    attribute_name = forms.CharField(required=False)
    attribute_value = forms.ChoiceField(required=False)

    def __init__(self, *args, **kwargs):
        self.value_choices = kwargs.pop('value_choices')

        super(ChoiceAttributeForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['attribute_value'] = forms.ChoiceField(choices=self.value_choices,
                                                           required=False)
        self.fields['attribute_name'].widget = HiddenInput()


# attributes for quote parts - radio type
class RadioAttributeForm(forms.Form):
    attribute_name = forms.CharField(required=False)
    attribute_value = forms.ChoiceField(required=False)

    def __init__(self, *args, **kwargs):
        self.value_choices = kwargs.pop('value_choices')

        super(RadioAttributeForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['attribute_value'] = forms.ChoiceField(widget=RadioSelect(),
                                                           choices=self.value_choices,
                                                           required=False)
        self.fields['attribute_name'].widget = HiddenInput()


# attributes for quote parts
class TextAttributeForm(forms.Form):
    attribute_name = forms.CharField(required=False)
    attribute_value = forms.CharField(max_length=15, required=False)

    def __init__(self, *args, **kwargs):
        # self.attribute_name  = kwargs.pop('attribute_name')
        # self.fields['attribute_value'].label = self.attribute_name

        super(TextAttributeForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['attribute_value'].widget = forms.TextInput(attrs={'size': '10'})
        self.fields['attribute_name'].widget = HiddenInput()


# attributes for quote parts
class NumberAttributeForm(forms.Form):
    attribute_name = forms.CharField(required=False)
    attribute_value = forms.DecimalField(max_digits=6, decimal_places=2, min_value=0.00, required=False)

    def __init__(self, *args, **kwargs):
        super(TextAttributeForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['attribute_value'].widget = forms.TextInput(attrs={'size': '10'})
