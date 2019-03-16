import React from "react";
import EditModelPageViewOnlyRow from "../EditModelPageViewOnlyRow";
import {ADD_DATE_FIELD, ADDRESS1_FIELD} from "../helpers/fields";
import {NEW_ELEMENT_ID} from "../../../../helpers/constants";

const foundName = "find me";
const sections = [
    {
        id: 1,
        partTypes: [
            { id: 11, name: "id 11" },
            { id: 21, name: "id 11" },
        ]
    },
    {
        id: 2,
        partTypes: [
            { id: 2, name: foundName },
            { id: 22, name: "id 11" },
        ]
    },
];
const brands = [
    { id: 1, brand_name: "id is 1" },
    { id: 2, brand_name: foundName },
    { id: 3, brand_name: "id is 3" },
];
const suppliers = [
    { id: 1, supplier_name: "id is 1" },
    { id: 2, supplier_name: foundName },
    { id: 3, supplier_name: "id is 3" },
];
const emptyModel = {};
const model = {
    id: 123,
    address1: "line one",
    address2: "line Ywo",
    address3: "line Three",
    address4: "line Four",
    postcode: "xxxyyy",
    customer: 6
};
describe('EditModelPageViewOnlyRow', () => {

    test("should cope when there is no model", () => {
        const component = shallow(<EditModelPageViewOnlyRow
            model={emptyModel}
            field={ADDRESS1_FIELD}
            index={12}
            componentKey={NEW_ELEMENT_ID}
        />);
        expect(component.type()).toEqual(null);
    });
    test("should show a field when it is there", () => {
        const component = shallow(<EditModelPageViewOnlyRow
            model={model}
            field={ADDRESS1_FIELD}
            componentKey={1}
            index={2}
            className="red"
            suppliers={suppliers}
            sections={sections}
            brands={brands}
        />);
        expect(component).toMatchSnapshot();
    });
    test("should show nothing if the field has no data", () => {
        const component = shallow(<EditModelPageViewOnlyRow
            model={model}
            field={ADD_DATE_FIELD}
            componentKey={1}
            index={2}
            className="red"
            suppliers={suppliers}
            sections={sections}
            brands={brands}
        />);
        expect(component.type()).toEqual(null);
    });
});