from datetime import datetime

from epic.models import Part


def get_parts_for_js():
    print('{timestamp} -- get_parts_for_js started'.format(timestamp=datetime.utcnow().isoformat()))

    parts = Part.objects.all().prefetch_related('brand', 'partType')

    parts_for_js = []
    for part in parts:
        parts_for_js.append('{' + part.getJavascriptObject() + '}')

    print('{timestamp} -- get_parts_for_js finished'.format(timestamp=datetime.utcnow().isoformat()))
    return parts_for_js
