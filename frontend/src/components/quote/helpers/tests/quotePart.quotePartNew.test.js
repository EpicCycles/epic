import {
    ADDITIONAL_DATA_FIELD,
    NOT_REQUIRED_FIELD,
    PART_DESC_FIELD,
    PART_PRICE_FIELD,
    SUPPLIER_FIELD_DISABLED,
    TRADE_IN_PRICE_FIELD_DISABLED
} from "../quotePartFields";
import {CLUB_PRICE_FIELD, PART_TYPE_FIELD, QUANTITY_FIELD, TICKET_PRICE_FIELD} from "../../../app/model/helpers/fields";
import {updateObject} from "../../../../helpers/utils";
import {quotePartNew} from "../quotePart";

describe('quotePartNew', () => {
    it('should return bike fields when quote is a bike quote', () => {
        const quote = { id: 23, bike: 58 };
        const expectedResults = [
            PART_TYPE_FIELD,
            NOT_REQUIRED_FIELD,
            TRADE_IN_PRICE_FIELD_DISABLED,
            updateObject(PART_DESC_FIELD, { listId: 'parts-all', }),
            QUANTITY_FIELD,
            PART_PRICE_FIELD,
            SUPPLIER_FIELD_DISABLED,
            ADDITIONAL_DATA_FIELD
        ];
        expect(quotePartNew(quote)).toEqual(expectedResults)
    })
    it('should return no bike fields when quote is not a bike quote', () => {
        const quote = { id: 23, club_member: false };
        const expectedResults = [
            PART_TYPE_FIELD,
            updateObject(PART_DESC_FIELD, { listId: 'parts-all', }),
            QUANTITY_FIELD,
            TICKET_PRICE_FIELD,
            SUPPLIER_FIELD_DISABLED,
            ADDITIONAL_DATA_FIELD
        ];
        expect(quotePartNew(quote)).toEqual(expectedResults)
    })
    it('should return club price fields when quote is not a bike quote and is for a club member', () => {
        const quote = { id: 23, club_member: true };
        const expectedResults = [
            PART_TYPE_FIELD,
            updateObject(PART_DESC_FIELD, { listId: 'parts-all', }),
            QUANTITY_FIELD,
            TICKET_PRICE_FIELD,
            CLUB_PRICE_FIELD,
            SUPPLIER_FIELD_DISABLED,
            ADDITIONAL_DATA_FIELD
        ];
        expect(quotePartNew(quote)).toEqual(expectedResults)
    })
})