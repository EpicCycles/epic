import {getSupplierName} from "../supplier";

const suppliers = [
    { id: 1, supplier_name: "id is 1" },
    { id: 2, supplier_name: "id is 2" },
    { id: 3, supplier_name: "id is 3" },
];
describe('getSupplierName', () => {
    it("if passed no value and no suppliers it returned undefined", () => {
        expect(getSupplierName()).not.toBeDefined();
    });
    it("if passed no value and  suppliers it returned undefined", () => {
        expect(getSupplierName(undefined, suppliers)).not.toBeDefined();
    });
    it("if passed value and no suppliers it returned undefined", () => {
        expect(getSupplierName(2)).toBe("Unknown Supplier");
        expect(getSupplierName(2, 23)).toBe("Unknown Supplier");
        expect(getSupplierName(2, [])).toBe("Unknown Supplier");
    });
    it("if passed an empty value it returned undefined", () => {
        expect(getSupplierName("", suppliers)).not.toBeDefined();
    });
    it("if passed an empty Array it returned an empty array", () => {
        expect(getSupplierName([], suppliers)).toEqual([]);
    });
    it("if passed an value not matched it returned undefined", () => {
        expect(getSupplierName(6, suppliers)).toBe("Unknown Supplier");
    });
    it("if passed an value matched it returned match", () => {
        expect(getSupplierName(1, suppliers)).toEqual("id is 1");
        expect(getSupplierName("1", suppliers)).toEqual("id is 1");
    });
    it("if passed an array including values not matched it returned an array", () => {
        expect(getSupplierName([1, 3, 6], suppliers)).toEqual(["id is 1", "id is 3", "Unknown Supplier"]);
        expect(getSupplierName(["1", "6", "3"], suppliers)).toEqual(["id is 1", "Unknown Supplier", "id is 3"]);
    });
});