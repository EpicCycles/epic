from datetime import datetime

from epic.models import Frame


def get_frames_for_js(place_to_add_to):
    frames_for_js = place_to_add_to.get('frames_for_js')
    if not frames_for_js:
        print('{timestamp} -- building frames for js started'.format(timestamp=datetime.utcnow().isoformat()))

        frames_for_js = []
        for frame in Frame.objects.all().prefetch_related('brand'):
            frames_for_js.append('{' + frame.getJavascriptObject() + '}')
        place_to_add_to['frames_for_js'] = frames_for_js
        print('{timestamp} -- building frames for js finished'.format(timestamp=datetime.utcnow().isoformat()))

    return frames_for_js
