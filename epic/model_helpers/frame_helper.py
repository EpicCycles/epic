from datetime import datetime
from django.core.cache import cache

from epic.models import Frame


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
