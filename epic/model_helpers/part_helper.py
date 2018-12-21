from epic.models.brand_models import Part


# given values try and create a part
def find_or_create_part(brand, part_type, part_name, do_not_create):
    part_possibles = Part.objects.filter(partType=part_type, brand=brand, part_name__upper=part_name)
    if len(part_possibles) > 0:
        return part_possibles[0]
    else:
        if do_not_create:
            return None

        part = Part.objects.create_part(part_type, brand, part_name)
        part.save()
        return part
