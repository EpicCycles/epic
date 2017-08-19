# forms.py
from django import forms
from django.forms import ModelForm, CharField, ModelChoiceField
from django.forms.models import inlineformset_factory
from .models import *

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
        self.fields['customer'].widget.attrs['readonly'] = True

    class Meta:
        model = Quote
        fields = ['customer', 'quote_desc']

# quote for a  bike based (items only)
class QuoteBikeForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(QuoteSimpleForm, self).__init__(*args, **kwargs)
        self.fields['customer'].widget.attrs['readonly'] = True
        self.fields['frame'].widget.attrs['readonly'] = True

    class Meta:
        model = Quote
        fields = ['customer', 'quote_desc', 'frame']
# fomr for use in inline formeset
class QuoteBikePartForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(QuoteBikePartForm, self).__init__(*args, **kwargs)
        self.fields['partType'].widget.attrs['readonly'] = True
        self.fields['frame_part'].widget.attrs['readonly'] = True

    class Meta:
        model = QuotePart
        fields = ['partType','frame_part', 'part', 'quantity','cost_price', 'sell_price']

QuoteBikePartFormSet = inlineformset_factory(Quote, QuotePart, form=QuoteBikePartForm)

#form for use n u=inline frameset after
class QuotePartForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(QuotePartForm, self).__init__(*args, **kwargs)
        self.fields['partType'].widget.attrs['readonly'] = True

    class Meta:
        model = QuotePart
        fields = ['partType', 'part', 'quantity','cost_price', 'sell_price']

QuotePartFormSet = inlineformset_factory(Quote, QuotePart, form=QuotePartForm)

# includes notes for use on quotes for bikes
class QuoteFittingForm(ModelForm):
    class Meta:
        model = Fitting
        fields = ['fitting_type','saddle_height','bar_height','reach','notes']
