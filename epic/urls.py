from django.urls import path

from epic.api_views.attribute_option_api import AttributeOptions
from epic.api_views.bike_api import Frames, FrameUpload, BikeParts, Bikes
from epic.api_views.brands_api import Brands
from epic.api_views.customer_address_api import CustomerAddressList, CustomerAddressMaintain
from epic.api_views.customer_api import CustomerList, CustomerMaintain
from epic.api_views.customer_phone_api import CustomerPhoneList, CustomerPhoneMaintain
from epic.api_views.framework_api import Framework
from epic.api_views.note_api import CustomerNoteList, CustomerNoteMaintain
from epic.api_views.part_api import Parts, parts_and_supplier_parts, PartMaintain, SupplierProductMaintain
from epic.api_views.part_type_api import PartType
from epic.api_views.part_type_attribute_api import PartTypeAttribute
from epic.api_views.quote_api import QuotesApi, QuoteMaintain, QuoteCopy, QuoteArchive, QuoteUnArchive, \
    QuoteRecalculate, QuoteIssue
from epic.api_views.quote_part_api import QuotePartMaintain
from epic.api_views.section_api import PartSection
from epic.api_views.supplier_api import Suppliers, MaintainSupplier
from epic.api_views.user_api import CustomAuthToken, UserApi

# good explanation of patterns here https://tutorial.djangogirls.org/en/extend_your_application/
urlpatterns = [
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
    path('api/api-token-auth/', CustomAuthToken.as_view()),
    path('api/parts/', Parts.as_view()),
    path('api/part/', PartMaintain.as_view()),
    path('api/part/<int:part_id>/', PartMaintain.as_view()),
    path('api/supplier-product/', SupplierProductMaintain.as_view()),
    path('api/supplier-product/<int:supplier_product_id>/', SupplierProductMaintain.as_view()),
    path('api/frames/', Frames.as_view()),
    path('api/frames/<int:frame_id>/', Frames.as_view()),
    path('api/frame/upload/', FrameUpload.as_view()),
    path('api/bike/<int:bike_id>/', Bikes.as_view()),
    path('api/bike/<int:bike_id>/parts/', BikeParts.as_view()),
    path('api/bike/<int:bike_id>/parts/<int:part_id>/', BikeParts.as_view()),
    path('api/productsearch/', parts_and_supplier_parts),
    path('api/quotes/', QuotesApi.as_view()),
    path('api/quote/<int:quote_id>', QuoteMaintain.as_view()),
    path('api/quote/<int:quote_id>/copy/', QuoteCopy.as_view()),
    path('api/quote/<int:quote_id>/archive/', QuoteArchive.as_view()),
    path('api/quote/<int:quote_id>/unarchive/', QuoteUnArchive.as_view()),
    path('api/quote/<int:quote_id>/recalculate/', QuoteRecalculate.as_view()),
    path('api/quote/<int:quote_id>/issue/', QuoteIssue.as_view()),
    path('api/quote-part/', QuotePartMaintain.as_view()),
    path('api/quote-part/<int:quote_part_id>', QuotePartMaintain.as_view()),
    path('api/user/', UserApi.as_view()),
]
