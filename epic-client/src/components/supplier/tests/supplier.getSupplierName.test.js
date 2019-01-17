import {getSupplierName} from "../helpers/supplier";

const suppliers = [
    { id: 1, supplier_name: "id is 1" },
    { id: 2, supplier_name: "id is 2" },
    { id: 3, supplier_name: "id is 3" },
];

test("if passed no value and no suppliers it returned undefined", () => {
    expect(getSupplierName()).not.toBeDefined();
});
test("if passed no value and  suppliers it returned undefined", () => {
    expect(getSupplierName(undefined, suppliers)).not.toBeDefined();
});
test("if passed value and no suppliers it returned undefined", () => {
    expect(getSupplierName(2)).not.toBeDefined();
    expect(getSupplierName(2, 23)).not.toBeDefined();
    expect(getSupplierName(2, [])).not.toBeDefined();
});
test("if passed an empty value it returned undefined", () => {
    expect(getSupplierName("", suppliers)).not.toBeDefined();
});
test("if passed an empty Array it returned an empty array", () => {
    expect(getSupplierName([], suppliers)).toEqual([]);
});
test("if passed an value not matched it returned undefined", () => {
    expect(getSupplierName(6, suppliers)).not.toBeDefined();
});
test("if passed an value matched it returned match", () => {
    expect(getSupplierName(1, suppliers)).toEqual("id is 1");
    expect(getSupplierName("1", suppliers)).toEqual("id is 1");
});
test("if passed an array including values not matched it returned an array", () => {
    expect(getSupplierName([1,3,6], suppliers)).toEqual(["id is 1", "id is 3", undefined]);
    expect(getSupplierName(["1", "6", "3"], suppliers)).toEqual(["id is 1", undefined,  "id is 3"]);
});