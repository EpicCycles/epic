from django.contrib import messages
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist

from epic.models import Brand


def find_brand_for_string(search_string, brand_list, default_brand, request):
    for brand in brand_list:
        check_prefix = str(brand.brand_name).lower()
        if search_string.lower().startswith(check_prefix):
            return brand
    return default_brand


# common find brand
def find_brand_for_name(brand_name, request):
    try:
        brand = Brand.objects.get(brand_name=str(brand_name).strip())
        return brand
    except MultipleObjectsReturned:
        messages.error(request, "Brand Not unique - use Admin function to ensure Brands are unique: " + brand_name)
        return None
    except ObjectDoesNotExist:
        # create a new Brand
        brand = Brand(brand_name=brand_name)
        brand.save()
        return brand

