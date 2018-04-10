
from django.conf.urls import url
from django.urls import include

def get_debug_urls():
    import debug_toolbar
    debug_urls = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ]
    return debug_urls