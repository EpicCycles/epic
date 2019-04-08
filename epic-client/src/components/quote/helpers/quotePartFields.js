import {CHECKBOX, PART_TYPE_FIELD, QUANTITY_FIELD, QUOTE_PRICE_FIELD, TEXT} from "../../app/model/helpers/fields";
import {updateObject} from "../../../helpers/utils";

export const NOT_REQUIRED_FIELD = {
    fieldName: 'not_required',
    header: "Not Required",
    type: CHECKBOX
};
export const PART_DESC_FIELD = {
    fieldName: 'part_desc',
    header: "Part",
    type: TEXT,
    length: 100,
    size: 20,
};
export const ADDITIONAL_DATA_FIELD = {
    fieldName: 'additional_data',
    header: "Attributes",
    type: TEXT,
    length: 100,
    size: 20,
};
const disabledAttribute = {disabled: true};
export const NOT_REQUIRED_FIELD_DISABLED = updateObject(NOT_REQUIRED_FIELD, disabledAttribute);
export const ADDITIONAL_DATA_FIELD_DISABLED = updateObject(ADDITIONAL_DATA_FIELD, disabledAttribute);
export const PART_DESC_FIELD_DISABLED = updateObject(PART_DESC_FIELD, disabledAttribute);
export const PART_TYPE_FIELD_DISABLED = updateObject(PART_TYPE_FIELD, disabledAttribute);
export const QUANTITY_FIELD_DISABLED = updateObject(QUANTITY_FIELD, disabledAttribute);
export const QUOTE_PRICE_FIELD_DISABLED = updateObject(QUOTE_PRICE_FIELD, disabledAttribute);