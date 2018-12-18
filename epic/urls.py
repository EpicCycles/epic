from django.urls import path

from epic.api_views.bike_api import Frames, FrameUpload, BikeParts, BikeMaintain
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

# good explanation of patterns here https://tutorial.djangogirls.org/en/extend_your_application/
urlpatterns = [path('api/framework/', Framework.as_view()),
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
               path('api/frames/', Frames.as_view()),
               path('api/frames/<int:pk>', Frames.as_view()),
               path('api/frame/upload/', FrameUpload.as_view()),
               path('api/bike/<int:bikeId>/parts/', BikeParts.as_view()),
               path('api/bike/<int:pk>', BikeMaintain.as_view()),
               ]
