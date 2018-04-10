import debug_toolbar
from django.conf.urls import url
from django.urls import include

def get_debug_urls():
    debug_urls = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ]
    return debug_urls