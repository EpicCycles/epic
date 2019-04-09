import {isItAnObject, updateObject} from "../../../helpers/utils";
import {findPartWithDescription} from "../../part/helpers/part";

const BIKE_OR_PARTS = "A quote must either have a bike selected or have parts added.";
const BIKE_PRICES_REQUIRED = "Bike prices are required to calculate the quote price";
const CUSTOMER_REQUIRED = "A customer should be selected";
const QUOTE_PART_ERRORS = "Parts need amending before quote can be saved.";
const MULTIPLE_REPLACEMENT_PARTS = "Multiple replacement parts - only one allowed per bike part";

export const quotePartValidation = (quotePart, bikePart, partType, brands, parts) => {
    let validatedQuotePart = updateObject(quotePart);
    const error_detail = {};

    // reset price if there is no part or this is not a replacement

    if (quotePart.not_required) {
        validatedQuotePart.quantity = '';
        if (!partType.can_be_substituted) validatedQuotePart.part_desc = '';
    }

    if (validatedQuotePart.part_desc) {
        const part = findPartWithDescription(quotePart.part_desc, partType.id, parts, brands);
        if (!part) error_detail['part_desc'] = 'Please include a brand in the part name to add this part.';
        validatedQuotePart.part = part;
    } else {
        validatedQuotePart.part = undefined;
    }

    if (validatedQuotePart.part) {
        if (!validatedQuotePart.quote_price) error_detail['quote_price'] = 'Please specify a price (can be negative).';
        if (!quotePart.not_required && !validatedQuotePart.quantity) error_detail['quantity'] = 'Quantity is required for non replacement parts.';
    } else {
        if (quotePart.not_required && !validatedQuotePart.quote_price) error_detail['quote_price'] = 'Please specify a price (can be negative).';
        validatedQuotePart.quantity = '';
        validatedQuotePart.additional_data = '';
    }

    validatedQuotePart.error_detail = error_detail;
    validatedQuotePart.error = isItAnObject(error_detail);
    return validatedQuotePart;
};