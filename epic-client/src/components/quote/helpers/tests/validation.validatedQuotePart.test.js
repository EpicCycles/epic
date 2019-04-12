import {quotePartValidation} from "../validation";

describe('validatedQuotePart', () => {
    const normalPartType = { id: 16, can_be_substituted: true, can_be_omitted: true };
    const requiredPartType = { id: 16, can_be_substituted: true, can_be_omitted: false };
    const noAlternatePartType = { id: 16, can_be_substituted: false, can_be_omitted: true };
    const parts = [
        { id: 12, part_name: 'bike', brand: 1, partType: 16 },
        { id: 13, part_name: 'other', brand: 2, partType: 16 },
    ];
    const brands = [
        { id: 1, brand_name: 'B1' },
        { id: 2, brand_name: 'B2' },
    ];
    it('should return no errors when all fields are OK', () => {
        const startPart = {
            part_desc: 'B1 Bike',
            quantity: 1,
            part_price: 12.99,
        };
        const validatedPart = {
            part_desc: 'B1 Bike',
            part: { id: 12, part_name: 'bike', brand: 1, partType: 16 },
            quantity: 1,
            part_price: 12.99,
            trade_in_price: undefined,
            error: false,
            error_detail: {}
        };
        expect(quotePartValidation(startPart, undefined, normalPartType, brands, parts)).toEqual(validatedPart);
    });
    it('should return no errors when all fields are OK for a replacement part', () => {
        const startPart = {
            part_desc: 'B2 other',
            not_required: true,
            trade_in_price: 12.99,
            part_price: 22.99,
        };
        const validatedPart = {
            part_desc: 'B2 other',
            not_required: true,
            quantity: undefined,
            part: { id: 13, part_name: 'other', brand: 2, partType: 16 },
            trade_in_price: 12.99,
            part_price: 22.99,
            error: false,
            error_detail: {}
        };
        expect(quotePartValidation(startPart, undefined, normalPartType, brands, parts)).toEqual(validatedPart);
    });
    it('should return no errors when all fields are OK for an omitted part', () => {
        const startPart = {
            not_required: true,
            trade_in_price: 12.99,
        };
        const validatedPart = {
            not_required: true,
            part: undefined,
            quantity: undefined,
            trade_in_price: 12.99,
            additional_data: undefined,
            error: false,
            error_detail: {}
        };
        expect(quotePartValidation(startPart, undefined, normalPartType, brands, parts)).toEqual(validatedPart);
    });
    it('should return part error when part is not found', () => {
        const startPart = {
            part_desc: 'B3 Bike',
            quantity: 1,
            part_price: 12.99,
        };
        const validatedPart = {
            part_desc: 'B3 Bike',
            part: undefined,
            quantity: undefined,
            trade_in_price: undefined,
            part_price: 12.99,
            additional_data: undefined,
            error: true,
            error_detail: { part_desc: 'Please include a brand in the part name to add this part.' }
        };
        expect(quotePartValidation(startPart, undefined, normalPartType, brands, parts)).toEqual(validatedPart);
    });
    it('should return no price error when new part with no price', () => {
        const startPart = {
            part_desc: 'B1 Bike',
            quantity: 1,
        };
        const validatedPart = {
            part_desc: 'B1 Bike',
            part: { id: 12, part_name: 'bike', brand: 1, partType: 16 },
            trade_in_price: undefined,
            quantity: 1,
            error: true,
            error_detail: {
                part_price: 'Please specify a price.',
            }
        };
        expect(quotePartValidation(startPart, undefined, normalPartType, brands, parts)).toEqual(validatedPart);
    });
    it('should return no errors when price errors when price not provided for a replacement part', () => {
        const startPart = {
            part_desc: 'B2 other',
            not_required: true,
        };
        const validatedPart = {
            part_desc: 'B2 other',
            not_required: true,
            quantity: undefined,
            part: { id: 13, part_name: 'other', brand: 2, partType: 16 },
            error: true,
            error_detail: {
                trade_in_price: 'Please specify a price (can be zero).',
                part_price: 'Please specify a price.',
            }
        };
        expect(quotePartValidation(startPart, undefined, normalPartType, brands, parts)).toEqual(validatedPart);
    });
    it('should return price errors when price not provided for an omitted part', () => {
        const startPart = {
            not_required: true,
        };
        const validatedPart = {
            not_required: true,
            part: undefined,
            quantity: undefined,
            additional_data: undefined,
            error: true,
            error_detail: {
                trade_in_price: 'Please specify a price (can be zero).',
            }
        };
        expect(quotePartValidation(startPart, undefined, normalPartType, brands, parts)).toEqual(validatedPart);
    });
    it('should return a quantity error when this is not a replacement part and there is no quantity', () => {
        const startPart = {
            part_desc: 'B1 Bike',
            part_price: 12.99,
        };
        const validatedPart = {
            part_desc: 'B1 Bike',
            part: { id: 12, part_name: 'bike', brand: 1, partType: 16 },
            part_price: 12.99,
            trade_in_price: undefined,
            error: true,
            error_detail: { quantity: 'Quantity is required for non replacement parts.' }
        };
        expect(quotePartValidation(startPart, undefined, normalPartType, brands, parts)).toEqual(validatedPart);

    })
});