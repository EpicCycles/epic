from django.urls import reverse
from django import template
from django.utils.safestring import mark_safe

register = template.Library()
add_brand_url = reverse('add_brand')


@register.filter(name='getBrandLink', is_safe=True)
def getBrandLink(form_field):
    brand_link = ''
    field_type = form_field.field.widget.input_type
    field_id = form_field.id_for_label
    if field_type is 'select' and field_id.count('brand') > 0:
        brand_link = '<i class="material-icons red"  id="brand_add_link" onclick="popupSelector(\'' + add_brand_url + '\', \'Add Brand\', \'brandSelectorId\', \'' + field_id + '\')">add_box</i>'
    return mark_safe(brand_link)