from epic.form_helpers.choices import get_part_section_list_from_cache, get_part_types_for_section_from_cache
from epic.models import QuotePart, FramePart


def quote_display(quote):
    part_sections = get_part_section_list_from_cache()
    part_list = []

    # build a list of parts, frame parts, substitued parts and additional parts
    for part_section in part_sections:
        part_types = get_part_types_for_section_from_cache(part_section)
        for part_type in part_types:
            if quote.frame:
                quote_substitute = QuotePart.objects.filter(quote=quote, part__partType=part_type, replacement_part=True) \
                    .prefetch_related('part', 'partType', 'part__brand').first()
                if quote_substitute:
                    part_list.append(quote_substitute.summary())
                else:
                    frame_part = FramePart.objects.filter(frame=quote.frame, part__partType=part_type) \
                        .prefetch_related('part', 'part__partType', 'part__brand').first()
                    if frame_part:
                        part_list.append(str(frame_part) + '(as Fitted)')

            quote_additions = QuotePart.objects.filter(quote=quote, part__partType=part_type, replacement_part=False)\
                .prefetch_related('part', 'part__partType', 'part__brand')
            for quote_part in quote_additions:
                if quote.frame:
                    part_list.append(quote_part.summary() + '(Extra)')
                else:
                    part_list.append(quote_part.summary())

    return part_list
