from django.conf.urls import url
from . import views

# good explanation of patterns here https://tutorial.djangogirls.org/en/extend_your_application/
urlpatterns = [
    url(r'^$', views.quote_menu, name='quote_menu'),
    url(r'^customers/$', views.CustomerList.as_view(), name='customer_list'), # html name in view
    url(r'^addCustomer/$', views.add_customer, name='add_customer'),
    url(r'^editCustomer/(?P<pk>\d+)/$', views.edit_customer, name='edit_customer'),
    url(r'^bikeUpload/$', views.bike_upload, name='bike_upload'),
    url(r'^quotes/$', views.QuoteList.as_view(), name='quote_list'),
    url(r'^editQuoteBike/(?P<pk>\d+)/$', views.quote_edit_bike, name='quote_edit_bike'),
    url(r'^editQuoteSimple/(?P<pk>\d+)/$', views.quote_edit_simple, name='quote_edit_simple'),
    url(r'^copyQuote/(?P<pk>\d+)/$', views.copy_quote, name='copy_quote'),
    url(r'^addQuote/$', views.add_quote, name='add_quote'),
]
