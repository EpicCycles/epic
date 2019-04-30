import {getNameForValue} from "../../app/model/helpers/model";
import {findObjectWithId, updateObject} from "../../../helpers/utils";
import {formattedDate} from "../../app/model/helpers/display";
import {bikeFullName} from "../../bike/helpers/bike";

export const QUOTE_INITIAL = '1';
export const QUOTE_ISSUED = '2';
export const QUOTE_ARCHIVED = '3';
export const QUOTE_ORDERED = '4';
export const QUOTE_STATUS_CHOICES = [
    { value: QUOTE_INITIAL, name: 'New' },
    { value: QUOTE_ISSUED, name: 'Issued' },
    { value: QUOTE_ARCHIVED, name: 'Archived' },
    { value: QUOTE_ORDERED, name: 'Order Created' },
];

export const getQuoteStatus = quote_status => getNameForValue(quote_status, QUOTE_STATUS_CHOICES);

export const canBeIssued = (quote, quote_parts, sections) => {
    if (quote.quote_status !== QUOTE_INITIAL) return false;

    if (!quote.quote_price) return false;
    if (quote.bike && (!(quote.bike_price && quote.colour && (quote.colour_price || quote.colour_price === 0) && quote.frame_size))) return false;
    if ((!quote.bike) && (quote_parts.length === 0)) return false;
    return true;
};

export const canBeReIssued = (quote) => (quote.quote_status === QUOTE_ISSUED);
export const canBeEdited = (quote) => (quote.quote_status === QUOTE_INITIAL);


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

export const quoteActions = (cloneQuote, issueQuote, changeQuote, quote, getQuote, archiveQuote, unarchiveQuote) => {
    const actionArray = [];
    if (cloneQuote) actionArray.push({
        iconName: 'clone',
        iconTitle: 'copy quote',
        iconAction: cloneQuote,
    });
    if (issueQuote) actionArray.push({
        iconName: 'email',
        iconTitle: 'issue quote',
        iconAction: changeQuote,
        iconDisabled: (quote.quote_status !== QUOTE_INITIAL),
    });
    if (changeQuote) actionArray.push({
        iconName: 'eye',
        iconTitle: 'view quote',
        iconAction: changeQuote,
        iconDisabled: (quote.quote_status === QUOTE_ARCHIVED),
    });
    if (getQuote) actionArray.push({
        iconName: 'edit',
        iconTitle: 'edit quote',
        iconAction: getQuote,
        iconDisabled: (quote.quote_status !== QUOTE_INITIAL),
    });
    if (archiveQuote) actionArray.push({
        iconName: 'remove',
        iconTitle: 'archive quote',
        iconAction: archiveQuote,
        iconDisabled: (quote.quote_status === QUOTE_ARCHIVED),
    });
    if (unarchiveQuote) actionArray.push({
        iconName: 'undo',
        iconTitle: 'un-archive quote',
        iconAction: unarchiveQuote,
        iconDisabled: (quote.quote_status !== QUOTE_ARCHIVED),
    });
    return actionArray;
};
