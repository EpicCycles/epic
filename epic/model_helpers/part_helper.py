import logging

from epic.model_helpers.brand_helper import find_brand_for_name
from epic.models import Part


# given values try and create a part
def find_or_create_part(brand, part_type, part_name):
    part_possibles = Part.objects.filter(partType=part_type, brand=brand, part_name=part_name)
    if len(part_possibles) > 0:
        return part_possibles[0]
    else:
        part = Part.objects.create_part(part_type, brand, part_name)
        part.save()
        return part


# another try at creating the part
def validate_and_create_part(request, add_part_form):
    if add_part_form.cleaned_data['new_part_type'] is not None:
        brand = add_part_form.cleaned_data['new_brand']
        if brand is None:
            # look for a brand matching what has been entered for new_brand_add
            brand_name = add_part_form.cleaned_data['new_brand_add']
            brand = find_brand_for_name(brand_name, request)
            if brand is None:
                return

        partType = add_part_form.cleaned_data['new_part_type']
        part_name = add_part_form.cleaned_data['new_part_name']
        return find_or_create_part(brand, partType, part_name)

    else:
        return None
