# forms.py
from django import forms
from django.contrib.auth.models import User
from django.forms import ModelForm
from django.forms.models import inlineformset_factory
from django.forms.widgets import HiddenInput
from django.forms.widgets import SelectDateWidget

from .models import *

# useful documentation here - https://docs.djangoproject.com/en/1.10/topics/forms/
# global variables for forms
FORM_FITTING_TYPE_CHOICES = list(FITTING_TYPE_CHOICES)
FORM_FITTING_TYPE_CHOICES.insert(0, (None, '---------'))
FORM_NUMBER_TYPE_CHOICES = list(NUMBER_TYPE_CHOICES)
FORM_NUMBER_TYPE_CHOICES.insert(0, (None, '----'))
FORM_QUOTE_TYPE_CHOICES = list(QUOTE_TYPE_CHOICES)
FORM_QUOTE_TYPE_CHOICES.insert(0, (None, '-----'))


class CustomerForm(ModelForm):
    class Meta:
        model = Customer
        fields = ['first_name', 'last_name', 'email']

    def __init__(self, *args, **kwargs):
        super(CustomerForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''


class ChangeCustomerForm(ModelForm):
    class Meta(CustomerForm.Meta):
        model = Customer
        fields = ['first_name', 'last_name', 'email']

    def __init__(self, *args, **kwargs):
        super(ChangeCustomerForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''


class AddressForm(ModelForm):
    class Meta:
        model = CustomerAddress
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(AddressForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['address1'].widget = forms.TextInput(attrs={'size': 30})
        self.fields['address2'].widget = forms.TextInput(attrs={'size': 20})
        self.fields['address3'].widget = forms.TextInput(attrs={'size': 15})
        self.fields['address4'].widget = forms.TextInput(attrs={'size': 15})
        self.fields['postcode'].widget = forms.TextInput(attrs={'size': 10})


# Form for phone details
class PhoneForm(ModelForm):
    class Meta:
        model = CustomerPhone
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(PhoneForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['telephone'].widget = forms.TextInput(attrs={'size': 15})


# form for full fitting details
class FittingForm(ModelForm):
    # create choices for types
    fitting_type = forms.ChoiceField(label='Fitting Source', choices=FORM_FITTING_TYPE_CHOICES, required=False,
                                     label_suffix='')
    saddle_height = forms.CharField(label='Saddle Height', max_length=20, required=False, label_suffix='')
    bar_height = forms.CharField(label='Bar Height', max_length=20, required=False, label_suffix='')
    reach = forms.CharField(label='Reach', max_length=20, required=False, label_suffix='')

    class Meta:
        model = Fitting
        fields = ('fitting_type', 'saddle_height', 'bar_height', 'reach')

    def __init__(self, *args, **kwargs):
        super(FittingForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['saddle_height'].widget = forms.TextInput(attrs={'size': 10})
        self.fields['bar_height'].widget = forms.TextInput(attrs={'size': 10})
        self.fields['reach'].widget = forms.TextInput(attrs={'size': 10})

    def clean(self):
        cleaned_data = super(FittingForm, self).clean()
        fitting_type = cleaned_data.get("fitting_type")
        saddle_height = cleaned_data.get("saddle_height")
        bar_height = cleaned_data.get("bar_height")
        reach = cleaned_data.get("reach")

        # no fieldsare required but if any are present all must be
        if ((fitting_type != '') or (saddle_height != '') or (bar_height != '') or (reach != '')) and not (
                            fitting_type and saddle_height and bar_height and reach):
            raise forms.ValidationError("All measures must be entered to save a fitting.")


AddressFormSet = inlineformset_factory(Customer, CustomerAddress, form=AddressForm, extra=1)
PhoneFormSet = inlineformset_factory(Customer, CustomerPhone, form=PhoneForm, extra=1)
FittingFormSet = inlineformset_factory(Customer, Fitting, form=FittingForm, extra=1)


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


# form for searching for quotes
class QuoteSearchForm(forms.Form):
    search_frame = forms.ModelChoiceField(queryset=Frame.objects.all(), required=False, label='Bike/Frame',
                                          label_suffix='')
    search_quote_desc = forms.CharField(max_length=30, required=False, label='Description Like', label_suffix='')
    search_user = forms.ModelChoiceField(queryset=User.objects.all(), required=False, label='Created By',
                                         label_suffix='')

    def __init__(self, *args, **kwargs):
        super(QuoteSearchForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''


# Get back quotes for the current user
class MyQuoteSearchForm(forms.Form):
    search_frame = forms.ModelChoiceField(queryset=Frame.objects.all(), required=False, label='Bike/Frame',
                                          label_suffix='')
    search_quote_desc = forms.CharField(max_length=30, required=False, label='Description Like', label_suffix='')

    def __init__(self, *args, **kwargs):
        super(MyQuoteSearchForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''


# form for basic Quote details
class QuoteForm(ModelForm):
    class Meta:
        model = Quote
        fields = ['customer', 'quote_desc', 'quote_type', 'frame']

    def __init__(self, *args, **kwargs):
        super(QuoteForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['quote_type'].widget = forms.Select(attrs={'onchange': "changeQuoteType(this);"})
        self.fields['quote_type'].choices = FORM_QUOTE_TYPE_CHOICES;


    def clean(self):
        cleaned_data = super(QuoteForm, self).clean()
        quote_desc = cleaned_data.get("quote_desc")
        quote_type = cleaned_data.get("quote_type")
        frame = cleaned_data.get("frame")

        # Only do something if both fields are valid so far.
        if (quote_type != '') or (quote_desc != ''):
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
                    msg = "Please select a frame or change the quote type."
                    self.add_error('frame', msg)


# quote adding for a customer
class CustomerQuoteForm(forms.Form):
    quote_desc = forms.CharField(label='Quote Description', max_length=30, required=False, label_suffix='')
    quote_type = forms.ChoiceField(label='Type', label_suffix='', choices=FORM_QUOTE_TYPE_CHOICES, required=False, widget=forms.Select(attrs={'onchange' : "changeQuoteType();"}))
    frame = forms.ModelChoiceField(label='Bike/Frame', queryset=Frame.objects.all(), required=False, label_suffix='')

    def __init__(self, *args, **kwargs):
        super(CustomerQuoteForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''

    def clean(self):
        cleaned_data = super(CustomerQuoteForm, self).clean()
        quote_desc = cleaned_data.get("quote_desc")
        quote_type = cleaned_data.get("quote_type")
        frame = cleaned_data.get("frame")

        # Only do something if both fields are valid so far.
        if (quote_type != '') or (quote_desc != ''):
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
                    msg = "Please select a frame or change the quote type."
                    self.add_error('frame', msg)


# quote for a non bike based (items only)
class QuoteSimpleForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(QuoteSimpleForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        # self.fields['customer'].widget = HiddenInput()
        # self.fields["quote_type"].widget = HiddenInput()
        self.fields["sell_price"].widget = HiddenInput()
        self.fields['keyed_sell_price'].widget = forms.TextInput(attrs={'size': 6, 'title': 'Quote Price'})

    class Meta:
        model = Quote
        fields = ['quote_desc', 'sell_price', 'keyed_sell_price']


# simple quote add item
class QuoteSimpleAddPartForm(forms.Form):
    new_brand = forms.ModelChoiceField(queryset=Brand.objects.all(), required=False, label='Brand', label_suffix='')
    new_brand_add = forms.CharField(max_length=30, required=False, label='Add Brand', label_suffix='')
    new_part_type = forms.ModelChoiceField(queryset=PartType.objects.all().order_by('shortName'), required=False,
                                           label='Part Type', label_suffix='')
    new_part_name = forms.CharField(max_length=60, required=False, label='Part Name', label_suffix='')
    new_quantity = forms.IntegerField(max_value=9999, min_value=1, required=False, label='Quantity', label_suffix='')
    new_sell_price = forms.DecimalField(max_digits=6, decimal_places=2, min_value=0.00, required=False,
                                        label='Sell Price', label_suffix='')

    def __init__(self, *args, **kwargs):
        super(QuoteSimpleAddPartForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['new_quantity'].widget = forms.TextInput(attrs={'size': 4, 'title': 'Qty'})
        self.fields['new_sell_price'].widget = forms.TextInput(attrs={'size': 6, 'title': 'Sell Price'})

    def clean(self):
        cleaned_data = super(QuoteSimpleAddPartForm, self).clean()

        new_brand = cleaned_data.get("new_brand")
        new_brand_add = cleaned_data.get("new_brand_add")
        new_part_type = cleaned_data.get("new_part_type")
        new_part_name = cleaned_data.get("new_part_name")
        new_quantity = cleaned_data.get("new_quantity")
        new_sell_price = cleaned_data.get("new_sell_price")

        # no fieldsare required but if any are present all must be
        if (new_brand or new_brand_add or new_part_type or new_part_name or new_quantity or new_sell_price) and not (
                            (new_brand or new_brand_add) and new_part_type and new_part_name and new_quantity):
            raise forms.ValidationError("All data must be entered to add a new item to a quote.")
        # must have only one of new_brand and new_brand_add
        if new_brand and new_brand_add:
            raise forms.ValidationError("Either select an existing Brand or type a New Brand.")


# quote for a  bike based (items only)
class QuoteBikeForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(QuoteBikeForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['customer'].widget = HiddenInput()
        self.fields['frame'].widget = HiddenInput()
        self.fields["quote_type"].widget = HiddenInput()
        self.fields["sell_price"].widget = HiddenInput()
        self.fields['keyed_sell_price'].widget = forms.TextInput(attrs={'size': 9})
        self.fields['frame_sell_price'].widget = forms.TextInput(attrs={'size': 9})

    class Meta:
        model = Quote
        fields = ['customer', 'quote_type', 'quote_desc', 'frame', 'sell_price', 'keyed_sell_price', 'frame_sell_price']

class QuoteFrameForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(QuoteFrameForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['quote'].widget = HiddenInput()

    class Meta:
        model = QuoteFrame
        fields = '__all__'


# basic quote kine for adding lines
class QuotePartBasicForm(ModelForm):
    class Meta:
        model = QuotePart
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(QuotePartBasicForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''


# change part on existing line
# simple quote add item
class QuoteBikeChangePartForm(forms.Form):
    not_required = forms.BooleanField(required=False, label='None', label_suffix='')
    new_brand = forms.CharField(max_length=60, required=False, label='Brand', label_suffix='')
    new_part_name = forms.CharField(max_length=60, required=False, label='Part Name', label_suffix='')
    new_quantity = forms.IntegerField(max_value=9999, min_value=1, required=False, label='Quantity', label_suffix='')
    new_sell_price = forms.DecimalField(max_digits=6, decimal_places=2, min_value=0.00, required=False,
                                        label='Sell Price', label_suffix='')

    def __init__(self, *args, **kwargs):
        # pop out additional arguments added just for this!
        can_be_substituted = kwargs.pop('can_be_substituted', False)
        can_be_omitted = kwargs.pop('can_be_omitted', False)

        super(QuoteBikeChangePartForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['new_brand'].widget = forms.TextInput(attrs={'size': 20})
        self.fields['new_part_name'].widget = forms.TextInput(attrs={'size': 20})
        self.fields['new_quantity'].widget = forms.TextInput(attrs={'size': 4})
        self.fields['new_sell_price'].widget = forms.TextInput(attrs={'size': 8})

        # modify the form to reflect the actual possibilities

        if can_be_substituted != True:
            self.fields['new_brand'].widget.attrs['disabled'] = 'disabled'
            self.fields['new_part_name'].widget.attrs['disabled'] = 'disabled'
            self.fields['new_quantity'].widget.attrs['disabled'] = 'disabled'
            self.fields['new_sell_price'].widget.attrs['disabled'] = 'disabled'

        if can_be_omitted != True:
            self.fields['not_required'].widget.attrs['disabled'] = 'disabled'

    def clean(self):
        cleaned_data = super(QuoteBikeChangePartForm, self).clean()
        not_required = cleaned_data.get("not_required")
        new_brand = cleaned_data.get("new_brand")
        new_part_name = cleaned_data.get("new_part_name")
        new_quantity = cleaned_data.get("new_quantity")
        new_sell_price = cleaned_data.get("new_sell_price")

        # no fieldsare required but if any are present all must be
        if new_brand or new_part_name or new_quantity or new_sell_price:
            if not_required:
                raise forms.ValidationError(
                    "Cannot have part not required and part detsils" + "Either set part to not required and remove part details," + " or untick the checkbox and add part details to replace the existing values.")
            elif not (new_brand and new_part_name and new_quantity):
                raise forms.ValidationError("All data must be entered to update an item on a quote.")


# fomr for use in inline formeset
class QuoteBikePartForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(QuoteBikePartForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['partType'].widget = HiddenInput()
        self.fields['frame_part'].widget = HiddenInput()
        self.fields['part'].widget = HiddenInput()
        self.fields['quantity'].widget = forms.TextInput(attrs={'size': 4})
        self.fields['sell_price'].widget = forms.TextInput(attrs={'size': 6})

    class Meta:
        model = QuotePart
        fields = ['partType', 'frame_part', 'part', 'quantity', 'sell_price']


# form for use n u=inline frameset after
class QuotePartForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(QuotePartForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['partType'].widget = HiddenInput()
        self.fields['part'].widget = HiddenInput()

    class Meta:
        model = QuotePart
        fields = ['partType', 'part', 'quantity', 'sell_price']


# attributes for quote parts
class QuotePartAttributeForm(forms.Form):
    attribute_name = forms.CharField(required=False)
    attribute_value = forms.CharField(max_length=15, required=False)

    def __init__(self, *args, **kwargs):
        super(QuotePartAttributeForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['attribute_value'].widget = forms.TextInput(attrs={'size': 10})
        self.fields['attribute_name'].widget = HiddenInput()


# includes notes for use on quotes for bikes
class QuoteFittingForm(forms.Form):
    # create choices for types

    fitting_type = forms.ChoiceField(label='Fitting Source', choices=FORM_FITTING_TYPE_CHOICES, required=False,
                                     label_suffix='')
    saddle_height = forms.CharField(label='Saddle Height', max_length=20, required=False, label_suffix='')
    bar_height = forms.CharField(label='Bar Height', max_length=20, required=False, label_suffix='')
    reach = forms.CharField(label='Reach', max_length=20, required=False, label_suffix='')
    notes = forms.CharField(label='Notes', max_length=200, required=False, label_suffix='')

    def __init__(self, *args, **kwargs):
        super(QuoteFittingForm, self).__init__(*args, **kwargs)
        self.fields['saddle_height'].widget = forms.TextInput(attrs={'size': 10})
        self.fields['bar_height'].widget = forms.TextInput(attrs={'size': 10})
        self.fields['reach'].widget = forms.TextInput(attrs={'size': 10})
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


# Customer Order related forms
# form for searching for orders
class OrderSearchForm(forms.Form):
    complete_order = forms.BooleanField(required=False, label='Complete Orders')
    balance_outstanding = forms.BooleanField(required=False, label='Has outstanding balance')
    cancelled_order = forms.BooleanField(required=False, label='Cancelled Orders')
    lower_limit = forms.DecimalField(required=False, label='Total greater than')

    def __init__(self, *args, **kwargs):
        super(OrderSearchForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''


# edit order details
class CustomerOrderForm(ModelForm):
    class Meta:
        model = CustomerOrder
        fields = ['customer_required_date', 'final_date', 'order_total', 'amount_due']

    def __init__(self, *args, **kwargs):
        super(CustomerOrderForm, self).__init__(*args, **kwargs)
        self.fields['order_total'].widget = HiddenInput()
        self.fields['amount_due'].widget = HiddenInput()
        self.fields['customer_required_date'].widget = SelectDateWidget()
        self.fields['final_date'].widget = SelectDateWidget()

        self.label_suffix = ''


# Form for details of frames being ordered.
class OrderFrameForm(ModelForm):
    class Meta:
        model = OrderFrame
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(OrderFrameForm, self).__init__(*args, **kwargs)
        self.fields['customerOrder'].widget = HiddenInput()
        self.fields['frame'].widget = HiddenInput()
        self.fields['supplierOrderItem'].widget = HiddenInput()
        self.fields['quote'].widget = HiddenInput()
        self.label_suffix = ''


# Form for details of parts being ordered.
class OrderItemForm(ModelForm):
    class Meta:
        model = OrderItem
        fields = ['customerOrder', 'part', 'supplier', 'leadtime', 'receipt_date']

    def __init__(self, *args, **kwargs):
        super(OrderItemForm, self).__init__(*args, **kwargs)
        self.fields['customerOrder'].widget = HiddenInput()
        self.fields['part'].widget = HiddenInput()
        self.fields['receipt_date'].widget = SelectDateWidget()
        self.label_suffix = ''


# Form for a new payment
class OrderPaymentForm(forms.Form):
    payment_amount = forms.DecimalField(max_digits=6, decimal_places=2, min_value=0.00, required=False, label='Amount')
    amount_due = forms.DecimalField(required=False)

    def __init__(self, *args, **kwargs):
        super(OrderPaymentForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['payment_amount'].widget = forms.TextInput(attrs={'size': 6})
        self.fields['amount_due'].widget = HiddenInput()

    # validate the data input
    def clean(self):
        cleaned_data = super(OrderPaymentForm, self).clean()
        payment_amount = cleaned_data.get("payment_amount")
        amount_due = cleaned_data.get("amount_due")

        if payment_amount and (payment_amount > amount_due):
            # cannot over pay
            msg = "Amount is greater than the outstanding balance."
            self.add_error('payment_amount', msg)


# Form for Supplier order
class SupplierOrderForm(ModelForm):
    class Meta:
        model = SupplierOrder
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(SupplierOrderForm, self).__init__(*args, **kwargs)
        self.fields['supplier'].widget = HiddenInput()
        self.fields['date_placed'].widget = SelectDateWidget()
        self.label_suffix = ''


# Form for possible items for a supplier orderSearchForm
class SupplierOrderPossibleForm(forms.Form):
    item_description = forms.CharField(required=False)
    quote_name = forms.CharField(required=False)
    customer_name = forms.CharField(required=False)
    add_to_order = forms.BooleanField(required=False, label='Ordered')
    item_type = forms.ChoiceField(label='Type', label_suffix='', choices=FORM_QUOTE_TYPE_CHOICES, required=False)
    item_id = forms.IntegerField(required=False)

    def __init__(self, *args, **kwargs):
        super(SupplierOrderPossibleForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['item_description'].widget = HiddenInput()
        self.fields['quote_name'].widget = HiddenInput()
        self.fields['customer_name'].widget = HiddenInput()
        self.fields['item_type'].widget = HiddenInput()
        self.fields['item_id'].widget = HiddenInput()
