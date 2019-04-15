import {
    CLUB_PRICE_FIELD,
    PART_TYPE_FIELD,
    QUANTITY_FIELD,
    SUPPLIER_FIELD_OPTIONAL,
    TEXT,
    TICKET_PRICE_FIELD,
    TRADE_IN_PRICE_FIELD
} from "../../../app/model/helpers/fields";

import {
    ADDITIONAL_DATA_FIELD,
    ADDITIONAL_DATA_FIELD_DISABLED, CLUB_PRICE_FIELD_DISABLED,
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
    TRADE_IN_PRICE_FIELD_DISABLED
} from "../quotePartFields";
import {updateObject} from "../../../../helpers/utils";
import {buildModelFields} from "../quotePart";

describe('buildModelFields', () => {

    const attributesField = {
        fieldName: 'additional_data',
        header: "Attributes",
        type: TEXT,
        length: 100,
        size: 20,
        placeholder: 'Colour',
        title: 'Colour',
    };
    const partDescForType = updateObject(PART_DESC_FIELD, { listId: 'parts-12' });

    const partTypeAttributes = [{
        "attribute_name": "Colour",
        "in_use": true,
        "mandatory": true,
    }];
    describe('for a bike quote', () => {
        const quote = { id: 23, bike: 58 };
        it('should return part type and all quote fields when there is no data', () => {
            const expectedFields = [
                PART_TYPE_FIELD,
                NOT_REQUIRED_FIELD_DISABLED,
                TRADE_IN_PRICE_FIELD_DISABLED,
                PART_DESC_FIELD_DISABLED,
                QUANTITY_FIELD_DISABLED,
                PART_PRICE_FIELD_DISABLED,
                SUPPLIER_FIELD_DISABLED,
                ADDITIONAL_DATA_FIELD_DISABLED
            ];
            expect(buildModelFields(undefined, undefined, undefined, quote)).toEqual(expectedFields);
        });
        it('should return quote part data when part type is present that can be substituted', () => {
            const partType = { id: 12, can_be_substituted: true, attributes: partTypeAttributes };
            const result = buildModelFields(partType, undefined, undefined, quote);
            expect(result).toContainEqual(PART_TYPE_FIELD);
            expect(result).toContainEqual(NOT_REQUIRED_FIELD_DISABLED);
            expect(result).toContainEqual(TRADE_IN_PRICE_FIELD_DISABLED);
            expect(result).toContainEqual(partDescForType);
            expect(result).toContainEqual(QUANTITY_FIELD_DISABLED);
            expect(result).toContainEqual(PART_PRICE_FIELD_DISABLED);
            expect(result).toContainEqual(SUPPLIER_FIELD_DISABLED);
            expect(result).toContainEqual(ADDITIONAL_DATA_FIELD_DISABLED);
            expect(result).not.toContainEqual(ADDITIONAL_DATA_FIELD);
        });
        it('should return the ability to enter a description when there is a bike part but the part cannot be substituted', () => {
            const partType = { id: 12, can_be_substituted: false };
            const bikePart = { id: 23 };
            const result = buildModelFields(partType, undefined, bikePart, quote);
            expect(result).toContainEqual(PART_TYPE_FIELD);
            expect(result).toContainEqual(NOT_REQUIRED_FIELD_DISABLED);
            expect(result).toContainEqual(TRADE_IN_PRICE_FIELD_DISABLED);
            expect(result).toContainEqual(partDescForType);
            expect(result).toContainEqual(QUANTITY_FIELD_DISABLED);
            expect(result).toContainEqual(PART_PRICE_FIELD_DISABLED);
            expect(result).toContainEqual(SUPPLIER_FIELD_DISABLED);
            expect(result).toContainEqual(ADDITIONAL_DATA_FIELD_DISABLED);
        });
        it('should return additional part fields when there is a bike part and a quote part that is not a replacement', () => {
            const partType = { id: 12, can_be_substituted: true };
            const bikePart = { id: 23 };
            const quotePart = { id: 231, not_required: false };
            const result = buildModelFields(partType, quotePart, bikePart, quote);
            expect(result).toContainEqual(PART_TYPE_FIELD_DISABLED);
            expect(result).toContainEqual(NOT_REQUIRED_FIELD);
            expect(result).toContainEqual(TRADE_IN_PRICE_FIELD_DISABLED);
            expect(result).toContainEqual(partDescForType);
            expect(result).toContainEqual(QUANTITY_FIELD_DISABLED);
            expect(result).toContainEqual(PART_PRICE_FIELD_DISABLED);
            expect(result).toContainEqual(SUPPLIER_FIELD_DISABLED);
            expect(result).toContainEqual(ADDITIONAL_DATA_FIELD_DISABLED);
        });
        it('should return standard fields when there is a quote part but the part cannot be substituted', () => {

            const partType = { id: 12, can_be_substituted: false };
            const quotePart = { id: 231 };
            const result = buildModelFields(partType, quotePart, undefined, quote);
            expect(result).toContainEqual(PART_TYPE_FIELD_DISABLED);
            expect(result).toContainEqual(NOT_REQUIRED_FIELD_DISABLED);
            expect(result).toContainEqual(TRADE_IN_PRICE_FIELD_DISABLED);
            expect(result).toContainEqual(partDescForType);
            expect(result).toContainEqual(QUANTITY_FIELD_DISABLED);
            expect(result).toContainEqual(PART_PRICE_FIELD_DISABLED);
            expect(result).toContainEqual(SUPPLIER_FIELD_DISABLED);
            expect(result).toContainEqual(ADDITIONAL_DATA_FIELD_DISABLED);
        });
        it('should return replacement part fields when there is a replacable bike part and no quote part', () => {
            const partType = { id: 12, can_be_substituted: true };
            const bikePart = { id: 23 };
            const result = buildModelFields(partType, undefined, bikePart, quote);
            expect(result).toContainEqual(PART_TYPE_FIELD);
            expect(result).toContainEqual(NOT_REQUIRED_FIELD);
            expect(result).toContainEqual(TRADE_IN_PRICE_FIELD_DISABLED);
            expect(result).toContainEqual(partDescForType);
            expect(result).toContainEqual(QUANTITY_FIELD_DISABLED);
            expect(result).toContainEqual(PART_PRICE_FIELD_DISABLED);
            expect(result).toContainEqual(SUPPLIER_FIELD_DISABLED);
            expect(result).toContainEqual(ADDITIONAL_DATA_FIELD_DISABLED);
        });
        it('should return replacement part fields when there is a replacable bike part and a quote part', () => {
            const partType = { id: 12, can_be_substituted: true };
            const bikePart = { id: 23 };
            const quotePart = { id: 231, not_required: true };
            const result = buildModelFields(partType, quotePart, bikePart, quote);
            expect(result).toContainEqual(PART_TYPE_FIELD_DISABLED);
            expect(result).toContainEqual(NOT_REQUIRED_FIELD);
            expect(result).toContainEqual(TRADE_IN_PRICE_FIELD);
            expect(result).toContainEqual(partDescForType);
            expect(result).toContainEqual(QUANTITY_FIELD_DISABLED);
            expect(result).toContainEqual(PART_PRICE_FIELD_DISABLED);
            expect(result).toContainEqual(SUPPLIER_FIELD_DISABLED);
            expect(result).toContainEqual(ADDITIONAL_DATA_FIELD_DISABLED);
        });
        it('should return additional part fields when there is a bike part and a quote part that is not a replacement', () => {
            const partType = { id: 12, can_be_substituted: true, attributes: partTypeAttributes };
            const bikePart = { id: 23 };
            const quotePart = { id: 231, not_required: false, part: { id: 2345 } };
            const result = buildModelFields(partType, quotePart, bikePart, quote);
            expect(result).toContainEqual(PART_TYPE_FIELD_DISABLED);
            expect(result).toContainEqual(NOT_REQUIRED_FIELD);
            expect(result).toContainEqual(TRADE_IN_PRICE_FIELD_DISABLED);
            expect(result).toContainEqual(partDescForType);
            expect(result).toContainEqual(QUANTITY_FIELD);
            expect(result).toContainEqual(PART_PRICE_FIELD);
            expect(result).toContainEqual(SUPPLIER_FIELD_OPTIONAL);
            expect(result).toContainEqual(attributesField);
        });
    });
    describe('non bike club member', () => {
        const quote = { id: 12, club_member: true };
        it('should show disabled fields when no part is present', () => {
            const expectedFields = [
                PART_TYPE_FIELD,
                PART_DESC_FIELD_DISABLED,
                QUANTITY_FIELD_DISABLED,
                TICKET_PRICE_FIELD_DISABLED,
                CLUB_PRICE_FIELD_DISABLED,
                SUPPLIER_FIELD_DISABLED,
                ADDITIONAL_DATA_FIELD_DISABLED
            ];
            expect(buildModelFields(undefined, undefined, undefined, quote)).toEqual(expectedFields);
        });
        it('should show enabled field fields when a part is present', () => {
            const partType = { id: 12, can_be_substituted: true, attributes: partTypeAttributes };
            const quotePart = { id: 231, not_required: false, part: { id: 2345 } };
            const expectedFields = [
                PART_TYPE_FIELD_DISABLED,
                partDescForType,
                QUANTITY_FIELD,
                TICKET_PRICE_FIELD,
                CLUB_PRICE_FIELD,
                SUPPLIER_FIELD_OPTIONAL,
                attributesField
            ];
            expect(buildModelFields(partType, quotePart, undefined, quote)).toEqual(expectedFields);
        });
    })
    describe('non bike not club member', () => {
        const quote = { id: 12, club_member: false };
        it('should show disabled fields when no part is present', () => {
            const expectedFields = [
                PART_TYPE_FIELD,
                PART_DESC_FIELD_DISABLED,
                QUANTITY_FIELD_DISABLED,
                TICKET_PRICE_FIELD_DISABLED,
                SUPPLIER_FIELD_DISABLED,
                ADDITIONAL_DATA_FIELD_DISABLED
            ];
            expect(buildModelFields(undefined, undefined, undefined, quote)).toEqual(expectedFields);
        });
        it('should show enabled field fields when a part is present', () => {
            const partType = { id: 12, can_be_substituted: true, attributes: partTypeAttributes };
            const quotePart = { id: 231, not_required: false, part: { id: 2345 } };
            const expectedFields = [
                PART_TYPE_FIELD_DISABLED,
                partDescForType,
                QUANTITY_FIELD,
                TICKET_PRICE_FIELD,
                SUPPLIER_FIELD_OPTIONAL,
                attributesField
            ];
            expect(buildModelFields(partType, quotePart, undefined, quote)).toEqual(expectedFields);
        });
    })
});