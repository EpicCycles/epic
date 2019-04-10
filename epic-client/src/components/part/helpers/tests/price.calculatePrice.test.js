import {calculatePrice} from "../price";

describe('calculatePrice', () => {
    const supplierProducts = [
        { id: 1, part: 21, rrp: 12, fitted_price: 23 },
    ];
    const bikePart = { id: 234, trade_in_price: 6.00 };
    const part = { id: 21, trade_in_price: 36.00 };
    const partNoPrices = { id: 2021, trade_in_price: 136.00 };

    it('should return no prices when there is no bike part or supplier part', () => {
        const expectedPrices = { trade_in_price: undefined, part_price: undefined };
        expect(calculatePrice()).toEqual(expectedPrices);
    });
    it('should return a part rrp when no bike part is passed but part is', () => {
        const expectedPrices = { trade_in_price: undefined, part_price: 12 };
        expect(calculatePrice(false, false, part, undefined, supplierProducts)).toEqual(expectedPrices);
    });
    it('should return a part fitted price when no bike part is passed but part is and it is a bike quote', () => {
        const expectedPrices = { trade_in_price: undefined, part_price: 23 };
        expect(calculatePrice(true, false, part, undefined, supplierProducts)).toEqual(expectedPrices);
    });
    it('should return a no price when part has no suplier products', () => {
        const expectedPrices = { trade_in_price: undefined, part_price: undefined };
        expect(calculatePrice(false, false, partNoPrices, undefined, supplierProducts)).toEqual(expectedPrices);
    });
    it('should return a trade in price when bike part has been traded in', () => {
        const expectedPrices = { trade_in_price: 6.0, part_price: undefined };
        expect(calculatePrice(true, true, undefined, bikePart, supplierProducts)).toEqual(expectedPrices);
    });
    it('should not return a trade in price when bike part has not been traded in', () => {
        const expectedPrices = { trade_in_price: undefined, part_price: undefined };
        expect(calculatePrice(true, false, undefined, bikePart, supplierProducts)).toEqual(expectedPrices);
    });
    it('should return a trade in price when bike part has been traded in and replacement part has no prices', () => {
        const expectedPrices = { trade_in_price: 6.0, part_price: undefined };
        expect(calculatePrice(true, true, partNoPrices, bikePart)).toEqual(expectedPrices);
    });
    it('should return both prices when bike part has been traded in and replacement part has prices', () => {
        const expectedPrices = { trade_in_price: 6.0, part_price: 23 };
        expect(calculatePrice(true, true, part, bikePart, supplierProducts)).toEqual(expectedPrices);
    });
});