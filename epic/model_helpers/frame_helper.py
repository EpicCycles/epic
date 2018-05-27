from datetime import datetime
from django.core.cache import cache

from epic.form_helpers.choices import get_part_section_list_from_cache, get_part_types_for_section_from_cache
from epic.models import Frame, FramePart


def set_frames_for_js():
    print('{timestamp} -- building frames for js started'.format(timestamp=datetime.utcnow().isoformat()))

    frames_for_js = []
    for frame in Frame.objects.all().prefetch_related('brand'):
        frames_for_js.append('{' + frame.getJavascriptObject() + '}')
    cache.set('frames_for_js', frames_for_js)
    print('{timestamp} -- building frames for js finished'.format(timestamp=datetime.utcnow().isoformat()))


def get_frames_for_js():
    frames_for_js = cache.get('frames_for_js')

    if frames_for_js:
        return frames_for_js
    else:
        set_frames_for_js()
        return cache.get('frames_for_js')


def frame_display(frame):
    part_sections = get_part_section_list_from_cache()
    part_list = []

    all_parts_for_frame = FramePart.objects.filter(frame=frame)
    for part_section in part_sections:
        part_types = get_part_types_for_section_from_cache(part_section)
        for part_type in part_types:
            frame_part = all_parts_for_frame.filter(part__partType=part_type) \
                .prefetch_related('part', 'part__brand').first()
            if frame_part:
                part_list.append(str(frame_part))

    return part_list
