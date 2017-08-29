# forms.py
from django import forms
from django.forms import ModelForm, CharField, ModelChoiceField
from django.forms.models import inlineformset_factory
from django.forms.widgets import HiddenInput

from .models import *

# useful documentation here - https://docs.djangoproject.com/en/1.10/topics/forms/

class CustomerForm(ModelForm):
    class Meta:
        model = Customer
        fields = ['first_name', 'last_name', 'email']

class ChangeCustomerForm(ModelForm):
     class Meta(CustomerForm.Meta):
         model = Customer
         fields = ['first_name', 'last_name', 'email']

AddressFormSet = inlineformset_factory(Customer, CustomerAddress,fields = '__all__')
PhoneFormSet = inlineformset_factory(Customer, CustomerPhone,fields = '__all__')
FittingFormSet = inlineformset_factory(Customer, Fitting,fields = ('fitting_type','saddle_height','bar_height','reach'))

class BrandForm(ModelForm):
    class Meta:
        model = Brand
        fields = '__all__'

class FrameForm(ModelForm):
    class Meta:
        model = Frame
        fields = '__all__'

class FramePartForm(ModelForm):
    class Meta:
        model = FramePart
        fields = '__all__'

class PartForm(ModelForm):
    class Meta:
        model = Part
        fields = '__all__'

class PartTypeForm(ModelForm):
    class Meta:
        model = PartType
        fields = '__all__'

# form for basic Quote details
class QuoteForm(ModelForm):
    class Meta:
        model = Quote
        fields = ['customer', 'quote_desc', 'quote_type', 'frame']
        # start of how to add fiting dropdown - contact_country = forms.ModelChoiceField(queryset=Country.objects.all())

    def clean(self):
        cleaned_data = super(QuoteForm, self).clean()
        quote_type = cleaned_data.get("quote_type")
        frame = cleaned_data.get("frame")

        # Only do something if both fields are valid so far.
        if quote_type == Quote.BIKE:
            if frame == None:
                # must have a frame if the quote type is BIKE
                msg = "Please select a frame or change the quote type."
                self.add_error('frame', msg)

# quote for a non bike based (items only)
class QuoteSimpleForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(QuoteSimpleForm, self).__init__(*args, **kwargs)
        self.fields['customer'].widget = HiddenInput()
        self.fields["quote_type"].widget = HiddenInput()
        self.fields["cost_price"].widget = HiddenInput()
        self.fields["sell_price"].widget = HiddenInput()
        self.fields['keyed_sell_price'].widget = forms.TextInput(attrs={'size': 6, 'title': 'Quote Price'})

    class Meta:
        model = Quote
        fields = ['customer', 'quote_type','quote_desc', 'cost_price', 'sell_price', 'keyed_sell_price']

# simple quote add item
class QuoteSimpleAddPartForm(forms.Form):
    new_brand = forms.ModelChoiceField(queryset=Brand.objects.all(),required=False,label='Brand')
    new_brand_add = forms.CharField(max_length=30,required=False,label='Add Brand')
    new_partType = forms.ModelChoiceField(queryset=PartType.objects.all().order_by('shortName'),required=False,label='Part Type')
    new_part_name = forms.CharField(max_length=60,required=False,label='Part Name')
    new_quantity = forms.IntegerField(max_value=9999, min_value=1,required=False,label='Quantity')
    new_cost_price = forms.DecimalField(max_digits=6,decimal_places=2,min_value=0.00,required=False,label='Cost Price')
    new_sell_price = forms.DecimalField(max_digits=6,decimal_places=2,min_value=0.00,required=False,label='Sell Price')

    def __init__(self, *args, **kwargs):
        super(QuoteSimpleAddPartForm, self).__init__(*args, **kwargs)
        self.fields['new_quantity'].widget = forms.TextInput(attrs={'size': 4, 'title': 'Qty'})
        self.fields['new_cost_price'].widget = forms.TextInput(attrs={'size': 6, 'title': 'Cost Price'})
        self.fields['new_sell_price'].widget = forms.TextInput(attrs={'size': 6, 'title': 'Sell Price'})

    def clean(self):
        cleaned_data = super(QuoteSimpleAddPartForm, self).clean()

        new_brand = cleaned_data.get("new_brand")
        new_brand_add = cleaned_data.get("new_brand_add")
        new_partType = cleaned_data.get("new_partType")
        new_part_name = cleaned_data.get("new_part_name")
        new_quantity = cleaned_data.get("new_quantity")
        new_cost_price = cleaned_data.get("new_cost_price")
        new_sell_price = cleaned_data.get("new_sell_price")

        # no fieldsare required but if any are present all must be
        if new_brand or new_brand_add or new_partType  or new_part_name or new_quantity or new_cost_price or new_sell_price:
            if not ( (new_brand or new_brand_add) and new_partType  and new_part_name and new_quantity):
                raise forms.ValidationError(
                    "All data must be entered to add a new item to a quote."
                )

        # must have only one of new_brand and new_brand_add
        if new_brand and new_brand_add:
            raise forms.ValidationError(
                "Either select an existing Brand or type a New Brand."
            )
        # if cost and sell price are entered sell price cannot be lower
        if new_cost_price and new_sell_price:
            # Only do something if both fields are valid so far.
            if new_sell_price < new_cost_price:
                raise forms.ValidationError(
                    "Selling price cannot be less than cost price."
                )

# quote for a  bike based (items only)
class QuoteBikeForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(QuoteBikeForm, self).__init__(*args, **kwargs)
        self.fields['customer'].widget = HiddenInput()
        self.fields['frame'].widget = HiddenInput()
        self.fields["quote_type"].widget = HiddenInput()
        self.fields["cost_price"].widget = HiddenInput()
        self.fields["sell_price"].widget = HiddenInput()
        self.fields['keyed_sell_price'].widget = forms.TextInput(attrs={'size': 6, 'title': 'Quote Price'})

    class Meta:
        model = Quote
        fields = ['customer','quote_type', 'quote_desc', 'frame','cost_price', 'sell_price', 'keyed_sell_price']
# basic quote kine for adding lines
class QuotePartBasicForm(ModelForm):
    class Meta:
        model = QuotePart
        fields = '__all__'

# change part on existing line
# simple quote add item
class QuoteBikeChangePartForm(forms.Form):
    new_brand = forms.CharField(max_length=60,required=False,label='Brand')
    new_part_name = forms.CharField(max_length=60,required=False,label='Part Name')
    new_quantity = forms.IntegerField(max_value=9999, min_value=1,required=False,label='Quantity')
    new_cost_price = forms.DecimalField(max_digits=6,decimal_places=2,min_value=0.00,required=False,label='Cost Price')
    new_sell_price = forms.DecimalField(max_digits=6,decimal_places=2,min_value=0.00,required=False,label='Sell Price')

    def __init__(self, *args, **kwargs):
        super(QuoteBikeChangePartForm, self).__init__(*args, **kwargs)
        self.fields['new_brand'].widget = forms.TextInput(attrs={'size': 30})
        self.fields['new_part_name'].widget = forms.TextInput(attrs={'size': 30})
        self.fields['new_quantity'].widget = forms.TextInput(attrs={'size': 4})
        self.fields['new_cost_price'].widget = forms.TextInput(attrs={'size': 6})
        self.fields['new_sell_price'].widget = forms.TextInput(attrs={'size': 6})

    def clean(self):
        cleaned_data = super(QuoteBikeChangePartForm, self).clean()

        new_brand = cleaned_data.get("new_brand")
        new_part_name = cleaned_data.get("new_part_name")
        new_quantity = cleaned_data.get("new_quantity")
        new_cost_price = cleaned_data.get("new_cost_price")
        new_sell_price = cleaned_data.get("new_sell_price")

        # no fieldsare required but if any are present all must be
        if new_brand or new_part_name or new_quantity or new_cost_price or new_sell_price:
            if not ( new_brand and new_part_name and new_quantity):
                raise forms.ValidationError(
                    "All data must be entered to update an item on a quote."
                )

        # if cost and sell price are entered sell price cannot be lower
        if new_cost_price and new_sell_price:
            # Only do something if both fields are valid so far.
            if new_sell_price < new_cost_price:
                raise forms.ValidationError(
                    "Selling price cannot be less than cost price."
                )

# fomr for use in inline formeset
class QuoteBikePartForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(QuoteBikePartForm, self).__init__(*args, **kwargs)
        self.fields['partType'].widget = HiddenInput()
        self.fields['frame_part'].widget = HiddenInput()
        self.fields['part'].widget = HiddenInput()
        self.fields['quantity'].widget = forms.TextInput(attrs={'size': 4, 'title': 'Qty'})
        self.fields['cost_price'].widget = forms.TextInput(attrs={'size': 6, 'title': 'Cost Price'})
        self.fields['sell_price'].widget = forms.TextInput(attrs={'size': 6, 'title': 'Sell Price'})
        if exp:
           self.fields['expiration'].initial = exp

    class Meta:
        model = QuotePart
        fields = ['partType','frame_part', 'part', 'quantity','cost_price', 'sell_price']

QuoteBikePartFormSet = inlineformset_factory(Quote, QuotePart, form=QuoteBikePartForm)

#form for use n u=inline frameset after
class QuotePartForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(QuotePartForm, self).__init__(*args, **kwargs)
        self.fields['partType'].widget = HiddenInput()
        self.fields['part'].widget = HiddenInput()

    class Meta:
        model = QuotePart
        fields = ['partType', 'part', 'quantity','cost_price', 'sell_price']

QuotePartFormSet = inlineformset_factory(Quote, QuotePart, form=QuotePartForm,extra=0)

# includes notes for use on quotes for bikes
class QuoteFittingForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(QuoteFittingForm, self).__init__(*args, **kwargs)
        self.fields['customer'].widget = HiddenInput()
    class Meta:
        model = Fitting
        fields = '__all__'
