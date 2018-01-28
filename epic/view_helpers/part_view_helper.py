from epic.models import Part


def get_parts_for_js():
    parts = Part.objects.all()

    parts_for_js = []
    for part in parts:
        parts_for_js.append('{' + part.getJavascriptObject() + '}')

    return  parts_for_js