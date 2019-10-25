"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.urls import include, re_path

from mysite import settings, debugUrls

urlpatterns = [
    re_path(r'^admin/', admin.site.urls),
    re_path(r'', admin.site.urls),
    re_path(r'^api-auth/', include('rest_framework.urls')),
    re_path(r'^rest-auth/', include('rest_auth.urls')),
    re_path(r'rest-epic/', include('epic.urls')),
]
# if settings.CURRENT_ENV == 'TEST' and settings.DEBUG:
#     urlpatterns = debugUrls.get_debug_urls() + urlpatterns
