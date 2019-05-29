import { buildPartString } from '../../part/helpers/part';
import {
  BIKE_FIELD,
  BIKE_PRICE_FIELD,
  CALCULATED_PRICE_FIELD,
  CLUB_MEMBER_FIELD,
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
  VERSION_FIELD,
} from '../../app/model/helpers/fields';
import { findObjectWithId } from '../../../helpers/utils';
import { PART_PRICE_FIELD } from './quotePartFields';
import {findPartsForBikeId} from "../../bike/helpers/bike";

const findReplacementQuotePart = (partTypeId, bikePart, quoteParts) => {
  if (!bikePart) return undefined;
  return quoteParts.find(qp => qp.partType === partTypeId && qp.not_required);
};
const findReplacementPart = (quotePart, parts) => {
  if (!quotePart) return undefined;
  if (!quotePart.part) return undefined;
  return findObjectWithId(parts, quotePart.part);
};
export const displayForPartType = (partTypeId, quoteParts, bikeParts, parts) => {
  const bikePart = bikeParts.find(bp => bp.partType === partTypeId);
  const additionalParts = quoteParts.filter(qp => qp.partType === partTypeId && !qp.not_required);
  const quotePart = findReplacementQuotePart(partTypeId, bikePart, quoteParts);
  const replacementPart = findReplacementPart(quotePart, parts);

  return { bikePart, quotePart, replacementPart, additionalParts };
};
export const displayForPartTypeAndQuote = (quote, partTypeId, quoteParts, bikeParts, parts) => {
  const bikePartsForBike = findPartsForBikeId(quote.bike, bikeParts, parts);
  const quotePartsForQuote = quoteParts.filter(qp => qp.quote === quote.id);

  return displayForPartType(partTypeId, quotePartsForQuote, bikePartsForBike, parts);
};

export const bikePartOnQuote = (bikePart, quotePart, replacementPart, brands) => {
  if (quotePart) {
    if (replacementPart) {
      return `**** ${buildPartString(replacementPart, brands)} ****`;
    }
    if (quotePart.not_required) {
      return '**** Not Required ****';
    }
  }
  if (bikePart) {
    return buildPartString(bikePart, brands);
  }
  return 'No Part';
};

export const displayQuotePartArray = (
  bikePart,
  quotePart,
  replacementPart,
  additionalParts,
  parts,
  brands,
) => {
  const arrayOfDetails = [];
  if (bikePart) {
    arrayOfDetails.push(bikePartOnQuote(bikePart, quotePart, replacementPart, brands));
  }
  additionalParts.forEach(additionalQuotePart => {
    if (additionalQuotePart.part) {
      arrayOfDetails.push(
        `**** ${buildPartString(findObjectWithId(parts, additionalQuotePart.part), brands)} ****`,
      );
    } else {
      arrayOfDetails.push('No Part');
    }
  });
  return arrayOfDetails;
};
export const quoteFieldsBike = [
  BIKE_FIELD,
  BIKE_PRICE_FIELD,
  FRAME_SIZE_FIELD,
  COLOUR_FIELD,
  COLOUR_PRICE_FIELD,
];
export const quoteFieldsNoBike = [
  QUOTE_DESC_FIELD,
  CUSTOMER_FIELD,
  QUOTE_STATUS_FIELD,
  CLUB_MEMBER_FIELD,
  VERSION_FIELD,
  CREATED_BY_FIELD,
  CREATED_DATE_FIELD,
  UPD_DATE_FIELD,
  ISSUED_DATE_FIELD,
  QUOTE_PRICE_FIELD,
  CALCULATED_PRICE_FIELD,
];
export const quoteFields = quoteFieldsNoBike.concat(quoteFieldsBike);
export const quoteFieldsNoCustomer = [
  QUOTE_DESC_FIELD,
  QUOTE_STATUS_FIELD,
  CLUB_MEMBER_FIELD,
  VERSION_FIELD,
  BIKE_FIELD,
  CREATED_BY_FIELD,
  UPD_DATE_FIELD,
  ISSUED_DATE_FIELD,
  QUOTE_PRICE_FIELD,
  CALCULATED_PRICE_FIELD,
];
export const quoteFieldsBikeNoCustomer = quoteFieldsNoCustomer.concat(quoteFieldsBike);

export const priceFields = [QUANTITY_FIELD, PART_PRICE_FIELD, TRADE_IN_PRICE_FIELD];
