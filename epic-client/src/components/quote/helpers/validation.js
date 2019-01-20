import {updateObject} from "../../../helpers/utils";
import {validateQuotePart} from "../../quotePart/helpers/validation";
import {hasErrors} from "../../app/model/helpers/model";

const BIKE_OR_PARTS = "A quote must either have a bike selected or have parts added.";
const BIKE_PRICES_REQUIRED = "Bike prices are required to calculate the quote price";
const CUSTOMER_REQUIRED = "A customer should be selected";
const QUOTE_PART_ERRORS = "Parts need amending before quote can be saved.";
const MULTIPLE_REPLACEMENT_PARTS = "Multiple replacement parts - only one allowed per bike part";

export const validateQuote = (quote = {}, quote_parts = [], bike = {}, bike_parts = [], sections = {}) => {
    let error = [];

    // check for non-displayed fields.
    if (!quote.customer) error.push(CUSTOMER_REQUIRED);

    // **** CROSS VALIDATION ****
    // a quote must either have a bike or quote parts
    if (!(quote.bike || quote_parts.length > 0)) error.push(BIKE_OR_PARTS);

    // a bike quote means the bike must have prices
    if (quote.bike) {
        if (!(bike && (bike.rrp || bike.epic_price || bike.club_price)))  error.push(BIKE_PRICES_REQUIRED);
        if (bike_parts.some(bike_part => {
           return (quote_parts.filter(quote_part => {
               return (quote_part.replacement_part && quote_part.partType === bike_parts.partType);
           }).length > 0);
        }))   error.push(MULTIPLE_REPLACEMENT_PARTS);
    }

    const validated_quote_parts = quote_parts.map((quote_part, index) => validateQuotePart(quote_part, bike_parts, sections));
    if (validated_quote_parts.some(quote_part => hasErrors(quote_part))) error.push(QUOTE_PART_ERRORS);
    return {quote: updateObject(quote, { error }), quote_parts: validated_quote_parts };
};
