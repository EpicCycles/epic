# forms.py

from django.forms import ModelForm, CharField
from django.forms.models import inlineformset_factory
from .models import Customer, CustomerAddress, CustomerPhone, Brand, Frame, FramePart, Part, PartType, Fitting, Quote

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
