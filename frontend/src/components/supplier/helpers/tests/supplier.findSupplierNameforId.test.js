import {findSupplierNameforId} from "../supplier";

const suppliers = [
    { id: 1, supplier_name: "id is 1" },
    { id: 2, supplier_name: "id is 2" },
    { id: 3, supplier_name: "id is 3" },
];
describe('findSupplierNameforId', () => {
    it('should return undefined when no supplier id is passed', () => {
        expect(findSupplierNameforId(undefined, suppliers)).not.toBeDefined();
    });
    it('should return a value when a supplier id is passed that is found', () => {
        expect(findSupplierNameforId(2, suppliers)).toBe("id is 2");
    });
    it('should return a value when a supplier id is passed that is not found', () => {
        expect(findSupplierNameforId(22, suppliers)).toBe("Unknown Supplier");
    });
});