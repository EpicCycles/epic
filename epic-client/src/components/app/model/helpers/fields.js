import {
    ADDRESS_MISSING,
    ATTRIBUTE_NAME_MISSING,
    BRAND_MISSING,
    BRAND_NAME_MISSING,
    BUNDLE_NAME_MISSING,
    COUNTRY_MISSING,
    FRAME_NAME_MISSING,
    MODEL_NAME_MISSING,
    PART_MISSING,
    PART_NAME_MISSING,
    PART_TYPE_MISSING,
    PRODUCTS_MISSING,
    SELECT_ONE_MISSING,
    SUPPLIER_MISSING,
    VALUE_MISSING
} from "./error";
import {validateEmailFormat, validatePostcodeAndReturnError, validateURLAndReturnError} from "./validators";
import {ATTRIBUTE_OPTION_TYPES} from "../../../partTypeAttribute/helpers/partTypeAttribute";
import {FITTING_TYPE_CHOICES} from "../../../fitting/helpers/fitting";
import {COUNTRIES, NUMBER_TYPE_CHOICES} from "../../../address/helpers/address";
import {QUOTE_STATUS_CHOICES} from "../../../quote/helpers/quote";
import {updateObject} from "../../../../helpers/utils";

export const overrideReadonly = { readOnly: false };
export const CHECKBOX = "checkbox";
export const RADIO = "radio";
export const DATE_TIME = "date_time";
export const SELECT_ONE = "select_one";
export const CURRENCY = "currency";
export const NUMBER = "number";
export const TEXT = "text";
export const TEXT_AREA = "textArea";

export const ADD_DATE = "add_date";
export const ADDRESS1 = "address1";
export const ADDRESS2 = "address2";
export const ADDRESS3 = "address3";
export const ADDRESS4 = "address4";
export const ARCHIVED = "archived";
export const ARCHIVED_DATE = "archived_date";
export const ATTRIBUTE_NAME = "attribute_name";
export const ATTRIBUTE_TYPE = "attribute_type";
export const ATTRIBUTE_VALUE = "attribute_value";
export const OPTION_NAME = "option_name";
export const BAR_HEIGHT = "bar_height";
export const BIKE = "bike";
export const BILLING = "billing";
export const BIKE_PRICE = "bike_price";
export const BIKE_BRAND = "bike_brand";
export const BRAND = "brand";
export const BRAND_NAME = "brand_name";
export const BUNDLE_NAME = "bundle_name";
export const CAN_BE_OMITTED = "can_be_omitted";
export const CAN_BE_SUBSTITUTED = "can_be_substituted";
export const CHECK_DATE = "check_date";
export const CLUB_PRICE = "club_price";
export const COLOUR = "colour";
export const COLOUR_PRICE = "colour_price";
export const COLOURS = "colours";
export const COUNTRY = "country";
export const CREATED_BY = "created_by";
export const CREATED_DATE = "created_date";
export const CUSTOMER = "customer";
export const CUSTOMER_VISIBLE = "customer_visible";
export const DESCRIPTION = "description";
export const EMAIL = "email";
export const EPIC_PRICE = "epic_price";
export const FIRST_NAME = "first_name";
export const FITTED_PRICE = "fitted_price";
export const FITTING = "fitting";
export const FITTING_TYPE = "fitting_type";
export const FRAME = "frame";
export const FRAME_NAME = "frame_name";
export const FRAME_SIZE = "frame_size";
export const IN_USE = "in_use";
export const ISSUED_DATE = "issued_date";
export const LAST_NAME = "last_name";
export const MANDATORY = "mandatory";
export const NAME = "name";
export const NOTE_TEXT = "note_text";
export const NUMBER_TYPE = "number_type";
export const SECTION = "includeInSection";
export const LINK = "link";
export const MODEL_NAME = "model_name";
export const PART = "part";
export const PART_NAME = "part_name";
export const PART_TYPE = "partType";
export const POSTCODE = "postcode";
export const PREFERRED = "preferred";
export const PREFERRED_SUPPLIER = "preferred_supplier";
export const PRODUCT_CODE = "product_code";
export const PRODUCTS = "products";
export const QUANTITY = "quantity";
export const QUOTE_DESC = "quote_desc";
export const QUOTE_PRICE = "quote_price";
export const QUOTE_STATUS = "quote_status";
export const REACH = "reach";
export const REPLACEMENT_PART = "replacement_part";
export const SADDLE_HEIGHT = "saddle_height";
export const SELL_PRICE = "rrp";
export const SIZES = "sizes";
export const STANDARD = "standard";
export const STOCKED = "stocked";
export const SUPPLIER = "supplier";
export const SUPPLIER_NAME = "supplier_name";
export const TELEPHONE = "telephone";
export const TICKET_PRICE = "ticket_price";
export const TRADE_IN_PRICE = "trade_in_price";
export const TRADE_PRICE = "trade_price";
export const UPD_DATE = "upd_date";
export const VERSION = "version";

export const ADD_DATE_FIELD = {
    fieldName: ADD_DATE,
    type: DATE_TIME,
    header: "Date Added",
    readOnly: true
};
export const ARCHIVED_DATE_FIELD = {
    fieldName: ARCHIVED_DATE,
    type: DATE_TIME,
    header: "Date Archived",
    readOnly: true
};
export const ARCHIVED_FIELD = {
    fieldName: ARCHIVED,
    header: "Archived",
    type: CHECKBOX,
};
export const ATTRIBUTE_NAME_FIELD = {
    fieldName: ATTRIBUTE_NAME,
    header: "Attribute Name",
    synonyms: [],
    required: true,
    error: ATTRIBUTE_NAME_MISSING
};
export const ATTRIBUTE_TYPE_FIELD = {
    fieldName: ATTRIBUTE_TYPE,
    type: SELECT_ONE,
    header: "Attribute Type",
    selectList: ATTRIBUTE_OPTION_TYPES,
    required: true,
    error: SELECT_ONE_MISSING
};

export const ATTRIBUTE_VALUE_FIELD = {
    fieldName: ATTRIBUTE_VALUE,
    type: ATTRIBUTE_VALUE,
    length: 40,
    header: "Value",
    synonyms: [],
    required: true,
    error: VALUE_MISSING
};
export const ADDRESS1_FIELD = {
    fieldName: ADDRESS1,
    type: TEXT,
    length: 100,
    header: "Address",
    required: true,
    error: ADDRESS_MISSING
};
export const ADDRESS2_FIELD = {
    fieldName: ADDRESS2,
    type: TEXT,
    length: 100,
    header: "Line 2",
};
export const ADDRESS3_FIELD = {
    fieldName: ADDRESS3,
    type: TEXT,
    length: 100,
    header: "Line 3",
};
export const ADDRESS4_FIELD = {
    fieldName: ADDRESS4,
    type: TEXT,
    length: 100,
    header: "Line 4",
};
export const POSTCODE_FIELD = {
    fieldName: POSTCODE,
    type: TEXT,
    length: 20,
    header: "Postcode",
    validator: validatePostcodeAndReturnError,
    validatorAdditionalFields: [COUNTRY]
};
export const BAR_HEIGHT_FIELD = {
    fieldName: BAR_HEIGHT,
    type: TEXT,
    length: 20,
    header: "Bar Height",
    required: true,
    error: VALUE_MISSING
};
export const BIKE_FIELD = {
    fieldName: BIKE,
    header: "Bike",
    readOnly: true,
    type: BIKE
};
export const BILLING_FIELD = {
    fieldName: BILLING,
    header: "Billing Address",
    type: CHECKBOX
};
export const BIKE_PRICE_FIELD = {
    fieldName: BIKE_PRICE,
    header: "Bike Price",
    type: CURRENCY,
    length: 10
};
export const BIKE_BRAND_FIELD = {
    fieldName: BIKE_BRAND,
    header: "Bike Brand",
    type: CHECKBOX
};
export const BRAND_FIELD = {
    fieldName: BRAND,
    header: "Brand",
    synonyms: [BRAND, 'manufacturer'],
    required: true,
    error: BRAND_MISSING,
    type: BRAND
};
export const BUNDLE_NAME_FIELD = {
    fieldName: BUNDLE_NAME,
    header: "Bundle Name",
    synonyms: [],
    required: true,
    error: BUNDLE_NAME_MISSING
};
export const CAN_BE_OMITTED_FIELD = {
    fieldName: CAN_BE_OMITTED,
    header: "Can be omitted",
    type: CHECKBOX
};
export const CHECK_DATE_FIELD = {
    fieldName: CHECK_DATE,
    type: DATE_TIME,
    header: "Date Checked",
    readOnly: true
};
export const COLOUR_FIELD = {
    fieldName: COLOUR,
    header: "Colour",
    type: TEXT,
    length: 100
};
export const COLOURS_FIELD = {
    fieldName: COLOURS,
    header: "Colours",
    synonyms: [COLOURS, "colour", "colors", "color"],
    type: TEXT,
    length: 100
};
export const CLUB_PRICE_FIELD = {
    fieldName: CLUB_PRICE,
    header: "Club Price",
    type: CURRENCY,
    length: 10
};
export const COLOUR_PRICE_FIELD = {
    fieldName: COLOUR_PRICE,
    header: "Colour Price",
    type: CURRENCY,
    length: 10
};
export const COUNTRY_FIELD = {
    fieldName: COUNTRY,
    header: "Country",
    type: SELECT_ONE,
    selectList: COUNTRIES,
    required: true,
    error: COUNTRY_MISSING
};
export const CREATED_BY_FIELD = {
    fieldName: CREATED_BY,
    type: TEXT,
    header: "Created By",
    readOnly: true
};
export const CREATED_DATE_FIELD = {
    fieldName: CREATED_DATE,
    type: DATE_TIME,
    header: "Date Created",
    readOnly: true
};
export const CUSTOMER_FIELD = {
    fieldName: CUSTOMER,
    type: CUSTOMER,
    header: "Customer",
    readOnly: true
};
export const CUSTOMER_VISIBLE_FIELD = {
    fieldName: CUSTOMER_VISIBLE,
    type: TEXT,
    header: "Customer View",
    readOnly: true
};
export const CAN_BE_SUBSTITUTED_FIELD = {
    fieldName: CAN_BE_SUBSTITUTED,
    header: "Can be substituted",
    type: CHECKBOX
};
export const DESCRIPTION_FIELD = {
    fieldName: DESCRIPTION,
    header: "Description",
    synonyms: [DESCRIPTION, "desc"],
    type: TEXT_AREA,
    length: 400
};
export const EMAIL_FIELD = {
    fieldName: EMAIL,
    type: TEXT,
    header: "email",
    validator: validateEmailFormat,
}
export const EPIC_PRICE_FIELD = {
    fieldName: EPIC_PRICE,
    header: "Epic Price",
    synonyms: [],
    type: CURRENCY,
    length: 10
};
export const FIRST_NAME_FIELD = {
    fieldName: FIRST_NAME,
    type: TEXT,
    length: 60,
    header: "First Name",
    synonyms: [],
    required: true,
    error: VALUE_MISSING
};
export const FITTED_PRICE_FIELD = {
    fieldName: FITTED_PRICE,
    header: "Fitted Price",
    synonyms: [],
    type: CURRENCY,
    length: 10
};
export const FITTING_FIELD = {
    fieldName: FITTING,
    header: "Fitting",
    type: FITTING,
};
export const FITTING_TYPE_FIELD = {
    fieldName: FITTING_TYPE,
    header: "Source",
    type: SELECT_ONE,
    selectList: FITTING_TYPE_CHOICES,
    required: true,
    error: SELECT_ONE_MISSING
};
export const PRODUCTS_FIELD = {
    fieldName: PRODUCTS,
    header: "Products",
    synonyms: [],
    required: true,
    error: PRODUCTS_MISSING,
    type: PRODUCTS
};
export const FRAME_NAME_FIELD = {
    fieldName: FRAME_NAME,
    type: TEXT,
    header: "Frame Name",
    synonyms: [],
    required: true,
    error: FRAME_NAME_MISSING
};
// TODO way of making fields dependant on other fields being present
export const FRAME_SIZE_FIELD = {
    fieldName: FRAME_SIZE,
    header: "Frame Size",
    type: TEXT,
};
// TODO set defaults for other boolean fields and create method with default setting for field for a new model
export const IN_USE_FIELD = {
    fieldName: IN_USE,
    type: CHECKBOX,
    header: "In Use",
    default: true
};
export const ISSUED_DATE_FIELD = {
    fieldName: ISSUED_DATE,
    type: DATE_TIME,
    header: "Date Issued",
    readOnly: true
};
export const LAST_NAME_FIELD = {
    fieldName: LAST_NAME,
    header: "Last Name",
    length: 60,
    type: TEXT,
    synonyms: [],
    required: true,
    error: VALUE_MISSING
};
export const MANDATORY_FIELD = {
    fieldName: MANDATORY,
    type: CHECKBOX,
    header: "In Use",
};
// TODO lengths on text fields
export const NAME_FIELD = {
    fieldName: NAME,
    header: "Name",
    synonyms: [],
    required: true,
    error: VALUE_MISSING
};
export const NOTE_TEXT_FIELD = {
    fieldName: NOTE_TEXT,
    header: "Note",
    type: TEXT_AREA,
    length: 400
};
export const NUMBER_TYPE_FIELD = {
    fieldName: NUMBER_TYPE,
    header: "Type",
    type: SELECT_ONE,
    selectList: NUMBER_TYPE_CHOICES,
    required: true,
    error: SELECT_ONE_MISSING
};
// TODO Edit model field based on section plus view
export const SECTION_FIELD = {
    fieldName: SECTION,
    header: "Section",
    required: true,
    error: SELECT_ONE_MISSING,
    type: SECTION
};
// TODO url validation rules
export const LINK_FIELD = {
    fieldName: LINK,
    header: "URL",
    type: TEXT,
    length: 100,
    validator: validateURLAndReturnError
};
export const MODEL_NAME_FIELD = {
    fieldName: MODEL_NAME,
    header: "Model Name",
    synonyms: [],
    required: true,
    error: MODEL_NAME_MISSING,
    type: TEXT,
    length: 100
};
export const PREFERRED_FIELD = {
    fieldName: PREFERRED,
    type: CHECKBOX,
    header: "Preferred",
};
export const PREFERRED_SUPPLIER_FIELD = {
    fieldName: PREFERRED_SUPPLIER,
    type: CHECKBOX,
    header: "Preferred",
};
// TODO validateion depening on whether this is an exclusion
export const QUANTITY_FIELD = {
    fieldName: QUANTITY,
    type: NUMBER,
    header: "Quantity"
};
export const QUOTE_DESC_FIELD = {
    fieldName: QUOTE_DESC,
    type: TEXT,
    length: 60,
    required: true,
    header: "Description"
};
export const QUOTE_STATUS_FIELD = {
    fieldName: QUOTE_STATUS,
    type: SELECT_ONE,
    readOnly: true,
    header: "Status",
    selectList: QUOTE_STATUS_CHOICES
};
export const REACH_FIELD = {
    fieldName: REACH,
    type: TEXT,
    header: "Reach",
    required: true,
    length: 20
};
export const REPLACEMENT_PART_FIELD = {
    fieldName: REPLACEMENT_PART,
    type: CHECKBOX,
    header: "Replacement",
};

export const SUPPLIER_FIELD = {
    fieldName: SUPPLIER,
    header: "Supplier",
    synonyms: [SUPPLIER],
    required: true,
    error: SUPPLIER_MISSING,
    type: SUPPLIER
};
export const SUPPLIER_FIELD_OPTIONAL = {
    fieldName: SUPPLIER,
    header: "Supplier",
    synonyms: [SUPPLIER],
    type: SUPPLIER
};
export const OPTION_NAME_FIELD = {
    fieldName: OPTION_NAME,
    header: "Option Name",
    type: TEXT,
    required: true,
    error: VALUE_MISSING,
    length: 30
};
export const PART_FIELD = {
    fieldName: PART,
    header: "Part",
    synonyms: [PART],
    required: true,
    error: PART_MISSING,
    type: PART
};
export const QUOTE_PRICE_FIELD = {
    fieldName: QUOTE_PRICE,
    header: "Quote Price",
    synonyms: [],
    type: CURRENCY,
    length: 10
};
export const BRAND_NAME_FIELD = {
    fieldName: BRAND_NAME,
    header: "Brand Name",
    synonyms: [],
    required: true,
    length: 50,
    error: BRAND_NAME_MISSING
};
export const PRODUCT_CODE_FIELD = {
    fieldName: PRODUCT_CODE,
    header: "Product Code",
    synonyms: [PRODUCT_CODE],
    type: TEXT,
    length: 30
};
export const SELL_PRICE_FIELD = {
    fieldName: SELL_PRICE,
    header: "RRP",
    synonyms: ["price", "selling price", "srp", "rrp", "sell price", "retail price"],
    type: CURRENCY,
    length: 10
};
export const TRADE_PRICE_FIELD = {
    fieldName: TRADE_PRICE,
    header: "Trade Price",
    synonyms: [],
    type: CURRENCY,
    length: 10
};
export const TELEPHONE_FIELD = {
    fieldName: TELEPHONE,
    header: "Telephone",
    type: TEXT,
    required: true,
    error: VALUE_MISSING,
    length: 60
};
export const TICKET_PRICE_FIELD = {
    fieldName: TICKET_PRICE,
    header: "Ticket Price",
    synonyms: [],
    type: CURRENCY,
    length: 10
};
export const SADDLE_HEIGHT_FIELD = {
    fieldName: SADDLE_HEIGHT,
    header: "Saddle Height",
    type: TEXT,
    length: 20
};
export const SIZES_FIELD = {
    fieldName: SIZES,
    header: "Sizes",
    synonyms: [SIZES, "size", "frame sizes", "frame size"],
    type: TEXT,
    length: 100
};
export const PART_TYPE_FIELD = {
    fieldName: PART_TYPE,
    header: "Part Type",
    required: true,
    error: PART_TYPE_MISSING,
    type: PART_TYPE,
};
export const PART_NAME_FIELD = {
    fieldName: PART_NAME,
    header: "Part Name",
    required: true,
    error: PART_NAME_MISSING
};
export const TRADE_IN_FIELD = {
    fieldName: TRADE_IN_PRICE,
    header: "Trade In £",
    type: CURRENCY,
    length: 10
};
// TODO add validation based on whether this is a standard field.
export const STOCKED_FIELD = {
    fieldName: STOCKED,
    header: "Stocked",
    type: CHECKBOX
};
export const STANDARD_FIELD = {
    fieldName: STANDARD,
    header: "Standard",
    type: CHECKBOX
};
export const SUPPLIER_NAME_FIELD = {
    fieldName: SUPPLIER_NAME,
    header: "Supplier",
    type: TEXT,
    length: 100,
    required: true,
    error: VALUE_MISSING
};
export const UPD_DATE_FIELD = {
    fieldName: UPD_DATE,
    type: DATE_TIME,
    header: "Date Updated",
    readOnly: true
};
export const VERSION_FIELD = {
    fieldName: VERSION,
    type: NUMBER,
    header: "Version",
    readOnly: true
};
// Model fields include only fields that are shown
export const attributeOptionFields = [
    OPTION_NAME_FIELD
];
export const bikeFields = [
    MODEL_NAME_FIELD,
    DESCRIPTION_FIELD,
    COLOURS_FIELD,
    SELL_PRICE_FIELD,
    EPIC_PRICE_FIELD,
    CLUB_PRICE_FIELD,
    SIZES_FIELD
];
export const brandFields = [BRAND_NAME_FIELD, BIKE_BRAND_FIELD, LINK_FIELD, SUPPLIER_FIELD_OPTIONAL];
export const bundleFields = [
    BUNDLE_NAME_FIELD,
    PRODUCTS_FIELD,
    FITTED_PRICE_FIELD,
    TICKET_PRICE_FIELD,
];
export const customerFields = [
    FIRST_NAME_FIELD, LAST_NAME_FIELD, EMAIL_FIELD, ADD_DATE_FIELD, UPD_DATE_FIELD,
];
export const customerAddressFields = [
    ADDRESS1_FIELD,
    ADDRESS2_FIELD,
    ADDRESS3_FIELD,
    ADDRESS4_FIELD,
    COUNTRY_FIELD,
    POSTCODE_FIELD,
    BILLING_FIELD,
    ADD_DATE_FIELD,
    UPD_DATE_FIELD
];

export const customerPhoneFields = [NUMBER_TYPE_FIELD, TELEPHONE_FIELD, PREFERRED_FIELD, ADD_DATE_FIELD, UPD_DATE_FIELD];
export const customerNoteFields = [NOTE_TEXT_FIELD, CUSTOMER_VISIBLE_FIELD, CREATED_DATE_FIELD, CREATED_BY_FIELD];
export const frameFields = [BRAND, FRAME_NAME];
export const fittingFields = [
    FITTING_TYPE_FIELD, BAR_HEIGHT_FIELD, SADDLE_HEIGHT_FIELD, REACH_FIELD, NOTE_TEXT_FIELD, ADD_DATE_FIELD, UPD_DATE_FIELD
];
export const partFieldsComplete = [
    PART_TYPE_FIELD,
    BRAND_FIELD,
    PART_NAME_FIELD,
    TRADE_IN_FIELD,
    STANDARD_FIELD,
    STOCKED_FIELD,
];
export const partFields = [
    PART_TYPE_FIELD,
    BRAND_FIELD,
    PART_NAME_FIELD,
    TRADE_IN_FIELD,
    STANDARD_FIELD,
];
export const partFieldsNoPartType = [
    BRAND_FIELD,
    PART_NAME_FIELD,
    TRADE_IN_FIELD,
    STANDARD_FIELD,
];
export const sectionFields = [NAME_FIELD];
export const partTypeFields = [NAME_FIELD];
export const partTypeAttributeFields = [
    ATTRIBUTE_NAME_FIELD,
    ATTRIBUTE_TYPE_FIELD,
    IN_USE_FIELD,
    MANDATORY_FIELD,
];
export const partTypeSynonymFields = [NAME_FIELD];
export const quoteFieldsBike = [
    BIKE_FIELD,
    FITTING_FIELD,
    FRAME_SIZE_FIELD,
    COLOUR_FIELD,
    COLOUR_PRICE_FIELD
];
export const quoteListFields = [
        QUOTE_DESC_FIELD,
    BIKE_FIELD,
    CUSTOMER_FIELD,
    QUOTE_PRICE_FIELD,
];
export const quoteFieldsNoBike = [
    QUOTE_DESC_FIELD,
    CUSTOMER_FIELD,
    QUOTE_STATUS_FIELD,
    VERSION_FIELD,
    CREATED_BY_FIELD,
    CREATED_DATE_FIELD,
    UPD_DATE_FIELD,
    ISSUED_DATE_FIELD,
    updateObject(SELL_PRICE_FIELD, overrideReadonly),
    updateObject(EPIC_PRICE_FIELD, overrideReadonly),
    updateObject(CLUB_PRICE_FIELD, overrideReadonly),
    QUOTE_PRICE_FIELD,
];
export const quoteFields = quoteFieldsNoBike.concat(quoteFieldsBike);
export const quoteFieldsNoCustomer = [
    QUOTE_DESC_FIELD,
    QUOTE_STATUS_FIELD,
    VERSION_FIELD,
    BIKE_FIELD,
    CREATED_BY_FIELD,
    UPD_DATE_FIELD,
    ISSUED_DATE_FIELD,
    QUOTE_PRICE_FIELD,
];
export const quotePartFields = [
    PART_TYPE_FIELD,
    REPLACEMENT_PART_FIELD,
    PART_FIELD,
    QUANTITY_FIELD,
    SELL_PRICE_FIELD,
    EPIC_PRICE_FIELD,
    CLUB_PRICE_FIELD
];
export const quotePartAttributeFields = [
    ATTRIBUTE_VALUE_FIELD
];
export const supplierFields = [
    SUPPLIER_NAME_FIELD,
    PREFERRED_SUPPLIER_FIELD,
    LINK_FIELD,
];
export const supplierProductFields = [
    SUPPLIER_FIELD,
    PART_FIELD,
    PRODUCT_CODE_FIELD,
    FITTED_PRICE_FIELD,
    TICKET_PRICE_FIELD,
    SELL_PRICE_FIELD,
    TRADE_PRICE_FIELD,
    CLUB_PRICE_FIELD,
    CHECK_DATE_FIELD,
];

export const userFields = [
    FIRST_NAME_FIELD,
    LAST_NAME_FIELD,
    EMAIL_FIELD,
];
