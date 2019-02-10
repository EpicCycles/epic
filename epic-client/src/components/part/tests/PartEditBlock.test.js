import React from 'react';
import PartEditBlock from "../PartEditBlock";
import {sampleSections} from "../../../helpers/sampleData";

const brands = [
    { id: 1, brand_name: "brand 1" },
    { id: 2, brand_name: "brand 2", supplier: [], supplier_names: [] },
    { id: 3, brand_name: "brand 3", supplier: [1], supplier_names: ["supplier 1"] },
    { id: 4, brand_name: "brand 4", delete: true },
    { id: 5, brand_name: "brand 5", changed: true, supplier: [1, 3], supplier_names: ["supplier 1", "supplier 3"] },
    { dummyKey: "123ABC", brand_name: "brand new", changed: true },
    { dummyKey: NEW_ELEMENT_ID, brand_name: "brand new 2", changed: true },
];

import {NEW_ELEMENT_ID} from "../../../helpers/constants";

test('should display just delete when a part is unchanged', () => {
    const part = {
        id: 1,
        partType: 12,
        brand: 12,
        part_name: "a part name",
        trade_in_price: 24.99,
        standard: false,
        stocked: false
    };
    const persistedPart = {
        id: 1,
        partType: 12,
        brand: 12,
        part_name: "a part name",
        trade_in_price: 24.99,
        standard: false,
        stocked: false
    };
    const component = shallow(<PartEditBlock
        part={part}
        persistedPart={persistedPart}
        partTypeEditable={false}
        componentKey={1}
        sections={sampleSections}
        brands={brands}
        onChange={jest.fn()}
        savePart={jest.fn()}
        resetPart={jest.fn()}
        deletePart={jest.fn()}
    />);
    expect(component).toMatchSnapshot();
    expect(component.find('Icon').length).toBe(1);
});
test('should display delete and reset when a part is changed but has errors', () => {
    const part = {
        id: 1,
        partType: 12,
        brand: 12,
        part_name: "a part name",
        trade_in_price: 24.99,
        standard: true,
        stocked: true,
        changed: true,
        error: "has an error"
    };
    const persistedPart = {
        id: 1,
        partType: 12,
        brand: 12,
        part_name: "a part name",
        trade_in_price: 24.99,
        standard: false,
        stocked: false
    };
    const component = shallow(<PartEditBlock
        part={part}
        persistedPart={persistedPart}
        partTypeEditable={false}
        componentKey={1}
        sections={sampleSections}
        brands={brands}
        onChange={jest.fn()}
        savePart={jest.fn()}
        resetPart={jest.fn()}
        deletePart={jest.fn()}
    />);
    expect(component).toMatchSnapshot();
    expect(component.find('Icon').length).toBe(2);
});
test('should display all icons when a part is changed', () => {
    const part = {
        id: 1,
        partType: 12,
        brand: 12,
        part_name: "a part name",
        trade_in_price: 24.99,
        standard: true,
        stocked: true,
        changed: true,
    };
    const persistedPart = {
        id: 1,
        partType: 12,
        brand: 12,
        part_name: "a part name",
        trade_in_price: 24.99,
        standard: false,
        stocked: false
    };
    const component = shallow(<PartEditBlock
        part={part}
        persistedPart={persistedPart}
        partTypeEditable={false}
        componentKey={1}
        sections={sampleSections}
        brands={brands}
        onChange={jest.fn()}
        savePart={jest.fn()}
        resetPart={jest.fn()}
        deletePart={jest.fn()}
    />);
    expect(component).toMatchSnapshot();
    expect(component.find('Icon').length).toBe(3);
});