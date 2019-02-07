import React from 'react';
import {assertComponentHasExpectedProps} from "../../../../test/assert";
import PartFinder from "../PartFinder";
import {NEW_ELEMENT_ID} from "../../../helpers/constants";
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

const parts = [
    {
        id: 65,
        part_name: 'A-Head Tapered Cartridge aluminium',
        trade_in_price: null,
        standard: false,
        stocked: false,
        partType: 3,
        brand: 3
    },
    {
        id: 329,
        brand_name: "Shimano",
        part_name: 'SLX M7000 rapidfire',
        trade_in_price: null,
        standard: false,
        stocked: false,
        partType: 5,
        brand: 6
    },
    {
        id: 330,
        brand_name: "Shimano",
        part_name: 'Deore XT M8000 Shadow Plus 11 speed',
        trade_in_price: null,
        standard: false,
        stocked: false,
        partType: 7,
        brand: 6
    },
];

test('should render with minimum information', () => {
    const props = {
        sections: sampleSections,
        brands,
        savePart: jest.fn(),
        deletePart: jest.fn(),
        findParts: jest.fn(),
        partActionPrimary: jest.fn(),
        partActionPrimaryIcon: 'meh',
        partActionPrimaryTitle: 'select'
    };
    const component = shallow(<PartFinder {...props}/>);
    expect(component).toMatchSnapshot();
    const PartTypeSelect = component.find('PartTypeSelect');
    assertComponentHasExpectedProps(PartTypeSelect, {
        sections: props.sections,
        isEmptyAllowed: true,
    });
    const BrandSelect = component.find('BrandSelect');
    assertComponentHasExpectedProps(BrandSelect, {
        brands: props.brands,
        isEmptyAllowed: true,
    });
});
test('should render with maximum information', () => {
    const props = {
        sections: sampleSections,
        brands,
        parts,
        part: parts[2],
        partType: parts[2].partType,
        savePart: jest.fn(),
        deletePart: jest.fn(),
        findParts: jest.fn(),
        partActionPrimary: jest.fn(),
        partActionPrimaryIcon: 'meh',
        partActionPrimaryTitle: 'select',
        partActionSecondary: jest.fn(),
        partActionSecondaryIcon: 'delete',
        partActionSecondaryTitle: 'Delete me'
    };
    const component = shallow(<PartFinder {...props}/>);
    expect(component).toMatchSnapshot();
    const PartTypeSelect = component.find('PartTypeSelect');
    assertComponentHasExpectedProps(PartTypeSelect, {
        sections: props.sections,
        isEmptyAllowed: true,
    });
    const BrandSelect = component.find('BrandSelect');
    assertComponentHasExpectedProps(BrandSelect, {
        brands: props.brands,
        isEmptyAllowed: true,
    });
    const PartSelect = component.find('PartSelect');
    assertComponentHasExpectedProps(BrandSelect, {
        brands: props.brands,
        partSelected: parts[2],
    });
});