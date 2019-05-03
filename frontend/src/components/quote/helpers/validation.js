/* eslint-disable camelcase,import/prefer-default-export */
import { isItAnObject, updateObject } from '../../../helpers/utils';
import { findPartWithDescription } from '../../part/helpers/part';

export const quotePartValidation = (quotePart = {}, bikePart, partType, brands, parts, quote) => {
  const validatedQuotePart = updateObject(quotePart);
  const error_detail = {};
  const isBikeQuote = !!quote.bike;
  const isClubMember = quote.club_member;

  // reset price if there is no part or this is not a replacement

  if (quotePart.not_required) {
    if (!partType.can_be_substituted) validatedQuotePart.part_desc = undefined;
    if (!quotePart.trade_in_price) {
      if (bikePart && bikePart.trade_in_price) {
        quotePart.trade_in_price = bikePart.trade_in_price;
      } else {
        error_detail.trade_in_price = 'Please specify a price (can be zero).';
      }
    }
  } else {
    if (quotePart.partType && !quotePart.part_desc) {
      error_detail.part_desc = 'Please enter part details';
    }
    validatedQuotePart.trade_in_price = undefined;
  }

  if (validatedQuotePart.part_desc) {
    const part = findPartWithDescription(quotePart.part_desc, partType.id, parts, brands);
    if (!part) error_detail.part_desc = 'Please include a brand in the part name to add this part.';
    validatedQuotePart.part = part;
  } else {
    validatedQuotePart.part = undefined;
  }

  if (validatedQuotePart.part) {
    if (!quotePart.not_required && !validatedQuotePart.quantity) {
      error_detail.quantity = 'Quantity is required for non replacement parts.';
    }
    if (isBikeQuote) {
      validatedQuotePart.ticket_price = undefined;
      validatedQuotePart.club_price = undefined;
      if (!validatedQuotePart.part_price) error_detail.part_price = 'Please provide a price.';
    } else {
      if (validatedQuotePart.ticket_price) {
        validatedQuotePart.part_price = validatedQuotePart.ticket_price;
      } else {
        error_detail.ticket_price = 'Please provide a ticket price.';
      }
      if (isClubMember && validatedQuotePart.club_price) {
        validatedQuotePart.part_price = validatedQuotePart.club_price;
      }
    }
  } else {
    validatedQuotePart.quantity = undefined;
    validatedQuotePart.part_price = undefined;
    validatedQuotePart.ticket_price = undefined;
    validatedQuotePart.club_price = undefined;
    validatedQuotePart.additional_data = undefined;
  }

  validatedQuotePart.error_detail = error_detail;
  validatedQuotePart.error = isItAnObject(error_detail);
  return validatedQuotePart;
};
