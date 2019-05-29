/* eslint-disable camelcase */
import {
  CLUB_PRICE_FIELD,
  PART_TYPE_FIELD,
  QUANTITY_FIELD,
  SUPPLIER_FIELD_OPTIONAL,
  TICKET_PRICE_FIELD,
  TRADE_IN_PRICE_FIELD,
} from '../../app/model/helpers/fields';
import { attributePlaceholder } from '../../partType/helpers/partType';
import { updateObject } from '../../../helpers/utils';
import {
  ADDITIONAL_DATA_FIELD,
  ADDITIONAL_DATA_FIELD_DISABLED,
  CLUB_PRICE_FIELD_DISABLED,
  NOT_REQUIRED_FIELD,
  NOT_REQUIRED_FIELD_DISABLED,
  PART_DESC_FIELD,
  PART_DESC_FIELD_DISABLED,
  PART_PRICE_FIELD,
  PART_PRICE_FIELD_DISABLED,
  PART_TYPE_FIELD_DISABLED,
  QUANTITY_FIELD_DISABLED,
  SUPPLIER_FIELD_DISABLED,
  TICKET_PRICE_FIELD_DISABLED,
  TRADE_IN_PRICE_FIELD_DISABLED,
} from './quotePartFields';
import { createEmptyModelWithDefaultFields } from '../../app/model/helpers/model';
import { buildPartString } from '../../part/helpers/part';

export const modelFields = [
  PART_PRICE_FIELD,
  NOT_REQUIRED_FIELD,
  TRADE_IN_PRICE_FIELD,
  QUANTITY_FIELD,
  PART_PRICE_FIELD,
  SUPPLIER_FIELD_OPTIONAL,
  TICKET_PRICE_FIELD,
  CLUB_PRICE_FIELD,
  ADDITIONAL_DATA_FIELD,
];
export const quotePartNew = quote => {
  if (quote.bike) {
    return [
      PART_TYPE_FIELD,
      NOT_REQUIRED_FIELD,
      TRADE_IN_PRICE_FIELD_DISABLED,
      updateObject(PART_DESC_FIELD, { listId: 'parts-all' }),
      QUANTITY_FIELD,
      PART_PRICE_FIELD,
      SUPPLIER_FIELD_DISABLED,
      ADDITIONAL_DATA_FIELD,
    ];
  }
  if (quote.club_member) {
    return [
      PART_TYPE_FIELD,
      updateObject(PART_DESC_FIELD, { listId: 'parts-all' }),
      QUANTITY_FIELD,
      TICKET_PRICE_FIELD,
      CLUB_PRICE_FIELD,
      SUPPLIER_FIELD_DISABLED,
      ADDITIONAL_DATA_FIELD,
    ];
  }
  return [
    PART_TYPE_FIELD,
    updateObject(PART_DESC_FIELD, { listId: 'parts-all' }),
    QUANTITY_FIELD,
    TICKET_PRICE_FIELD,
    SUPPLIER_FIELD_DISABLED,
    ADDITIONAL_DATA_FIELD,
  ];
};

export const buildModelFields = (partType, quotePart, bikePart, quote) => {
  const fields = [];
  if (bikePart || (quotePart && quotePart.id)) {
    fields.push(PART_TYPE_FIELD_DISABLED);
  } else {
    fields.push(PART_TYPE_FIELD);
  }
  const isBikeQuote = !!quote.bike;
  const isClubMember = quote.club_member;

  let partTypeId;
  if (partType) partTypeId = partType.id;
  else if (quotePart && quotePart.partType) partTypeId = quotePart.partType;

  const required = bikePart && partType && (partType.can_be_omitted || partType.can_be_substituted);
  let desc = !!partTypeId;
  const part = quotePart && quotePart.part;

  if (bikePart && partType) {
    desc = partType.can_be_substituted;
  }

  if (isBikeQuote) {
    if (required) {
      fields.push(NOT_REQUIRED_FIELD);
      if (quotePart && quotePart.not_required) {
        fields.push(TRADE_IN_PRICE_FIELD);
      } else {
        fields.push(TRADE_IN_PRICE_FIELD_DISABLED);
      }
    } else {
      fields.push(NOT_REQUIRED_FIELD_DISABLED);
      fields.push(TRADE_IN_PRICE_FIELD_DISABLED);
    }
  }
  if (desc) {
    fields.push(updateObject(PART_DESC_FIELD, { listId: `parts-${partTypeId}` }));
  } else {
    fields.push(PART_DESC_FIELD_DISABLED);
  }

  if (part) {
    const attributes = attributePlaceholder(partType);
    const additionalDataField = updateObject(ADDITIONAL_DATA_FIELD, {
      placeholder: attributes,
      title: attributes,
    });
    fields.push(QUANTITY_FIELD);
    if (isBikeQuote) {
      fields.push(PART_PRICE_FIELD);
    } else {
      fields.push(TICKET_PRICE_FIELD);
      if (isClubMember) fields.push(CLUB_PRICE_FIELD);
    }
    fields.push(SUPPLIER_FIELD_OPTIONAL);
    fields.push(additionalDataField);
  } else {
    fields.push(QUANTITY_FIELD_DISABLED);
    if (isBikeQuote) {
      fields.push(PART_PRICE_FIELD_DISABLED);
    } else {
      fields.push(TICKET_PRICE_FIELD_DISABLED);
      if (isClubMember) fields.push(CLUB_PRICE_FIELD_DISABLED);
    }
    fields.push(SUPPLIER_FIELD_DISABLED);
    fields.push(ADDITIONAL_DATA_FIELD_DISABLED);
  }

  return fields;
};

export const buildQuotePart = (quoteId, partTypeId) => {
  const quotePart = createEmptyModelWithDefaultFields([]);
  quotePart.quote = quoteId;
  quotePart.partType = partTypeId;
  return quotePart;
};

export const addDescToQuotePart = passedProps => {
  let fullQuotePart;
  let part_desc;

  if (passedProps.replacementPart) {
    part_desc = buildPartString(passedProps.replacementPart, passedProps.brands);
  }

  if (passedProps.quotePart) {
    fullQuotePart = updateObject(passedProps.quotePart, { part_desc });
  } else {
    fullQuotePart = {
      quote: passedProps.quote.id,
    };
    if (passedProps.partType) fullQuotePart.partType = passedProps.partType.id;
  }
  return fullQuotePart;
};
