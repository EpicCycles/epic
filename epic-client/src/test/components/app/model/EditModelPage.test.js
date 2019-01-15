import React from "react";
import EditModelPage from "../../../../components/app/model/EditModelPage";
import {customerAddressFields} from "../../../../helpers/models";

const foundName = "find me";
const sections = [
    {
        id: 1,
        partTypes: [
            { id: 11, shortName: "id 11" },
            { id: 21, shortName: "id 11" },
        ]
    },
    {
        id: 2,
        partTypes: [
            { id: 2, shortName: foundName },
            { id: 22, shortName: "id 11" },
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
test("it renders", () => {
    const component = shallow(<EditModelPage model={emptyModel} modelFields={customerAddressFields} onChange={jest.fn()}/>);
    expect(component).toMatchSnapshot();
})
test("it renders with data", () => {
    const component = shallow(<EditModelPage
        model={model}
        modelFields={customerAddressFields}
        onChange={jest.fn()}
        className="red"
        suppliers={suppliers}
        sections={sections}
        brands={brands}
        persistedModel={model}
    />);
    expect(component).toMatchSnapshot();
})