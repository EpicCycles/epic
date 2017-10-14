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
    url(r'^myQuotes/$', views.MyQuoteList.as_view(), name='my_quote_list'),
    url(r'^editQuote/(?P<pk>\d+)/$', views.quote_edit, name='quote_edit'),
    url(r'^editQuoteBike/(?P<pk>\d+)/$', views.quote_edit_bike, name='quote_edit_bike'),
    url(r'^editQuoteSimple/(?P<pk>\d+)/$', views.quote_edit_simple, name='quote_edit_simple'),
    url(r'^copyQuote/(?P<pk>\d+)/$', views.copy_quote, name='copy_quote'),
    url(r'^copyQuoteBike/(?P<pk>\d+)/$', views.quote_copy_bike, name='quote_copy_bike'),
    url(r'^addQuote/$', views.add_quote, name='add_quote'),
    url(r'^issueQuote/(?P<pk>\d+)/$', views.quote_issue, name='quote_issue'),
    url(r'^browseQuote/(?P<pk>\d+)/$', views.quote_browse, name='quote_browse'),
    url(r'^reQuote/(?P<pk>\d+)/$', views.quote_requote, name='quote_requote'),
    url(r'^amendQuote/(?P<pk>\d+)/$', views.quote_amend, name='quote_amend'),
    url(r'^createOrder/(?P<pk>\d+)/$', views.quote_order, name='quote_order'),
    url(r'^orders/$', views.OrderList.as_view(), name='order_list'),
    url(r'^editOrder/(?P<pk>\d+)/$', views.order_edit, name='order_edit'),
    url(r'^viewCustomerNotes/(?P<pk>\d+)/$', views.view_customer_notes, name='view_customer_notes'),
    url(r'^selectCustomer/$', views.CustomerSelect.as_view(), name='select_customer'),
    url(r'^supplierOrderRequired/(?P<pk>\d+)/$', views.supplier_order_reqd, name='supplier_order_reqd'),
]
