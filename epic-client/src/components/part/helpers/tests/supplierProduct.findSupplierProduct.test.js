import {findSupplierProduct} from "../supplierProduct";

describe('findSupplierProduct', () => {
    const supplierProducts = [
        { part: 21, id: 1 },
        { part: 22, id: 1 },
        { part: 2, id: 1 },
        { part: 165, id: 12, check_date: '2019-03-31T16:16:35.056467+01:00' },
        { part: 165, id: 13 },
    ];
    it('should return nothing when there are no supplier parts', () => {
        const part = { id: 1 }
        expect(findSupplierProduct(part, [])).not.toBedefined;
    });
    it('should return nothing when there is no matching', () => {
        const part = { id: 1 }
        expect(findSupplierProduct(part, supplierProducts)).not.toBedefined;
    });
    it('should return a single matched product', () => {
        const part = { id: 22 }
        expect(findSupplierProduct(part, supplierProducts)).toEqual({ part: 22, id: 1 });
    })
    it('should return the first matched product', () => {
        const part = { id: 165 };
        expect(findSupplierProduct(part, supplierProducts)).toEqual({
            part: 165,
            id: 12,
            check_date: '2019-03-31T16:16:35.056467+01:00'
        });
    })
});