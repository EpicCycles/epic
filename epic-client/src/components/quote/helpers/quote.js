import {getNameForValue} from "../../app/model/helpers/model";
import {completeQuotePart} from "../../quotePart/helpers/quotePart";
import {updateObject} from "../../../helpers/utils";

export const QUOTE_STATUS_CHOICES = [
    { value: 1, name: 'New' },
    { value: 2, name: 'Issued' },
    { value: 3, name: 'Archived' },
    { value: 4, name: 'Order Created' },
];

export const getQuoteStatus = quote_status => getNameForValue(quote_status, QUOTE_STATUS_CHOICES);

export const canBeIssued = (quote, quote_parts, sections) => {
    if (quote.quote_status > 1) return false;
    if (!quote.epic_price) return false;
    if (quote.bike && (!(quote.bike_price && quote.colour && (quote.colour_price || quote.colour_price === 0) && quote.frame_size))) return false;
    if ((!quote.bike) && (quote_parts.length === 0)) return false;

    return !quote_parts.some(quotePart => !completeQuotePart(quotePart, sections));
};

export const canBeReIssued = (quote) => (quote.quote_status > 1);
export const canBeEdited = (quote) => (quote.quote_status === 1);

export const recalculatePrices = (quote, quote_parts = [], bike = {}) => {
    let rrp = 0;
    let epic_price = 0;
    let club_price = 0;

    if (quote.bike) {
        rrp += bike.rrp || 0;
        epic_price += bike.epic_price || bike.rrp || 0;
        club_price +=  bike.club_price || bike.epic_price || bike.rrp || 0;
    }

    quote_parts.forEach(quote_part => {
        if (quote_part.quantity) {
            rrp += (quote_part.quantity * (quote_part.rrp || 0));
            epic_price += (quote_part.quantity * (quote_part.epic_price|| quote_part.rrp || 0));
            club_price += (quote_part.quantity * (quote_part.club_price || quote_part.epic_price|| quote_part.rrp || 0));
        }
        if (quote_part.trade_in_price) {
            rrp -= quote_part.trade_in_price;
            epic_price -= quote_part.trade_in_price;
            club_price -= quote_part.trade_in_price;
        }
    });
    return updateObject(quote, { rrp, epic_price, club_price });
};