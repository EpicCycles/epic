import React from 'react';
import {NEW_ELEMENT_ID} from "../../../helpers/constants";
import PartDisplayGridRow from "../PartDisplayGridRow";
import {findDataTest} from "../../../../../test/jest_helpers/assert";

const brands = [
    { id: 1, brand_name: "brand 1" },
    { id: 2, brand_name: "brand 2", supplier: [], supplier_names: [] },
    { id: 3, brand_name: "brand 3", supplier: [1], supplier_names: ["supplier 1"] },
    { id: 4, brand_name: "brand 4", delete: true },
    { id: 5, brand_name: "brand 5", changed: true, supplier: [1, 3], supplier_names: ["supplier 1", "supplier 3"] },
    { dummyKey: "123ABC", brand_name: "brand new", changed: true },
    { dummyKey: NEW_ELEMENT_ID, brand_name: "brand new 2", changed: true },
];
const sections = [
    {
        id: 1,
        name: 'section 1 name',
        partTypes: [
            {
                id: 1,
            },
            {
                id: 3,
                can_be_substituted: true,
            },
        ]
    },
    {
        id: 2,
        name: 'Groupset',
        partTypes: [
            {
                id: 9,
            },
            {
                id: 12,
                can_be_substituted: true,
                can_be_omitted: true,
            },
            {
                id: 14,
                can_be_omitted: true,
            },
        ]
    },
    {
        id: 3,
        name: 'section 3 name',
        partTypes: [
            {
                id: 171,
            },
        ]
    },
];
const partFixed = { id: 11, partType: 1 };
const partEditable = { id: 13, partType: 3 };
const partDeletable = { id: 214, partType: 14 };
const partAll = { id: 212, partType: 12 };

const suppliers = [
    { id: 12, name: "supplier Name" },
    { id: 22, name: "supplier Name 2" },
];
const supplierProducts = [
    {
        id: 121,
        supplier: 12,
        part: 13,
        product_code: 'PC101',
        fitted_price: 23.99,
        ticket_price: 24.99,
        rrp: 24.99,
        trade_price: 11,
        club_price: 22.99,
        check_date: new Date("2015-03-25T12:00:00-06:30"),
    },
    {
        id: 121,
        supplier: 12,
        part: 13,
        product_code: 'PC101',
        fitted_price: 23.99,
        ticket_price: 24.99,
        rrp: 24.99,
        trade_price: 11,
        club_price: 22.99,
        check_date: new Date("2015-03-25T12:00:00-06:30"),
    },
    {
        id: 121,
        supplier: 12,
        part: 214,
        product_code: 'PC101',
        fitted_price: 23.99,
        ticket_price: 24.99,
        rrp: 24.99,
        trade_price: 11,
        club_price: 22.99,
        check_date: new Date("2015-03-25T12:00:00-06:30"),
    },
];
test('should display just part when supplier products not required', () => {
    const component = shallow(<PartDisplayGridRow
        part={partFixed}
        sections={sections}
        section={{ id: 1, name: 'section 1 name', }}
        lockFirstColumn={true}
        typeIndex={0}
        supplierProducts={supplierProducts}
        brands={brands}
    />);
    expect(component.find('PartViewRow').length).toBe(1);
    expect(component.find('SupplierProductViewRow').length).toBe(0);
    expect(component.find('Icon').length).toBe(0);
    expect(findDataTest(component, 'section-cell').text()).toBe('section 1 name');
    expect(findDataTest(component, 'part-actions').length).toBe(0);
});
test('should not show section name when this is not the first row in a section', () => {
    const component = shallow(<PartDisplayGridRow
        part={partFixed}
        sections={sections}
        section={{ id: 1, name: 'section 1 name', }}
        lockFirstColumn={true}
        typeIndex={1}
        supplierProducts={supplierProducts}
        brands={brands}
    />);
    expect(component.find('PartViewRow').length).toBe(1);
    expect(component.find('SupplierProductViewRow').length).toBe(0);
    expect(component.find('Icon').length).toBe(0);
    expect(findDataTest(component, 'section-cell').text()).toBe('');
    expect(findDataTest(component, 'part-actions').length).toBe(0);
});
test('should show the actions cell when no actions are valid', () => {
    const component = shallow(<PartDisplayGridRow
        part={partFixed}
        sections={sections}
        section={{ id: 1, name: 'section 1 name', }}
        lockFirstColumn={true}
        typeIndex={1}
        supplierProducts={supplierProducts}
        brands={brands}
        includeActions={true}
        editPart={jest.fn()}
        deletePart={jest.fn()}
    />);
    expect(component.find('PartViewRow').length).toBe(1);
    expect(component.find('SupplierProductViewRow').length).toBe(0);
    expect(component.find('Icon').length).toBe(0);
    expect(findDataTest(component, 'part-actions').length).toBe(1);
});
test('should show a part and supplier products when a single supplier product exists', () => {
    const component = shallow(<PartDisplayGridRow
        part={partEditable}
        sections={sections}
        section={{ id: 1, name: 'section 1 name', }}
        lockFirstColumn={true}
        typeIndex={1}
        supplierProducts={supplierProducts}
        brands={brands}
        includeActions={true}
        showSupplierProducts={true}
        editPart={jest.fn()}
        deletePart={jest.fn()}
    />);
    expect(component.find('PartViewRow').length).toBe(1);
    expect(component.find('SupplierProductViewRow').length).toBe(2);
    expect(component.find('Icon').length).toBe(1);
    expect(findDataTest(component, 'part-actions').length).toBe(1);
    expect(findDataTest(component, 'edit-icon').length).toBe(1);
});
test('should show a part and multiple supplier products when multiple supplier product exists', () => {
    const component = shallow(<PartDisplayGridRow
        part={partDeletable}
        sections={sections}
        section={{ id: 1, name: 'section 1 name', }}
        lockFirstColumn={true}
        typeIndex={1}
        supplierProducts={supplierProducts}
        brands={brands}
        includeActions={true}
        showSupplierProducts={true}
        editPart={jest.fn()}
        deletePart={jest.fn()}
    />);
    expect(component.find('PartViewRow').length).toBe(1);
    expect(component.find('SupplierProductViewRow').length).toBe(1);
    expect(component.find('Icon').length).toBe(1);
    expect(findDataTest(component, 'part-actions').length).toBe(1);
    expect(findDataTest(component, 'delete-icon').length).toBe(1);
});
test('should show both edit and delete when a part type is valid for both', () => {
    const component = shallow(<PartDisplayGridRow
        part={partAll}
        sections={sections}
        section={{ id: 1, name: 'section 1 name', }}
        lockFirstColumn={true}
        typeIndex={1}
        supplierProducts={supplierProducts}
        brands={brands}
        includeActions={true}
        showSupplierProducts={true}
        editPart={jest.fn()}
        deletePart={jest.fn()}
    />);
    expect(component.find('PartViewRow').length).toBe(1);
    expect(component.find('SupplierProductViewRow').length).toBe(1);
    expect(component.find('Icon').length).toBe(2);
    expect(findDataTest(component, 'part-actions').length).toBe(1);
    expect(findDataTest(component, 'delete-icon').length).toBe(1);
    expect(findDataTest(component, 'edit-icon').length).toBe(1);
});
test('should invoke passed edit function when icon is clicked', () => {
    const editFunction = jest.fn();
    const component = shallow(<PartDisplayGridRow
        part={partAll}
        sections={sections}
        section={{ id: 1, name: 'section 1 name', }}
        lockFirstColumn={true}
        typeIndex={1}
        supplierProducts={supplierProducts}
        brands={brands}
        includeActions={true}
        showSupplierProducts={true}
        editPart={editFunction}
        deletePart={jest.fn()}
    />);
    expect(component.find('SupplierProductViewRow').length).toBe(1);
    findDataTest(component, 'edit-icon').simulate('click');
    expect(editFunction).toHaveBeenCalledTimes(1);

});
test('should invoke passed delete function when icon is clicked', () => {
    const deleteFunction = jest.fn();
    const component = shallow(<PartDisplayGridRow
        part={partAll}
        sections={sections}
        section={{ id: 1, name: 'section 1 name', }}
        lockFirstColumn={true}
        typeIndex={1}
        supplierProducts={supplierProducts}
        brands={brands}
        includeActions={true}
        showSupplierProducts={true}
        editPart={jest.fn()}
        deletePart={deleteFunction}
    />);
    findDataTest(component, 'delete-icon').simulate('click');
    expect(deleteFunction).toHaveBeenCalledTimes(1);
});