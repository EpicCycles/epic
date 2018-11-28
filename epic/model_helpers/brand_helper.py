from django.contrib import messages
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist

from epic.models.brand_models import Brand, Part


def find_brand_for_string(search_string, brand_list, default_brand, request):
    found_brand = None
    for brand in brand_list:
        check_prefix = str(brand.brand_name).lower()
        if search_string.lower().startswith(check_prefix):
            if found_brand:
                if len(search_string) > len(found_brand.brand_name):
                    found_brand = brand
            else:
                found_brand = brand

    if found_brand:
        return found_brand
    else:
        match_parts = Part.objects.filter(part_name__upper=search_string)
        if match_parts.count() == 1:
            return match_parts[0].brand

    return default_brand


# common find brand
def find_brand_for_name(brand_name, request):
    if not brand_name:
        raise ValueError('Missing brand name')

    try:
        brand = Brand.objects.get(brand_name__upper=str(brand_name).strip())
        return brand
    except MultipleObjectsReturned:
        messages.error(request, "Brand Not unique - use Admin function to ensure Brands are unique: " + brand_name)
        return None
    except ObjectDoesNotExist:
        # create a new Brand
        brand = Brand(brand_name=brand_name)
        brand.save()
        return brand
