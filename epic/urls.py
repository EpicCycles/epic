from django.urls import path

from epic.api_views.attribute_option_api import AttributeOptions
from epic.api_views.bike_api import Frames, FrameUpload, BikeParts, Bikes
from epic.api_views.brands_api import Brands, BrandMaintain
from epic.api_views.charge_api import ChargeList, ChargeMaintain
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
from epic.api_views.quote_charge_api import QuoteChargeMaintain
from epic.api_views.quote_part_api import QuotePartMaintain
from epic.api_views.section_api import PartSection
from epic.api_views.supplier_api import Suppliers, MaintainSupplier
from epic.api_views.user_api import CustomAuthToken, UserApi

# good explanation of patterns here https://tutorial.djangogirls.org/en/extend_your_application/
urlpatterns = [
    path('framework', Framework.as_view()),
    path('brands', Brands.as_view()),
    path('brand/<int:pk>', BrandMaintain.as_view()),
    path('suppliers', Suppliers.as_view()),
    path('supplier/<int:pk>', MaintainSupplier.as_view()),
    path('partsection', PartSection.as_view()),
    path('partsection/<int:pk>', PartSection.as_view()),
    path('parttype', PartType.as_view()),
    path('parttype/<int:pk>', PartType.as_view()),
    path('parttypeattribute', PartTypeAttribute.as_view()),
    path('parttypeattribute/<int:pk>', PartTypeAttribute.as_view()),
    path('attributeoptions', AttributeOptions.as_view()),
    path('attributeoptions/<int:pk>', AttributeOptions.as_view()),
    path('customers', CustomerList.as_view()),
    path('customer', CustomerList.as_view()),
    path('customer/<int:pk>', CustomerMaintain.as_view()),
    path('customernotes', CustomerNoteList.as_view()),
    path('customernote', CustomerNoteList.as_view()),
    path('customernote/<int:pk>', CustomerNoteMaintain.as_view()),
    path('customeraddress', CustomerAddressList.as_view()),
    path('customeraddress/<int:pk>', CustomerAddressMaintain.as_view()),
    path('customerphone', CustomerPhoneList.as_view()),
    path('customerphone/<int:pk>', CustomerPhoneMaintain.as_view()),
    path('api-token-auth', CustomAuthToken.as_view()),
    path('parts', Parts.as_view()),
    path('part', PartMaintain.as_view()),
    path('part/<int:part_id>', PartMaintain.as_view()),
    path('supplier-product', SupplierProductMaintain.as_view()),
    path('supplier-product/<int:supplier_product_id>', SupplierProductMaintain.as_view()),
    path('frames', Frames.as_view()),
    path('frames/<int:frame_id>', Frames.as_view()),
    path('frame/upload', FrameUpload.as_view()),
    path('bike/<int:bike_id>', Bikes.as_view()),
    path('bike/<int:bike_id>/parts', BikeParts.as_view()),
    path('bike/<int:bike_id>/parts/<int:part_id>', BikeParts.as_view()),
    path('productsearch', parts_and_supplier_parts),
    path('quotes', QuotesApi.as_view()),
    path('quote/<int:quote_id>', QuoteMaintain.as_view()),
    path('quote/<int:quote_id>/copy', QuoteCopy.as_view()),
    path('quote/<int:quote_id>/archive', QuoteArchive.as_view()),
    path('quote/<int:quote_id>/unarchive', QuoteUnArchive.as_view()),
    path('quote/<int:quote_id>/recalculate', QuoteRecalculate.as_view()),
    path('quote/<int:quote_id>/issue', QuoteIssue.as_view()),
    path('quote-part', QuotePartMaintain.as_view()),
    path('quote-part/<int:quote_part_id>', QuotePartMaintain.as_view()),
    path('charge', ChargeList.as_view()),
    path('charge/<int:charge_id>', ChargeMaintain.as_view()),
    path('quote-charge', QuoteChargeMaintain.as_view()),
    path('quote-charge/<int:quote_charge_id>', QuotePartMaintain.as_view()),
    path('user', UserApi.as_view()),
]
