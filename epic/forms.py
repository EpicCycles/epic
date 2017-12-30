# forms.py
from django.utils.translation import ugettext_lazy as _
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
name_pattern = '[A-Za-z -]+'
postcode_pattern = '[A-Za-z]{1,2}[0-9]{1,2}[ ][0-9]{1,2}[A-Za-z]{1,2}'


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
        self.fields['first_name'].widget = forms.TextInput(
            attrs={'size': 20, 'minlength': 1, 'maxlength': 40, 'pattern': name_pattern})
        self.fields['last_name'].widget = forms.TextInput(
            attrs={'size': 30, 'minlength': 1, 'maxlength': 40, 'pattern': name_pattern})
        self.fields['email'].widget = forms.TextInput(
            attrs={'type': 'email', 'size': 50, 'minlength': 3, 'maxlength': 100})

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
        self.fields['postcode'].widget = forms.TextInput(attrs={'size': 10, 'pattern': postcode_pattern})


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
    saddle_height = forms.CharField(label='Saddle Height', max_length=20, required=False)
    bar_height = forms.CharField(label='Bar Height', max_length=20, required=False)
    reach = forms.CharField(label='Reach', max_length=20, required=False)

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
    search_frame = forms.ModelChoiceField(queryset=Frame.objects.all(), required=False, label='Frameset/Base Bike',
                                          label_suffix='')
    search_quote_desc = forms.CharField(max_length=30, required=False, label='Description Like')
    search_user = forms.ModelChoiceField(queryset=User.objects.all(), required=False, label='Created By',
                                         label_suffix='')

    def __init__(self, *args, **kwargs):
        super(QuoteSearchForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''


# form for searching for quotes
class FrameSearchForm(forms.Form):
    search_brand = forms.ModelChoiceField(queryset=Brand.objects.all(), required=False, label='Brand')
    search_name = forms.CharField(max_length=30, required=False, label='Name Like')

    def __init__(self, *args, **kwargs):
        super(FrameSearchForm, self).__init__(*args, **kwargs)
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
    search_frame = forms.ModelChoiceField(queryset=Frame.objects.all(), required=False, label='Frameset/Base Bike',
                                          label_suffix='')
    search_quote_desc = forms.CharField(max_length=30, required=False, label='Description Like')

    def __init__(self, *args, **kwargs):
        super(MyQuoteSearchForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''


# form for basic Quote details
class QuoteForm(ModelForm):
    class Meta:
        model = Quote
        fields = ['customer', 'quote_desc', 'quote_type', 'frame', 'frame_sell_price', 'colour', 'colour_price',
                  'frame_size']
        labels = {'frame': _('Frameset/Base Bike'), 'quote_desc': _('Quote Description'), 'quote_type': _('Type'),
                  'frame_sell_price': _('Base Sell Price £'), 'colour_price': _('Colour Additional Price £'),
                  'frame_size': _('Frame Size')}

    def __init__(self, *args, **kwargs):
        super(QuoteForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['customer'].widget = HiddenInput()
        self.fields['quote_type'].widget = forms.Select(attrs={'onchange': "changeQuoteType(this);"})
        self.fields['quote_type'].choices = FORM_QUOTE_TYPE_CHOICES

        if self.instance.quote_type is not BIKE:
            self.fields['frame'].widget.attrs['disabled'] = True
            self.fields['frame_sell_price'].widget.attrs['disabled'] = True
            self.fields['colour'].widget.attrs['disabled'] = True
            self.fields['colour_price'].widget.attrs['disabled'] = True
            self.fields['frame_size'].widget.attrs['disabled'] = True

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


class CustomerQuoteForm(QuoteForm):
    def __init__(self, *args, **kwargs):
        super(QuoteForm, self).__init__(*args, **kwargs)
        self.fields['customer'].widget = HiddenInput()
        self.fields['quote_desc'].required = False


class NewCustomerQuoteForm(QuoteForm):
    def __init__(self, *args, **kwargs):
        super(QuoteForm, self).__init__(*args, **kwargs)
        self.fields['customer'].widget = HiddenInput()
        self.fields['quote_desc'].required = False
        self.fields['customer'].required = False


# quote for a non bike based (items only)
class QuoteSimpleForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(QuoteSimpleForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields["sell_price"].widget = HiddenInput()
        self.fields['keyed_sell_price'].widget = forms.TextInput(attrs={'size': 6})

    class Meta:
        model = Quote
        fields = ['quote_desc', 'sell_price', 'keyed_sell_price']
        labels = {'sell_price': _('Total Price £'), 'quote_desc': _('Quote Description'), 'keyed_sell_price': _('Quote Price £')}


# simple quote add item
class QuoteSimpleAddPartForm(forms.Form):
    new_brand = forms.ModelChoiceField(queryset=Brand.objects.all(), required=False, label='Brand')
    new_part_type = forms.ModelChoiceField(queryset=PartType.objects.all().order_by('shortName'), required=False,
                                           label='Part Type')
    new_part_name = forms.CharField(max_length=60, required=False, label='Part Name')
    new_quantity = forms.IntegerField(max_value=9999, min_value=1, required=False, label='Quantity')
    new_sell_price = forms.DecimalField(max_digits=6, decimal_places=2, min_value=0.00, required=False,
                                        label='Sell Price')

    def __init__(self, *args, **kwargs):
        super(QuoteSimpleAddPartForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['new_quantity'].widget = forms.TextInput(attrs={'size': 4, 'title': 'Qty'})
        self.fields['new_sell_price'].widget = forms.TextInput(attrs={'size': 6, 'title': 'Sell Price'})

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
        self.fields['keyed_sell_price'].widget = forms.TextInput(attrs={'size': 9})
        self.fields['frame_sell_price'].widget = forms.TextInput(attrs={'size': 9})
        self.fields['colour_price'].widget = forms.TextInput(attrs={'size': 9})

    class Meta:
        model = Quote
        fields = ['customer', 'quote_type', 'quote_desc', 'frame', 'sell_price', 'keyed_sell_price', 'frame_sell_price',
                  'colour', 'colour_price', 'frame_size']
        labels = {'frame': _('Frameset/Base Bike'), 'quote_desc': _('Quote Description'), 'quote_type': _('Type'),
                  'frame_sell_price': _('Base Sell Price £'), 'colour_price': _('Colour Additional Price £'),
                  'frame_size': _('Frame Size'), 'sell_price': _('Total Price £'), 'keyed_sell_price': _('Quote Price £')}


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
    not_required = forms.BooleanField(required=False, label='None')
    can_be_substituted = forms.BooleanField(required=False, label='Subs')
    can_be_omitted = forms.BooleanField(required=False, label='Omit')
    trade_in_price = forms.DecimalField(max_digits=6, decimal_places=2, min_value=0.00, required=False,
                                        label='Trade In')
    new_brand = forms.ModelChoiceField(queryset=Brand.objects.all(), required=False, label='Brand')
    new_part_name = forms.CharField(max_length=60, required=False, label='Part Name')
    new_quantity = forms.IntegerField(max_value=9999, min_value=1, required=False, label='Quantity')
    new_sell_price = forms.DecimalField(max_digits=6, decimal_places=2, min_value=0.00, required=False,
                                        label='Sell Price')

    def __init__(self, *args, **kwargs):
        # pop out additional arguments added just for this!
        initialValues = kwargs.get('initial')

        super(QuoteBikeChangePartForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['can_be_substituted'].widget = HiddenInput()
        self.fields['can_be_omitted'].widget = HiddenInput()
        self.fields['new_part_name'].widget = forms.TextInput(attrs={'size': 20})
        self.fields['new_quantity'].widget = forms.TextInput(attrs={'size': 4})
        self.fields['new_sell_price'].widget = forms.TextInput(attrs={'size': 8})
        self.fields['trade_in_price'].widget = forms.TextInput(attrs={'size': 8})

        # modify the form to reflect the actual possibilities
        print(self.base_fields['new_part_name'])
        can_be_substituted = initialValues['can_be_substituted']
        can_be_omitted = initialValues['can_be_omitted']
        if not can_be_substituted:
            self.fields['new_brand'].widget.attrs['disabled'] = 'disabled'
            self.fields['new_part_name'].widget.attrs['disabled'] = 'disabled'
            self.fields['new_quantity'].widget.attrs['disabled'] = 'disabled'
            self.fields['new_sell_price'].widget.attrs['disabled'] = 'disabled'

        if not can_be_omitted:
            self.fields['not_required'].widget.attrs['disabled'] = 'disabled'

        if not (can_be_substituted or can_be_omitted):
            self.fields['trade_in_price'].widget.attrs['disabled'] = 'disabled'

    def clean(self):
        cleaned_data = super(QuoteBikeChangePartForm, self).clean()
        not_required = cleaned_data.get("not_required")
        new_brand = cleaned_data.get("new_brand")
        new_part_name = cleaned_data.get("new_part_name")
        new_quantity = cleaned_data.get("new_quantity")
        new_sell_price = cleaned_data.get("new_sell_price")
        trade_in_price = cleaned_data.get("trade_in_price")

        # no replacement part, and part not set to not required cannot hae trade-in price
        if trade_in_price and not (not_required or new_part_name):
            raise forms.ValidationError("Trade in price removed where parts not being omitted or substituted.")

        # no fields are required but if any are present all must be
        if new_brand or new_part_name or new_quantity or new_sell_price:
            if not_required:
                raise forms.ValidationError(
                    "Cannot have part not required and part details" + "Either set part to not required and remove "
                                                                       "part details," + " or untick the checkbox and"
                                                                                         " add part details to "
                                                                                         "replace the existing "
                                                                                         "values.")
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
    saddle_height = forms.CharField(label='Saddle Height', max_length=20, required=False)
    bar_height = forms.CharField(label='Bar Height', max_length=20, required=False)
    reach = forms.CharField(label='Reach', max_length=20, required=False)
    notes = forms.CharField(label='Notes', max_length=200, required=False)

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
        labels = {'customer_required_date': _('Customer Date'), 'final_date': _('Handover Date'),
                  'order_total': _('Order Total'), 'amount_due': _('Balance Outstanding'), }

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
        labels = {'frame': _('Frameset/Base Bike'), }

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


# Form for details of parts being ordered.
class OrderItemDetailForm(forms.Form):
    part = forms.HiddenInput()
    stock_item = forms.BooleanField(label='Stock Item')
    supplier = forms.ModelChoiceField(Supplier.objects)
    receipt_date = forms.DateField(label='Receipt Date')
    leadtime = forms.IntegerField(label='Leadtime (weeks)')
    cancel_item = forms.BooleanField(label='Cancel Item')
    supplier_order = forms.HiddenInput()
    order_date = forms.HiddenInput()

    def __init__(self, *args, **kwargs):
        super(OrderItemDetailForm, self).__init__(*args, **kwargs)
        stock_item = self.instance.stock_item
        supplier_order = self.instance.supplier_order
        if stock_item:
            self.fields['receipt_date'].widget.attrs['disabled'] = True

        if (stock_item or supplier_order):
            self.fields['supplier'].widget = HiddenInput()

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
    item_type = forms.ChoiceField(label='Type', choices=FORM_QUOTE_TYPE_CHOICES, required=False)
    item_id = forms.IntegerField(required=False)

    def __init__(self, *args, **kwargs):
        super(SupplierOrderPossibleForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''
        self.fields['item_description'].widget = HiddenInput()
        self.fields['quote_name'].widget = HiddenInput()
        self.fields['customer_name'].widget = HiddenInput()
        self.fields['item_type'].widget = HiddenInput()
        self.fields['item_id'].widget = HiddenInput()
