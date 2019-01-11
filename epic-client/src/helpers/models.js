import {
    BRAND_MISSING, BRAND_NAME_MISSING,
    BUNDLE_NAME_MISSING,
    FRAME_NAME_MISSING,
    MODEL_NAME_MISSING,
    PART_MISSING,
    PART_NAME_MISSING,
    PART_TYPE_MISSING,
    PRODUCTS_MISSING,
    SUPPLIER_MISSING
} from "./error";
import {findObjectWithKey, removeKey, updateObject, updateObjectInArray} from "./utils";

export const BRAND = "brand";
export const SUPPLIER = "supplier";
export const PART = "part";
export const LINK = "link";
export const BUNDLE = "bundle_name";
export const PRODUCT_CODE = "product_code";
export const PART_TYPE = "partType";
export const BRAND_NAME = "brand_name";
export const BIKE_BRAND = "bike_brand";
export const FRAME_NAME = "frame_name";
export const MODEL_NAME = "model_name";
export const PART_NAME = "part_name";
export const DESCRIPTION = "description";
export const COLOURS = "colours";
export const SELL_PRICE = "rrp";
export const EPIC_PRICE = "epic_price";
export const TICKET_PRICE = "ticket_price";
export const TRADE_PRICE = "trade_price";
export const CLUB_PRICE = "club_price";
export const FITTED_PRICE = "fitted_price";
export const TRADE_IN_PRICE = "trade_in_value";
export const SIZES = "sizes";
export const STANDARD = "standard";
export const STOCKED = "stocked";
export const PRODUCTS = "products";
export const TEXT = "text";
export const NUMBER = "number";
export const CURRENCY = "currency";
export const TEXT_AREA = "textArea";
export const CHECKBOX = "checkbox";

export const BRAND_FIELD = {
    fieldName: BRAND,
    header: "Brand",
    synonyms: [BRAND, 'manufacturer'],
    required: true,
    error: BRAND_MISSING,
    type: BRAND
};
export const PRODUCTS_FIELD = {
    fieldName: PRODUCTS,
    header: "Products",
    synonyms: [],
    required: true,
    error: PRODUCTS_MISSING,
    type: PRODUCTS
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
export const PART_FIELD = {
    fieldName: PART,
    header: "Part",
    synonyms: [PART],
    required: true,
    error: PART_MISSING,
    type: PART
};
export const FRAME_NAME_FIELD = {
    fieldName: FRAME_NAME,
    header: "Frame Name",
    synonyms: [],
    required: true,
    error: FRAME_NAME_MISSING
};
export const LINK_FIELD = {
    fieldName: LINK,
    header: "URL",
    synonyms: [],
};
export const BRAND_NAME_FIELD = {
    fieldName: BRAND_NAME,
    header: "Brand Name",
    synonyms: [],
    required: true,
    error: BRAND_NAME_MISSING
};
export const BUNDLE_NAME_FIELD = {
    fieldName: BUNDLE,
    header: "Bundle Name",
    synonyms: [],
    required: true,
    error: BUNDLE_NAME_MISSING
};
export const MODEL_NAME_FIELD = {
    fieldName: MODEL_NAME,
    header: "Model Name",
    synonyms: [],
    required: true,
    error: MODEL_NAME_MISSING,
    type: TEXT,
    length:100
};
export const COLOURS_FIELD = {
    fieldName: COLOURS,
    header: "Colours",
    synonyms: [COLOURS, "colour", "colors", "color"],
    type: TEXT,
    length:100
};
export const DESCRIPTION_FIELD = {
    fieldName: DESCRIPTION,
    header: "Description",
    synonyms: [DESCRIPTION, "desc"],
    type: TEXT_AREA,
    length:400
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
    length:10
};
export const EPIC_PRICE_FIELD = {
    fieldName: EPIC_PRICE,
    header: "Epic Price",
    synonyms: [],
    type: CURRENCY,
    length: 10
};
export const CLUB_PRICE_FIELD = {
    fieldName: CLUB_PRICE,
    header: "Club Price",
    synonyms: [],
    type: CURRENCY,
    length: 10
};

export const FITTED_PRICE_FIELD = {
    fieldName: FITTED_PRICE,
    header: "Fitted Price",
    synonyms: [],
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
export const TICKET_PRICE_FIELD = {
    fieldName: TICKET_PRICE,
    header: "Ticket Price",
    synonyms: [],
    type: CURRENCY,
    length: 10
};
export const SIZES_FIELD = {
    fieldName: SIZES,
    header: "Sizes",
    synonyms: [SIZES, "size", "frame sizes", "frame size"],
    type: TEXT,
    length:100
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
    length:10
};
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
export const BIKE_BRAND_FIELD = {
    fieldName: BIKE_BRAND,
    header: "Bike Brand",
    type: CHECKBOX
};
export const frameFields = [BRAND, FRAME_NAME];
export const brandFields = [BRAND_NAME_FIELD, BIKE_BRAND_FIELD, LINK_FIELD, SUPPLIER_FIELD_OPTIONAL];
export const bikeFields = [MODEL_NAME_FIELD, DESCRIPTION_FIELD, COLOURS_FIELD, SELL_PRICE_FIELD, EPIC_PRICE_FIELD, CLUB_PRICE_FIELD, SIZES_FIELD];
export const partFields = [
    PART_TYPE_FIELD,
    BRAND_FIELD,
    PART_NAME_FIELD,
    TRADE_IN_FIELD,
    STANDARD_FIELD,
    STOCKED_FIELD
];
export const supplierProductFields = [
    SUPPLIER_FIELD,
    FITTED_PRICE_FIELD,
    TICKET_PRICE_FIELD,
    SELL_PRICE_FIELD,
    TRADE_PRICE_FIELD,
    CLUB_PRICE_FIELD
];
export const bundleFields = [
    BUNDLE_NAME_FIELD,
    PRODUCTS_FIELD,
    FITTED_PRICE_FIELD,
    TICKET_PRICE_FIELD,
];


export const applyFieldValueToModel = (modelInstance, field, value) => {
    let updatedModelInstance = updateObject(modelInstance);
    updatedModelInstance[field.fieldName] = value;
    updatedModelInstance.changed = true;
    if (field.required && ! value) {
        updatedModelInstance.error = true;
        updatedModelInstance.error_detail = field.error;
    } else {
        updatedModelInstance.error = false;
        updatedModelInstance.error_detail = "";
    }
    return updatedModelInstance;
};

export const getAttribute = (modelFields, fieldName) => {
    let attribute;
    modelFields.some(field => {
        if (fieldName.startsWith(field.fieldName)) {
            attribute = field.fieldName;
            return true;
        }
        return false;
    });
    return attribute;
};

export const getField = (modelFields, fieldName) => {
    let modelField;
    modelFields.some(field => {
        if (fieldName.startsWith(field.fieldName)) {
            modelField = field;
            return true;
        }
        return false;
    });
    return modelField;
};

export const updateModelArrayWithChanges = (modelArray, modelFields, fieldName, fieldValue, componentKey) => {
    const attribute = getAttribute(modelFields, fieldName);
    if (attribute) {
        let modelInstance = findObjectWithKey(modelArray, componentKey);
        let currentChanges = modelInstance.changes || {};
        if (fieldValue && (modelInstance[attribute] !== fieldValue)) {
            currentChanges[attribute] = fieldValue;
        } else {
            currentChanges = removeKey(currentChanges, attribute);
        }
        modelInstance.changes = currentChanges;
        return updateObjectInArray(modelArray, modelInstance, componentKey)
    } else {
        console.error("attribute not found for", modelFields, fieldName)
    }
    return modelArray;
};
export const updateModel = (model, modelFields, fieldName, fieldValue, componentKey) => {
    const modelField = getField(modelFields, fieldName);
    return applyFieldValueToModel(model, modelField, fieldValue);
};