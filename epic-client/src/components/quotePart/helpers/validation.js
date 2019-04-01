import {
    CLUB_PRICE,
    EPIC_PRICE,
    QUANTITY,
    REPLACEMENT_PART,
    SELL_PRICE,
    TRADE_IN_PRICE
} from "../../app/model/helpers/fields";
import {addErrorDetail} from "../../app/model/helpers/model";
import {definedOrZero, updateObject} from "../../../helpers/utils";
import {VALUE_MISSING} from "../../app/model/helpers/error";
import {hasMandatoryAttributes} from "./quotePart";

const NOT_REPLACEMENT = 'No matching part on bike specification.';
const NEED_TRADE_IN = "A trade in price must be keyed (can be zero).";
const NO_TRADE_IN = "Trade in price only valid when this is a replacement part";
const AT_LEAST_ONE_PRICE = "At least an RRP must be provided for the part";
const PLEASE_REMOVE = "No prices or quantities should be entered if there is no part";
const MANDATORY_ATTRIBUTES = "Attributes need to be completed";

export const validateQuotePart = (quote_part, bike_parts, sections) => {
    let error = quote_part.error || [];
    let error_detail = quote_part.error_detail || {};

    // can only have replacement parts if there is a matching part
    if (quote_part.replacement_part) {
        if (bike_parts.filter(bike_part =>
            bike_part.partType === quote_part.partType
        ).length === 0) error_detail = addErrorDetail(error_detail, REPLACEMENT_PART, NOT_REPLACEMENT);
        if (!definedOrZero(quote_part[TRADE_IN_PRICE])) error_detail = addErrorDetail(error_detail, TRADE_IN_PRICE, NEED_TRADE_IN);
    } else {
        if (definedOrZero(quote_part[TRADE_IN_PRICE])) error_detail = addErrorDetail(error_detail, TRADE_IN_PRICE, NO_TRADE_IN);
    }

    if (quote_part.part) {
        if (!definedOrZero(quote_part[SELL_PRICE])) error_detail = addErrorDetail(error_detail, SELL_PRICE, AT_LEAST_ONE_PRICE);
        if (!definedOrZero(quote_part[QUANTITY])) error_detail = addErrorDetail(error_detail, QUANTITY, VALUE_MISSING);
        if (! hasMandatoryAttributes(quote_part, sections)) error.push(MANDATORY_ATTRIBUTES);
    } else {
        if (definedOrZero(quote_part[SELL_PRICE])) error_detail = addErrorDetail(error_detail, SELL_PRICE, PLEASE_REMOVE);
        if (definedOrZero(quote_part[EPIC_PRICE])) error_detail = addErrorDetail(error_detail, EPIC_PRICE, PLEASE_REMOVE);
        if (definedOrZero(quote_part[CLUB_PRICE])) error_detail = addErrorDetail(error_detail, CLUB_PRICE, PLEASE_REMOVE);
        if (definedOrZero(quote_part[QUANTITY])) error_detail = addErrorDetail(error_detail, QUANTITY, PLEASE_REMOVE);
    }

    return updateObject(quote_part, { error, error_detail });
};