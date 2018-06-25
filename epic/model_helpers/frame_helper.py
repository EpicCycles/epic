from datetime import datetime

from django.core.cache import cache

from epic.form_helpers.choices import get_part_section_list_from_cache, get_part_types_for_section_from_cache
from epic.models import Frame, FramePart


def set_frames_for_js():
    print('{timestamp} -- building frames for js started'.format(timestamp=datetime.utcnow().isoformat()))

    frames_for_js = []
    for frame in Frame.objects.filter(archived=False).prefetch_related('brand'):
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
    frame_part_list = {}

    all_parts_for_frame = FramePart.objects.filter(frame=frame).prefetch_related('part', 'part__brand')
    for frame_part in all_parts_for_frame:
        part_type = frame_part.part.partType
        if part_type in frame_part_list:
            frame_part_list[part_type].append(frame_part)
        else:
            frame_part_list[part_type] = [frame_part]
    for part_section in part_sections:
        part_types = get_part_types_for_section_from_cache(part_section)
        for part_type in part_types:
            if part_type in frame_part_list:
                part_list.append(str(frame_part_list[part_type][0]))
    return part_list
