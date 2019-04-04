import {buildPartString} from "../../part/helpers/part";
import {
    ATTRIBUTE_VALUE_FIELD,
    BIKE_FIELD,
    COLOUR_FIELD,
    COLOUR_PRICE_FIELD,
    CREATED_BY_FIELD,
    CREATED_DATE_FIELD,
    CUSTOMER_FIELD,
    FITTING_FIELD,
    FRAME_SIZE_FIELD,
    ISSUED_DATE_FIELD,
    PART_FIELD,
    PART_TYPE_FIELD,
    QUANTITY_FIELD,
    QUOTE_DESC_FIELD,
    QUOTE_PRICE_FIELD,
    QUOTE_STATUS_FIELD,
    REPLACEMENT_PART_FIELD,
    UPD_DATE_FIELD,
    VERSION_FIELD
} from "../../app/model/helpers/fields";

export const displayForPartType = (partTypeId, quoteParts, bikeParts, parts) => {
    const bikePart = bikeParts.find(bp => bp.partType === partTypeId);
    const additionalParts = quoteParts.filter(qp => ((qp.partType === partTypeId) && !qp.replacement_part));
    const quotePart = bikePart && quoteParts.find(qp => ((qp.partType === partTypeId) && qp.replacement_part));
    const replacementPart = (quotePart && quotePart.part) && parts.find(part => part.id === quotePart.part);
    return { bikePart, quotePart, replacementPart, additionalParts };
};

export const bikePartOnQuote = (bikePart, quotePart, replacementPart, brands) => {
    if (quotePart) {
        if (replacementPart) {
            return `**** ${buildPartString(replacementPart, brands)} ****`
        } else {
            return '**** Not Required ****';
        }
    } else {
        return buildPartString(bikePart, brands);
    }
};
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
    QUOTE_PRICE_FIELD,
];
export const quotePartAttributeFields = [
    ATTRIBUTE_VALUE_FIELD
];
export const priceFields = [
    QUANTITY_FIELD,
    QUOTE_PRICE_FIELD,
];