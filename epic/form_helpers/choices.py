from datetime import datetime
from django.core.cache import cache


def set_brand_list_in_cache():
    print('{timestamp} -- set_brand_list started'.format(timestamp=datetime.utcnow().isoformat()))

    from epic.models import Brand
    all_brands = Brand.objects.all()
    brand_list = []
    for brand in all_brands:
        brand_list.append([brand.id, brand.brand_name])
    print('{timestamp} -- set_brand_list ended'.format(timestamp=datetime.utcnow().isoformat()))
    cache.set('brand_list', brand_list)


def get_brand_list_from_cache():
    brand_list = cache.get('brand_list')
    if brand_list:
        return brand_list
    else:
        print('{timestamp} -- getting brand list from cache but it is not there'.format(
            timestamp=datetime.utcnow().isoformat()))
        set_brand_list_in_cache()
        return cache.get('brand_list')


def get_part_type_list_from_cache():
    part_type_list = cache.get('part_type_list')
    if part_type_list:
        return part_type_list
    else:
        print('{timestamp} -- getting part_type_list from cache but it is not there'.format(
            timestamp=datetime.utcnow().isoformat()))
        set_part_type_list_in_cache()
        return cache.get('part_type_list')


def set_part_type_list_in_cache():
    print('{timestamp} -- set_part_type_list_in_cache started'.format(timestamp=datetime.utcnow().isoformat()))
    from epic.models import PartType
    cache.set('part_type_list', PartType.objects.all().order_by('shortName'))
    print('{timestamp} -- set_part_type_list_in_cache ended'.format(timestamp=datetime.utcnow().isoformat()))


def get_part_section_list_from_cache():
    part_section_list = cache.get('part_section_list')
    if part_section_list:
        return part_section_list
    else:
        print('{timestamp} -- getting part_section_list from cache but it is not there'.format(
            timestamp=datetime.utcnow().isoformat()))
        set_part_section_list_in_cache()
        return cache.get('part_section_list')


def set_part_section_list_in_cache():
    print('{timestamp} -- set_part_section_list_in_cache started'.format(timestamp=datetime.utcnow().isoformat()))
    from epic.models import PartSection
    cache.set('part_section_list', PartSection.objects.all())
    print('{timestamp} -- set_part_section_list_in_cache ended'.format(timestamp=datetime.utcnow().isoformat()))

def get_part_types_for_section_from_cache(part_section):
    cache_id = f"part_types_for_{part_section.id}"
    part_type_list = cache.get(cache_id)
    if part_type_list:
        return part_type_list
    else:
        print('{timestamp} -- getting part_type list from cache but it is not there'.format(
            timestamp=datetime.utcnow().isoformat()))
        set_part_types_for_section_in_cache(part_section)
        return cache.get(cache_id)

def set_part_types_for_section_in_cache(part_section):
    print('{timestamp} -- set_part_types_for_section_in_cache started for section {part_section_string}'.format(timestamp=datetime.utcnow().isoformat(), part_section_string=str(part_section)))
    cache_id = f"part_types_for_{part_section.id}"
    from epic.models import PartType
    cache.set(cache_id, PartType.objects.filter(includeInSection=part_section))
    print('{timestamp} -- set_part_types_for_section_in_cache ended'.format(timestamp=datetime.utcnow().isoformat()))
