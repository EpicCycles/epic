from django.conf.urls import url
from django.urls import path

from epic.api_views.brands_api import Brands
from epic.api_views.customer_address_api import CustomerAddressList, CustomerAddressMaintain
from epic.api_views.customer_api import CustomerList, CustomerMaintain
from epic.api_views.customer_phone_api import CustomerPhoneList, CustomerPhoneMaintain
from epic.api_views.framework_api import Framework
from epic.api_views.section_api import PartSection
from epic.api_views.part_type_api import PartType
from epic.api_views.part_type_attribute_api import PartTypeAttribute
from epic.api_views.attribute_option_api import AttributeOptions

from epic.api_views.note_api import CustomerNoteList, CustomerNoteMaintain
from epic.api_views.supplier_api import Suppliers, MaintainSupplier
from epic.api_views.user_api import UserMaintain
from . import views

# good explanation of patterns here https://tutorial.djangogirls.org/en/extend_your_application/
urlpatterns = [url(r'^menu', views.menu_home, name='menu_home'),
               url(r'^customers/$', views.CustomerList.as_view(), name='customer_list'),  # html name in view
               url(r'^addCustomer/$', views.add_customer, name='add_customer'),
               url(r'^editCustomer/(?P<pk>\d+)/$', views.edit_customer, name='edit_customer'),
               url(r'^bikeUpload/$', views.bike_upload, name='bike_upload'),
               url(r'^bikeReview/$', views.bike_review, name='bike_review'),
               url(r'^quotes/$', views.QuoteList.as_view(), name='quote_list'),
               url(r'^myQuotes/$', views.MyQuoteList.as_view(), name='my_quote_list'),
               url(r'^editQuote/(?P<pk>\d+)/$', views.quote_edit, name='quote_edit'),
               url(r'^add_quote_part/(?P<pk>\d+)/$', views.add_quote_part, name='add_quote_part'),
               url(r'^quoteForCustomer/(?P<pk>\d+)/$', views.quote_for_customer, name='quote_for_customer'),
               url(r'^copyQuote/(?P<pk>\d+)/$', views.copy_quote, name='copy_quote'),
               url(r'^addQuote/$', views.add_quote, name='add_quote'),
               url(r'^quoteNewBike/$', views.quote_copy_with_changes, name='quote_change_frame'),
               url(r'^quoteWithChanges/$', views.quote_copy_with_changes, name='quote_copy_with_changes'),
               url(r'^issueQuote/(?P<pk>\d+)/$', views.quote_issue, name='quote_issue'),
               url(r'^browseQuote/(?P<pk>\d+)/$', views.quote_browse, name='quote_browse'),
               url(r'^reQuote/(?P<pk>\d+)/$', views.quote_requote, name='quote_requote'),
               url(r'^amendQuote/(?P<pk>\d+)/$', views.quote_amend, name='quote_amend'),
               url(r'^quoteSummary/(?P<pk>\d+)/$', views.quote_text, name='quote_text'),
               url(r'^viewCustomerNotes/(?P<pk>\d+)/$', views.view_customer_notes, name='view_customer_notes'),
               url(r'^selectCustomer/$', views.CustomerSelect.as_view(), name='select_customer'),
               url(r'^add_brand/$', views.add_brand, name='add_brand'),
               url(r'^add_customer_simple/$', views.add_customer_simple, name='add_customer_simple'),
               url(r'^create_model/$', views.create_model, name='create_model'),
               url(r'^bike_select_popup/$', views.bike_select_popup, name='bike_select_popup'),
               path('api/framework/', Framework.as_view()),
               path('api/brands/', Brands.as_view()),
               path('api/suppliers/', Suppliers.as_view()),
               path('api/supplier/<int:pk>', MaintainSupplier.as_view()),
               path('api/partsection/', PartSection.as_view()),
               path('api/partsection/<int:pk>', PartSection.as_view()),
               path('api/parttype/', PartType.as_view()),
               path('api/parttype/<int:pk>', PartType.as_view()),
               path('api/parttypeattribute/', PartTypeAttribute.as_view()),
               path('api/parttypeattribute/<int:pk>', PartTypeAttribute.as_view()),
               path('api/attributeoptions/', AttributeOptions.as_view()),
               path('api/attributeoptions/<int:pk>', AttributeOptions.as_view()),
               path('api/customers/', CustomerList.as_view()),
               path('api/customer/', CustomerList.as_view()),
               path('api/customer/<int:pk>', CustomerMaintain.as_view()),
               path('api/customernotes/', CustomerNoteList.as_view()),
               path('api/customernote/', CustomerNoteList.as_view()),
               path('api/customernote/<int:pk>', CustomerNoteMaintain.as_view()),
               path('api/customeraddress/', CustomerAddressList.as_view()),
               path('api/customeraddress/<int:pk>', CustomerAddressMaintain.as_view()),
               path('api/customerphone/', CustomerPhoneList.as_view()),
               path('api/customerphone/<int:pk>', CustomerPhoneMaintain.as_view()),
               path('api/user/<str:username>', UserMaintain.as_view()),
               ]
