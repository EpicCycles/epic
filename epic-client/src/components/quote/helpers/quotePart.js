import {
    CHECKBOX,
    PART_TYPE_FIELD,
    QUANTITY_FIELD,
    QUOTE_PRICE_FIELD,
    STOCKED,
    TEXT
} from "../../app/model/helpers/fields";
import {attributePlaceholder} from "../../partType/helpers/partType";

export const REPLACEMENT_PART_FIELD = {
    fieldName: 'part_desc',
    header: "Replacement Part",
    type: TEXT,
    length: 100,
    size: 20,
    required: true,
};
export const NOT_REQUIRED_FIELD = {
    fieldName: 'not_required',
    header: "Not Required",
    type: CHECKBOX
};
export const ADDITIONAL_PART_FIELD = {
    fieldName: 'part_desc',
    header: "Additional Part",
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
const quotePartNew = [
    PART_TYPE_FIELD,
    ADDITIONAL_PART_FIELD,
    QUANTITY_FIELD,
    QUOTE_PRICE_FIELD,
    ADDITIONAL_DATA_FIELD
];
const quotePartAdditional = [
    ADDITIONAL_PART_FIELD,
    QUANTITY_FIELD,
    QUOTE_PRICE_FIELD,
    ADDITIONAL_DATA_FIELD
];
const quotePartReplacement = [
    NOT_REQUIRED_FIELD,
    REPLACEMENT_PART_FIELD,
    QUANTITY_FIELD,
    QUOTE_PRICE_FIELD,
    ADDITIONAL_DATA_FIELD
];
export const buildModelFields = (partType, quotePart, bikePart) => {
    if (!partType) return quotePartNew;

    const attributes = attributePlaceholder(partType);
    let otherData = [];
    if (attributes) otherData.push({
        fieldName: 'additional_data',
        header: "Attributes",
        type: TEXT,
        length: 100,
        size: 20,
        placeholder: attributes,
        title: attributes,
    });
    if (! partType.can_be_substituted) {
        if (quotePart) return quotePartAdditional.concat(otherData);
        return;
    }
    if (bikePart) {
        if (! quotePart) return quotePartReplacement.concat(otherData);
        if (quotePart.replacement_part) return quotePartReplacement.concat(otherData);
        return quotePartAdditional.concat(otherData);
    }
    return quotePartAdditional.concat(otherData);
};