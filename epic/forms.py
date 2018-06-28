# forms.py
from django import forms
from django.contrib.auth.models import User
from django.forms import ModelForm
from django.forms.models import inlineformset_factory
from django.forms.widgets import HiddenInput
from django.utils.translation import ugettext_lazy as _

from epic.form_helpers.choices import get_brand_list_from_cache, get_part_type_list_from_cache
from epic.form_helpers.regular_expressions import NAME_PATTERN, POSTCODE_PATTERN
# useful documentation here - https://docs.djangoproject.com/en/1.10/topics/forms/
# global variables for forms
from epic.helpers.validation_helper import is_valid_name, is_valid_telephone
from epic.models import *

FORM_FITTING_TYPE_CHOICES = list(FITTING_TYPE_CHOICES)
FORM_FITTING_TYPE_CHOICES.insert(0, (None, '---------'))
FORM_NUMBER_TYPE_CHOICES = list(NUMBER_TYPE_CHOICES)
FORM_NUMBER_TYPE_CHOICES.insert(0, (None, '----'))
FORM_QUOTE_TYPE_CHOICES = list(QUOTE_TYPE_CHOICES)
FORM_QUOTE_TYPE_CHOICES.insert(0, (None, '-----'))
BLANK_CHOICE = [(None, '---------')]


class CustomerForm(ModelForm):
    class Meta:
        model = Customer
        fields = ['first_name', 'last_name', 'email']

    def __init__(self, *args, **kwargs):
        super(CustomerForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''

    # validate the data input
    def clean(self):
        cleaned_data = super(CustomerForm, self).clean()
        first_name = cleaned_data.get("first_name")
        last_name = cleaned_data.get("last_name")
        if first_name:
            if not is_valid_name(first_name):
                self.add_error('first_name', 'Enter a valid first name.')
        if last_name:
            if not is_valid_name(last_name):
                self.add_error('last_name', 'Enter a valid last name.')


class ChangeCustomerForm(ModelForm):
    class Meta(CustomerForm.Meta):
        model = Customer
        fields = ['first_name', 'last_name', 'email']

    def __init__(self, *args, **kwargs):
        super(ChangeCustomerForm, self).__init__(*args, **kwargs)
        self.fields['first_name'].widget = forms.TextInput(
            attrs={'size': '20', 'minlength': '1', 'maxlength': '40', 'pattern': NAME_PATTERN})
        self.fields['last_name'].widget = forms.TextInput(
            attrs={'size': '30', 'minlength': '1', 'maxlength': '40', 'pattern': NAME_PATTERN})
        self.fields['email'].widget = forms.TextInput(
            attrs={'type': 'email', 'size': '30', 'minlength': '3', 'maxlength': '100'})

        self.label_suffix = ''

    # validate the data input
    def clean(self):
        cleaned_data = super(ChangeCustomerForm, self).clean()
        first_name = cleaned_data.get("first_name")
        last_name = cleaned_data.get("last_name")
        if first_name:
            if not is_valid_name(first_name):
                self.add_error('first_name', 'Enter a valid first name.')
        if last_name:
            if not is_valid_name(last_name):
                self.add_error('last_name', 'Enter a valid last name.')


class AddressForm(ModelForm):
    class Meta:
        model = CustomerAddress
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(AddressForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['address1'].widget = forms.TextInput(attrs={'size': '30'})
        self.fields['address2'].widget = forms.TextInput(attrs={'size': '20'})
        self.fields['address3'].widget = forms.TextInput(attrs={'size': '15'})
        self.fields['address4'].widget = forms.TextInput(attrs={'size': '15'})
        self.fields['postcode'].widget = forms.TextInput(attrs={'size': '9', 'pattern': POSTCODE_PATTERN})
        self.fields['customer'].widget = forms.HiddenInput()

    # validate the data input
    def clean(self, is_simple_form=False):
        cleaned_data = super(AddressForm, self).clean()
        postcode = cleaned_data.get("postcode")

        if is_simple_form:
            address1 = cleaned_data.get("address1")
            if (address1 or postcode) and not (address1 and postcode):
                # Must have both if have either (simple form only
                msg = "Both first line of address and a postcode must be entered."
                if address1:
                    self.add_error('postcode', msg)
                if postcode:
                    self.add_error('address1', msg)

        if postcode:
            if not is_valid_post_code(postcode):
                self.add_error('postcode', 'Enter a valid postcode.')


class AddressFormSimple(AddressForm):
    def __init__(self, *args, **kwargs):
        super(AddressFormSimple, self).__init__(*args, **kwargs)
        self.fields['customer'].widget = HiddenInput()
        self.fields['customer'].required = False
        self.fields['address1'].required = False
        self.fields['postcode'].required = False

    # validate the data input
    def clean(self):
        return super(AddressFormSimple, self).clean(is_simple_form=True)


# Form for phone details
class PhoneForm(ModelForm):
    class Meta:
        model = CustomerPhone
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(PhoneForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['telephone'].widget = forms.TextInput(attrs={'size': '15'})
        self.fields['customer'].widget = forms.HiddenInput()

    # validate the data input
    def clean(self, is_simple_form=False):
        cleaned_data = super(PhoneForm, self).clean()
        telephone = cleaned_data.get("telephone")
        if is_simple_form:
            number_type = cleaned_data.get("number_type")
            if telephone and not (number_type and telephone):
                # Must have both if have either (simple form only
                msg = "Both number and number type must be entered."
                if number_type:
                    self.add_error('telephone', msg)
                if telephone:
                    self.add_error('number_type', msg)
        if telephone:
            if not is_valid_telephone(telephone):
                self.add_error('telephone', 'Enter a valid telephone number.')


class PhoneFormSimple(PhoneForm):
    def __init__(self, *args, **kwargs):
        super(PhoneFormSimple, self).__init__(*args, **kwargs)
        self.fields['customer'].widget = HiddenInput()
        self.fields['customer'].required = False
        self.fields['telephone'].required = False
        self.fields['number_type'].required = False

    # validate the data input
    def clean(self):
        return super(PhoneFormSimple, self).clean(is_simple_form=True)


# form for full fitting details
class FittingForm(ModelForm):
    # create choices for types
    fitting_type = forms.ChoiceField(label='Fitting Source', choices=FORM_FITTING_TYPE_CHOICES, required=False,
                                     label_suffix='')
    saddle_height = forms.CharField(label='Saddle Height', max_length="20", required=False)
    bar_height = forms.CharField(label='Bar Height', max_length="20", required=False)
    reach = forms.CharField(label='Reach', max_length="20", required=False)

    class Meta:
        model = Fitting
        fields = ('fitting_type', 'saddle_height', 'bar_height', 'reach')

    def __init__(self, *args, **kwargs):
        super(FittingForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['saddle_height'].widget = forms.TextInput(attrs={'size': '10'})
        self.fields['bar_height'].widget = forms.TextInput(attrs={'size': '10'})
        self.fields['reach'].widget = forms.TextInput(attrs={'size': '10'})

    def clean(self):
        cleaned_data = super(FittingForm, self).clean()
        fitting_type = cleaned_data.get("fitting_type")
        saddle_height = cleaned_data.get("saddle_height")
        bar_height = cleaned_data.get("bar_height")
        reach = cleaned_data.get("reach")

        # no fieldsare required but if any are present all must be
        if ((fitting_type != '') or (saddle_height != '') or (bar_height != '') or (reach != '')):
            if not (fitting_type and saddle_height and bar_height and reach):
                raise forms.ValidationError("All measures must be entered to save a fitting.")


AddressFormSet = inlineformset_factory(Customer, CustomerAddress, form=AddressForm, extra=1)
PhoneFormSet = inlineformset_factory(Customer, CustomerPhone, form=PhoneForm, extra=1)
FittingFormSet = inlineformset_factory(Customer, Fitting, form=FittingForm, extra=1)


class FrameForm(ModelForm):
    class Meta:
        model = Frame
        fields = ('brand', 'frame_name', 'model', 'description', 'colour', 'sell_price', 'sizes', 'archived')
        labels = {'frame': _('Frame'), 'brand': _('Brand'), 'model': _('Model Name'),
                  'description': _('Model Description'), 'colour': _('Colour Options'),
                  'sell_price': _('Model Price (web) £'), 'sizes': _('Available Sizes')}

    def __init__(self, *args, **kwargs):
        super(FrameForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['brand'].widget = HiddenInput()
        self.fields['frame_name'].widget = HiddenInput()
        self.fields['colour'].widget = forms.TextInput(attrs={'size': '40'})
        self.fields['sizes'].widget = forms.TextInput(attrs={'size': '40'})


class FramePartForm(ModelForm):
    class Meta:
        model = FramePart
        fields = '__all__'


class FrameChangePartForm(forms.Form):
    brand = forms.ChoiceField(choices=[], required=False, label='Brand')
    part_name = forms.CharField(required=False, label='Part Name')
    part_type = forms.ModelChoiceField(queryset=get_part_type_list_from_cache())
    not_relevant = forms.BooleanField(required=False, label='Not Valid')

    def __init__(self, *args, **kwargs):
        super(FrameChangePartForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['part_type'].widget = HiddenInput()
        self.fields['part_name'].widget = forms.TextInput(attrs={'size': '40'})
        self.fields['brand'].choices = BLANK_CHOICE + get_brand_list_from_cache()

    def clean(self):
        cleaned_data = super(FrameChangePartForm, self).clean()
        brand = cleaned_data.get("brand")
        part_name = cleaned_data.get("part_name")
        not_relevant = cleaned_data.get("not_relevant")

        # if only the type is entered then this is valid
        if not_relevant:
            if brand or part_name:
                msg = "Please untick this if a part is present."
                self.add_error('not_relevant', msg)
        else:
            if brand:
                if part_name:
                    pass
                else:
                    msg = "Please specify a part name, or remove brand."
                    self.add_error('brand', msg)
            else:
                if part_name:
                    msg = "Please specify a brand, or remove part name."
                    self.add_error('part_name', msg)


class PartForm(ModelForm):
    class Meta:
        model = Part
        fields = '__all__'


class PartTypeForm(ModelForm):
    class Meta:
        model = PartType
        fields = '__all__'


# form for searching for quotes
class QuoteSearchForm(forms.Form):
    search_brand = forms.CharField(required=False)
    search_frame = forms.CharField(required=False)
    search_model = forms.CharField(required=False)
    search_quote_desc = forms.CharField(max_length='30', required=False, label='Description Like')
    search_user = forms.ModelChoiceField(queryset=User.objects.all(), required=False, label='Created By',
                                         label_suffix='')

    def __init__(self, *args, **kwargs):
        super(QuoteSearchForm, self).__init__(*args, **kwargs)
        self.fields['search_brand'].widget = HiddenInput()
        self.fields['search_frame'].widget = HiddenInput()
        self.fields['search_model'].widget = HiddenInput()

        self.label_suffix = ''


class BrandForm(ModelForm):
    class Meta:
        model = Brand
        fields = ['brand_name', 'supplier']

    def __init__(self, *args, **kwargs):
        super(BrandForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''


# Get back quotes for the current user
class MyQuoteSearchForm(forms.Form):
    search_brand = forms.CharField(required=False)
    search_frame = forms.CharField(required=False)
    search_model = forms.CharField(required=False)
    search_quote_desc = forms.CharField(max_length='30', required=False, label='Description Like')

    def __init__(self, *args, **kwargs):
        super(MyQuoteSearchForm, self).__init__(*args, **kwargs)
        self.fields['search_brand'].widget = HiddenInput()
        self.fields['search_frame'].widget = HiddenInput()
        self.fields['search_model'].widget = HiddenInput()

        self.label_suffix = ''


# form for basic Quote details
class QuoteForm(ModelForm):
    class Meta:
        model = Quote
        fields = ['customer', 'quote_desc', 'quote_type', 'keyed_sell_price', 'frame', 'frame_sell_price', 'colour',
                  'colour_price',
                  'frame_size']
        labels = {'quote_desc': _('Quote Description'), 'quote_type': _('Type'), 'keyed_sell_price': _('Quote Total £'),
                  'frame_sell_price': _('Base Sell Price £'), 'colour_price': _('Colour Additional Price £'),
                  'frame_size': _('Frame Size')}

    def __init__(self, *args, **kwargs):
        super(QuoteForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['customer'].widget = HiddenInput()
        self.fields['frame'].widget = HiddenInput()
        self.fields['keyed_sell_price'].widget = forms.TextInput(attrs={'size': 6})
        self.fields['frame_sell_price'].widget = forms.TextInput(attrs={'size': 6})
        self.fields['colour_price'].widget = forms.TextInput(attrs={'size': 6})
        self.fields['frame_size'].widget = forms.TextInput(attrs={'size': 4})
        if self.instance.pk:
            self.fields['quote_type'].widget = HiddenInput()
            if self.instance.quote_type is PART:
                self.fields['frame'].widget = HiddenInput()
                self.fields['frame_sell_price'].widget = HiddenInput()
                self.fields['colour'].widget = HiddenInput()
                self.fields['colour_price'].widget = HiddenInput()
                self.fields['frame_size'].widget = HiddenInput()
        else:
            self.fields['quote_type'].widget = forms.Select(attrs={'onchange': "changeQuoteType(this);"})
            self.fields['quote_type'].choices = FORM_QUOTE_TYPE_CHOICES

    def clean(self):
        cleaned_data = super(QuoteForm, self).clean()
        quote_desc = cleaned_data.get("quote_desc")
        quote_type = cleaned_data.get("quote_type")
        customer = cleaned_data.get("customer")
        frame = cleaned_data.get("frame")

        if customer is None:
            raise forms.ValidationError("A Customer must be present to create a quote.")

        # if only the type is entered then this is valid
        if quote_type == BIKE and quote_desc == '' and frame is None:
            pass

        # Only do something if both fields are valid so far.
        elif (quote_type != '') or (quote_desc != ''):
            if quote_desc == '':
                # must have a frame if the quote type is BIKE
                msg = "Please enter a description for the quote."
                self.add_error('quote_desc', msg)
            if quote_type == '':
                # must have a frame if the quote type is BIKE
                msg = "Please select a quote type."
                self.add_error('quote_type', msg)
            if quote_type == BIKE:
                if frame is None:
                    # must have a frame if the quote type is BIKE
                    raise forms.ValidationError("Please select a frame or change the quote type.")


class CustomerQuoteForm(QuoteForm):
    def __init__(self, *args, **kwargs):
        super(CustomerQuoteForm, self).__init__(*args, **kwargs)
        self.fields['customer'].widget = HiddenInput()
        self.fields['quote_desc'].required = False


class NewCustomerQuoteForm(QuoteForm):
    def __init__(self, *args, **kwargs):
        super(NewCustomerQuoteForm, self).__init__(*args, **kwargs)
        self.fields['customer'].widget = HiddenInput()
        self.fields['quote_desc'].required = False
        self.fields['customer'].required = False


# quote for a non bike based (items only)
class QuoteSimpleForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(QuoteSimpleForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields["sell_price"].widget = HiddenInput()
        self.fields['keyed_sell_price'].widget = forms.TextInput(attrs={'size': '6'})

    class Meta:
        model = Quote
        fields = ['quote_desc', 'sell_price', 'keyed_sell_price']
        labels = {'sell_price': _('Total Price £'), 'quote_desc': _('Quote Description'),
                  'keyed_sell_price': _('Quote Price £')}


# simple quote add item
class QuoteSimpleAddPartForm(forms.Form):
    new_brand = forms.ChoiceField(choices=[], required=False, label='Brand')
    new_part_type = forms.ModelChoiceField(queryset=get_part_type_list_from_cache().order_by('shortName'),
                                           required=False,
                                           label='Part Type')
    new_part_name = forms.CharField(max_length=60, required=False, label='Part Name')
    new_quantity = forms.IntegerField(max_value=9999, min_value=1, required=False, label='Quantity')
    new_sell_price = forms.DecimalField(max_digits=6, decimal_places=2, min_value=0.00, required=False,
                                        label='Sell Price')

    def __init__(self, *args, **kwargs):
        super(QuoteSimpleAddPartForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['new_quantity'].widget = forms.TextInput(attrs={'size': '4', 'title': 'Qty'})
        self.fields['new_sell_price'].widget = forms.TextInput(attrs={'size': '6', 'title': 'Sell Price'})
        self.fields['new_brand'].choices = BLANK_CHOICE + get_brand_list_from_cache()

    def clean(self):
        cleaned_data = super(QuoteSimpleAddPartForm, self).clean()

        new_brand = cleaned_data.get("new_brand")
        new_part_type = cleaned_data.get("new_part_type")
        new_part_name = cleaned_data.get("new_part_name")
        new_quantity = cleaned_data.get("new_quantity")
        new_sell_price = cleaned_data.get("new_sell_price")

        # no fieldsare required but if any are present all must be
        if (new_brand or new_part_type or new_part_name or new_quantity or new_sell_price) and not (
                new_brand and new_part_type and new_part_name and new_quantity):
            raise forms.ValidationError("All data must be entered to add a new item to a quote.")


# quote for a  bike based (items only)
class QuoteBikeForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(QuoteBikeForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['customer'].widget = HiddenInput()
        self.fields['frame'].widget = HiddenInput()
        self.fields["quote_type"].widget = HiddenInput()
        self.fields["sell_price"].widget = HiddenInput()
        self.fields['keyed_sell_price'].widget = forms.TextInput(attrs={'size': '9'})
        self.fields['frame_sell_price'].widget = forms.TextInput(attrs={'size': '9'})
        self.fields['colour_price'].widget = forms.TextInput(attrs={'size': '9'})

    class Meta:
        model = Quote
        fields = ['customer', 'quote_type', 'quote_desc', 'frame', 'sell_price', 'keyed_sell_price', 'frame_sell_price',
                  'colour', 'colour_price', 'frame_size']
        labels = {'frame': _('Frameset/Base Bike'), 'quote_desc': _('Quote Description'), 'quote_type': _('Type'),
                  'frame_sell_price': _('Base Sell Price £'), 'colour_price': _('Colour Additional Price £'),
                  'frame_size': _('Frame Size'), 'sell_price': _('Total Price £'),
                  'keyed_sell_price': _('Quote Price £')}


# basic quote kine for adding lines
class QuotePartForm(forms.Form):
    part_type = forms.ModelChoiceField(queryset=get_part_type_list_from_cache(),
                                       label='Part Type', required=False)
    brand = forms.ChoiceField(choices=[], required=False, label='Brand')
    part_name = forms.CharField(max_length=60, required=False, label='Part Name')
    quantity = forms.IntegerField(max_value=9999, min_value=1, required=False, label='Quantity')
    sell_price = forms.DecimalField(max_digits=6, decimal_places=2, min_value=0, required=False,
                                    label='Sell Price')
    is_bike = forms.BooleanField(required=False, label='Should not show')
    replacement_part = forms.BooleanField(required=False, label='Alt')
    trade_in_price = forms.DecimalField(max_digits=6, decimal_places=2, min_value=0, required=False,
                                        label='Trade In')

    def __init__(self, *args, **kwargs):

        super(QuotePartForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['is_bike'].widget = HiddenInput()
        self.fields['brand'].choices = BLANK_CHOICE + get_brand_list_from_cache()
        self.fields['quantity'].widget = forms.TextInput(attrs={'size': '9'})
        self.fields['sell_price'].widget = forms.TextInput(attrs={'size': '9'})
        self.fields['trade_in_price'].widget = forms.TextInput(attrs={'size': '9'})

        if not self.initial['is_bike']:
            self.fields['replacement_part'].widget = HiddenInput()
            self.fields['trade_in_price'].widget = HiddenInput()

    def clean(self):
        cleaned_data = super(QuotePartForm, self).clean()
        part_type = cleaned_data.get('part_type')
        brand = cleaned_data.get('brand')
        part_name = cleaned_data.get('part_name')
        quantity = cleaned_data.get("quantity")
        replacement_part = cleaned_data.get('replacement_part')
        trade_in_price_empty = cleaned_data.get('trade_in_price') is None
        sell_price_not_empty = cleaned_data.get('sell_price') is not None

        # no fields are required but if any are present all must be
        if brand or part_name or quantity or sell_price_not_empty:
            if not (brand and part_type and part_name and quantity and sell_price_not_empty):
                raise forms.ValidationError("All data must be entered to add a new item to a quote.")

        if replacement_part:
            if trade_in_price_empty:
                self.add_error('trade_in_price',
                               'Trade in price required, can be zero, when part is substituted or omitted.')
            if not part_type:
                self.add_error('part_type',
                               'A part type must be specified, when part is substituted or omitted.')
            if part_type.can_be_substituted:
                if not part_type.can_be_omitted and not part_name:
                    self.add_error('part_type',
                                   'This part cannot be omitted.')
            else:
                self.add_error('part_type',
                               'This part cannot be substituted or omitted.')

        if not (trade_in_price_empty or replacement_part):
            self.add_error('trade_in_price',
                           'Trade in price should be blank when part is not substituted or omitted.')


# attributes for quote parts
class QuotePartAttributeForm(forms.Form):
    attribute_name = forms.CharField(required=False)
    attribute_value = forms.CharField(max_length=15, required=False)

    def __init__(self, *args, **kwargs):
        super(QuotePartAttributeForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['attribute_value'].widget = forms.TextInput(attrs={'size': '10'})
        self.fields['attribute_name'].widget = HiddenInput()


# includes notes for use on quotes for bikes
class QuoteFittingForm(forms.Form):
    # create choices for types

    fitting_type = forms.ChoiceField(label='Fitting Source', choices=FORM_FITTING_TYPE_CHOICES, required=False,
                                     label_suffix='')
    saddle_height = forms.CharField(label='Saddle Height', max_length="20", required=False)
    bar_height = forms.CharField(label='Bar Height', max_length="20", required=False)
    reach = forms.CharField(label='Reach', max_length="20", required=False)
    notes = forms.CharField(label='Notes', max_length="200", required=False)

    def __init__(self, *args, **kwargs):
        super(QuoteFittingForm, self).__init__(*args, **kwargs)
        self.fields['saddle_height'].widget = forms.TextInput(attrs={'size': '10'})
        self.fields['bar_height'].widget = forms.TextInput(attrs={'size': '10'})
        self.fields['reach'].widget = forms.TextInput(attrs={'size': '10'})
        self.label_suffix = ''

    def clean(self):
        cleaned_data = super(QuoteFittingForm, self).clean()
        fitting_type = cleaned_data.get("fitting_type")
        saddle_height = cleaned_data.get("saddle_height")
        bar_height = cleaned_data.get("bar_height")
        reach = cleaned_data.get("reach")

        # no fieldsare required but if any are present all must be
        if fitting_type or saddle_height or bar_height or reach:
            if not (fitting_type and saddle_height and bar_height and reach):
                raise forms.ValidationError("All measures must be entered to save a fitting.")
