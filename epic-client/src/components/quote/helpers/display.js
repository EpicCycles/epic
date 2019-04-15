import {buildPartString} from "../../part/helpers/part";
import {
    BIKE_FIELD,
    COLOUR_FIELD,
    COLOUR_PRICE_FIELD,
    CREATED_BY_FIELD,
    CREATED_DATE_FIELD,
    CUSTOMER_FIELD,
    FRAME_SIZE_FIELD,
    ISSUED_DATE_FIELD,
    QUANTITY_FIELD,
    QUOTE_DESC_FIELD,
    QUOTE_PRICE_FIELD,
    QUOTE_STATUS_FIELD,
    TRADE_IN_PRICE_FIELD,
    UPD_DATE_FIELD,
    VERSION_FIELD
} from "../../app/model/helpers/fields";
import {findObjectWithId} from "../../../helpers/utils";
import {PART_PRICE_FIELD} from "./quotePartFields";

export const displayForPartType = (partTypeId, quoteParts, bikeParts, parts) => {
    const bikePart = bikeParts.find(bp => bp.partType === partTypeId);
    const additionalParts = quoteParts.filter(qp => ((qp.partType === partTypeId) && !qp.not_required));
    const quotePart = bikePart && quoteParts.find(qp => ((qp.partType === partTypeId) && qp.not_required));
    const replacementPart = (quotePart && quotePart.part) && findObjectWithId(parts, quotePart.part);
    return { bikePart, quotePart, replacementPart, additionalParts };
};

export const bikePartOnQuote = (bikePart, quotePart, replacementPart, brands) => {
    if (quotePart) {
        if (replacementPart) {
            return `**** ${buildPartString(replacementPart, brands)} ****`
        } else if (quotePart.not_required) {
            return '**** Not Required ****';
        }
    }
    if (bikePart) {
        return buildPartString(bikePart, brands);
    }
};
export const quoteFieldsBike = [
    BIKE_FIELD,
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
export const priceFields = [
    QUANTITY_FIELD,
    PART_PRICE_FIELD,
    TRADE_IN_PRICE_FIELD,
];