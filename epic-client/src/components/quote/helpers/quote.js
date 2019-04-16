import {getNameForValue} from "../../app/model/helpers/model";
import {findObjectWithId, updateObject} from "../../../helpers/utils";
import {formattedDate} from "../../app/model/helpers/display";
import {bikeFullName} from "../../bike/helpers/bike";

export const QUOTE_STATUS_CHOICES = [
    { value: '1', name: 'New' },
    { value: '2', name: 'Issued' },
    { value: '3', name: 'Archived' },
    { value: '4', name: 'Order Created' },
];

export const getQuoteStatus = quote_status => getNameForValue(quote_status, QUOTE_STATUS_CHOICES);

export const canBeIssued = (quote, quote_parts, sections) => {
    if (quote.quote_status > 1) return false;
    if (!quote.quote_price) return false;
    if (quote.bike && (!(quote.bike_price && quote.colour && (quote.colour_price || quote.colour_price === 0) && quote.frame_size))) return false;
    if ((!quote.bike) && (quote_parts.length === 0)) return false;
    return true;
};

export const canBeReIssued = (quote) => (quote.quote_status > 1);
export const canBeEdited = (quote) => (quote.quote_status === 1);

export const recalculatePrices = (quote, quote_parts = [], bike = {}) => {
    let quote_price = 0;

    if (quote.bike) {
        quote_price = bike.epic_price || bike.rrp || 0;
    }

    quote_parts.forEach(quote_part => {
        if (quote_part.quantity) {
            quote_price += (quote_part.quantity * (quote_part.quote_price|| quote_part.rrp || 0));
        }
    });
    return updateObject(quote, { quote_price });
};

export const quoteDescription = (customer, bike, customers, frames, bikes, brands) => {
    let quote_desc;
    let bikeObject;
    const customerObject = findObjectWithId(customers, customer);
    const customerName = customerObject ? `${customerObject.first_name} ${customerObject.last_name}/` : '';
    if (bike) {
        bikeObject = findObjectWithId(bikes, bike);
    }
    if (bikeObject) {
        quote_desc = bikeFullName(bikeObject, frames, brands);
    } else if (bike) {
        quote_desc = 'Bike'
    }else {
        quote_desc = 'Parts only'
    }
    return `${customerName}${quote_desc} - ${formattedDate(new Date())}`;
};
