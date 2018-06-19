from epic.form_helpers.choices import get_part_section_list_from_cache, get_part_types_for_section_from_cache
from epic.model_helpers.frame_helper import frame_display
from epic.models import QuotePart, FramePart


def quote_display(quote, customer_view):
    part_sections = get_part_section_list_from_cache()
    part_list = []
    frame_part_list = {}
    quote_part_list = {}
    quote_part_list_replacements = {}
    # build a list of parts, frame parts, substitued parts and additional parts

    quote_parts = QuotePart.objects.filter(quote=quote).prefetch_related('part', 'partType', 'part__brand')
    for quote_part in quote_parts:
        part_type = quote_part.partType
        if quote_part.replacement_part:
            if part_type in quote_part_list_replacements:
                quote_part_list_replacements[part_type].append(quote_part)
            else:
                quote_part_list_replacements[part_type] = [quote_part]
        else:
            if part_type in quote_part_list:
                quote_part_list[part_type].append(quote_part)
            else:
                quote_part_list[part_type] = [quote_part]

    if not quote_parts:
        if quote.frame:
            return frame_display(quote.frame)
        else:
            return part_list

    if quote.frame:
        frame_parts = FramePart.objects.filter(frame=quote.frame).prefetch_related('part', 'part__partType',
                                                                                   'part__brand')
        for frame_part in frame_parts:
            part_type = frame_part.part.partType
            if part_type in frame_part_list:
                frame_part_list[part_type].append(frame_part)
            else:
                frame_part_list[part_type] = [frame_part]

    for part_section in part_sections:
        part_types = get_part_types_for_section_from_cache(part_section)
        for part_type in part_types:
            do_not_show_part = customer_view
            if quote.frame:
                frame_part = None
                quote_substitute = None
                if part_type in frame_part_list:
                    frame_part = frame_part_list[part_type][0]
                if part_type in quote_part_list_replacements:
                    quote_substitute = quote_part_list_replacements[part_type][0]

                if quote_substitute:
                    if customer_view:
                        part_list.append(str(quote_substitute) + '(Replacement for ' + str(frame_part.part) + ')')
                    else:
                        part_list.append(quote_substitute.summary())
                else:
                    if part_type.customer_facing:
                        do_not_show_part = False

                    if not do_not_show_part:
                        if frame_part:
                            part_list.append(str(frame_part) + '(as Fitted)')
            if part_type in quote_part_list:
                for quote_part in quote_part_list[part_type]:
                    if quote.frame:
                        part_list.append(quote_part.summary() + '(Extra)')
                    else:
                        part_list.append(quote_part.summary())

    return part_list
