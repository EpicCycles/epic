import React from "react";
import ViewModelBlock from "../ViewModelBlock";
import {customerAddressFields} from "../helpers/fields";

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
describe('ViewModelBlock', () => {

    it("it renders", () => {
        const component = shallow(<ViewModelBlock model={emptyModel} modelFields={customerAddressFields}/>);
        expect(component).toMatchSnapshot();
    });
    it("it renders with data", () => {
        const component = shallow(<ViewModelBlock
            model={model}
            modelFields={customerAddressFields}
            className="red"
            suppliers={suppliers}
            sections={sections}
            brands={brands}
        />);
        expect(component).toMatchSnapshot();
    });
});