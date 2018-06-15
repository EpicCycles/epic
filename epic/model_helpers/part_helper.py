from epic.model_helpers.brand_helper import find_brand_for_name
from epic.models import Part, Brand


# given values try and create a part
def find_or_create_part(brand, part_type, part_name):
    part_possibles = Part.objects.filter(partType=part_type, brand=brand, part_name=part_name)
    if len(part_possibles) > 0:
        return part_possibles[0]
    else:
        part = Part.objects.create_part(part_type, brand, part_name)
        part.save()
        return part
