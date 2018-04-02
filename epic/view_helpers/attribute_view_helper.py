from epic.form_helpers.attributes import getAttributeForm, getAttributeFormUpdated
from epic.models import QuotePartAttribute
import logging
from django.contrib import messages


def build_quote_part_attribute_form(quote_part_attribute: QuotePartAttribute, with_prefix: bool):
    form_prefix = ""
    if with_prefix:
        form_prefix = "QPA" + str(quote_part_attribute.id)

    return getAttributeForm(quote_part_attribute, form_prefix)


# get form from request
def get_quote_part_attribute_form(request, quote_part_attribute: QuotePartAttribute, with_prefix: bool):
    form_prefix = ""
    if with_prefix:
        form_prefix = "QPA" + str(quote_part_attribute.id)
    return getAttributeFormUpdated(request.POST, request.FILES,quote_part_attribute, form_prefix)



# save for attributes from the form
def save_quote_part_attribute_form(request, quote_part_attribute, quote_part):
    quote_part_attribute_form = get_quote_part_attribute_form(request, quote_part_attribute, True)
    if quote_part_attribute_form:
        if quote_part_attribute_form.is_valid():
            attribute_value = quote_part_attribute_form.cleaned_data['attribute_value']
            if attribute_value == "":
                attribute_value = None

            if quote_part.part is None:
                if attribute_value and attribute_value != quote_part_attribute.partTypeAttribute.default_value_for_quote:
                    quote_part_attribute.attribute_value = None
                    quote_part_attribute.save()
                    messages.warning(request,
                                     f"Value removed for {str(quote_part_attribute.partTypeAttribute)} as no part is present")
                return build_quote_part_attribute_form(quote_part_attribute, True)

            if quote_part_attribute.partTypeAttribute.mandatory and attribute_value is None:
                quote_part_attribute_form.add_error('attribute_value',
                                                    "This attribute is mandatory. Please provide a value, may be 'As Fitted'")
                return quote_part_attribute_form

            if quote_part_attribute_form.has_changed():
                quote_part_attribute.attribute_value = attribute_value
                quote_part_attribute.save()
                return build_quote_part_attribute_form(quote_part_attribute, True)
        else:
            logging.getLogger("error_logger").error(quote_part_attribute_form.errors.as_json())
        return quote_part_attribute_form
