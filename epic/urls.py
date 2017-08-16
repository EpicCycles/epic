from django.conf.urls import url
from . import views

# good explanation of patterns here https://tutorial.djangogirls.org/en/extend_your_application/
urlpatterns = [
    url(r'^$', views.quote_menu, name='quote_menu'),
    url(r'^bikeUpload/$', views.bike_upload, name='bike_upload'),
]
