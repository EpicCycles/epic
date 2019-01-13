import React from 'react';
import BrandEdit from "../../../components/brand/BrandEdit";
import {NEW_ELEMENT_ID} from "../../../helpers/constants";
import {BRAND_NAME_MISSING} from "../../../helpers/error";
// props are: brand, componentKey, pickUpBrand
test('BrandEdit shows new brand without supplier correctly', () => {
    const brand = {brand_name: "e brand 8", link: "https://bianchi.co.uk", id: 8};
    const componentKey = NEW_ELEMENT_ID;
    const pickUpBrand = jest.fn();
    const component = shallow(<BrandEdit brand={brand} componentKey={componentKey} pickUpBrand={pickUpBrand}/>);
    expect(component).toMatchSnapshot();
});
test('BrandEdit should pass a brand change and errors to an existing brand to the supplied function', () => {
    const brand = {brand_name: "e brand 8", link: "https://bianchi.co.uk", id: 8, supplier: '34'};
    const componentKey = brand.id;
    const pickUpBrand = jest.fn();
    const handleBrandChange = jest.fn();

    const component = shallow(
        <BrandEdit
            brand={brand}
            componentKey={componentKey}
            pickUpBrand={pickUpBrand}
            handleBrandChange={handleBrandChange}
        />);
    component.instance().handleBrandValueChange("brand_name", "");
    expect(handleBrandChange.mock.calls.length).toBe(1);
    expect(handleBrandChange.mock.calls[0][0]).toBe(componentKey);
    expect(handleBrandChange.mock.calls[0][1].id).toBe(brand.id);
    expect(handleBrandChange.mock.calls[0][1].brand_name).toBe("");
    expect(handleBrandChange.mock.calls[0][1].error_detail).toEqual({brand_name: BRAND_NAME_MISSING});
});
test('BrandEdit should set up a new brand as requested', () => {
    const brand = {brand_name: "e brand 8", link: "https://bianchi.co.uk", supplier: '34'};
    const componentKey = NEW_ELEMENT_ID;
    const pickUpBrand = jest.fn();
    const handleBrandChange = jest.fn();

    const component = shallow(
        <BrandEdit
            brand={brand}
            componentKey={componentKey}
            pickUpBrand={pickUpBrand}
            handleBrandChange={handleBrandChange}
        />);
    component.instance().addAnother();
    expect(handleBrandChange.mock.calls.length).toBe(1);
    expect(handleBrandChange.mock.calls[0][0]).toBe(componentKey);
    expect(handleBrandChange.mock.calls[0][1].id).toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].dummyKey).not.toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].brand_name).toBe(brand.brand_name);
    expect(handleBrandChange.mock.calls[0][1].link).toBe(brand.link);
});
test('BrandEdit should pass a brand change and errors to an new brand to the supplied function', () => {
    const brand = {brand_name: "e brand 8", link: "https://bianchi.co.uk", supplier: '34'};
    const componentKey = NEW_ELEMENT_ID;
    const pickUpBrand = jest.fn();
    const handleBrandChange = jest.fn();

    const component = shallow(
        <BrandEdit
            brand={brand}
            componentKey={componentKey}
            pickUpBrand={pickUpBrand}
            handleBrandChange={handleBrandChange}
        />);
    component.instance().handleBrandValueChange("brand_name", "");
    expect(handleBrandChange.mock.calls.length).toBe(1);
    expect(handleBrandChange.mock.calls[0][0]).toBe(componentKey);
    expect(handleBrandChange.mock.calls[0][1].id).toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].dummyKey).not.toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].brand_name).toBe("");
    expect(handleBrandChange.mock.calls[0][1].link).toBe(brand.link);
    expect(handleBrandChange.mock.calls[0][1].error_detail).toEqual({brand_name: "A name is required for the brand"});
});
test('BrandEdit should pass a brand change to an existing brand to the supplied function', () => {
    const brand = {brand_name: "e brand 8", link: "https://bianchi.co.uk", id: 8, supplier: '34'};
    const componentKey = brand.id;
    const pickUpBrand = jest.fn();
    const handleBrandChange = jest.fn();

    const component = shallow(
        <BrandEdit
            brand={brand}
            componentKey={componentKey}
            pickUpBrand={pickUpBrand}
            handleBrandChange={handleBrandChange}
        />);

    component.instance().handleBrandValueChange("brand_name", "New Name");
    expect(handleBrandChange.mock.calls.length).toBe(1);
    expect(handleBrandChange.mock.calls[0][0]).toBe(componentKey);
    expect(handleBrandChange.mock.calls[0][1].id).toBe(brand.id);
    expect(handleBrandChange.mock.calls[0][1].brand_name).toBe("New Name");
    expect(handleBrandChange.mock.calls[0][1].error_detail).toEqual({});
});
test('BrandEdit should pass a brand change to an new brand to the supplied function', () => {
    const brand = {brand_name: "e brand 8", link: "https://bianchi.co.uk", supplier: '34'};
    const componentKey = NEW_ELEMENT_ID;
    const pickUpBrand = jest.fn();
    const handleBrandChange = jest.fn();

    const component = shallow(
        <BrandEdit
            brand={brand}
            componentKey={componentKey}
            pickUpBrand={pickUpBrand}
            handleBrandChange={handleBrandChange}
        />);

    component.instance().handleBrandValueChange("brand_name", "New Name");
    expect(handleBrandChange.mock.calls.length).toBe(1);
    expect(handleBrandChange.mock.calls[0][0]).toBe(componentKey);
    expect(handleBrandChange.mock.calls[0][1].id).toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].dummyKey).not.toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].brand_name).toBe("New Name");
    expect(handleBrandChange.mock.calls[0][1].link).toBe(brand.link);
    expect(handleBrandChange.mock.calls[0][1].error_detail).toEqual({});
});
test("remove supplier when no suppliers does not fail", () => {
    const brand = {brand_name: "e brand 8", link: "https://bianchi.co.uk", id: 8};
    const componentKey = brand.id;
    const pickUpBrand = jest.fn();
    const handleBrandChange = jest.fn();

    const component = shallow(
        <BrandEdit
            brand={brand}
            componentKey={componentKey}
            pickUpBrand={pickUpBrand}
            handleBrandChange={handleBrandChange}
        />);

    component.instance().removeSupplier("25");
    expect(handleBrandChange.mock.calls.length).toBe(0);
});
test("remove supplier when empty array of suppliers does not fail", () => {
    const brand = {
        brand_name: "e brand 8",
        link: "https://bianchi.co.uk",
        id: 8,
        supplier: [],
        supplier_names: [],
    };
    const componentKey = brand.id;
    const pickUpBrand = jest.fn();
    const handleBrandChange = jest.fn();

    const component = shallow(
        <BrandEdit
            brand={brand}
            componentKey={componentKey}
            pickUpBrand={pickUpBrand}
            handleBrandChange={handleBrandChange}
        />);

    component.instance().removeSupplier("25");
    expect(handleBrandChange.mock.calls.length).toBe(0);
});
test("remove supplier when first in array of suppliers does not fail", () => {
    const brand = {
        brand_name: "e brand 8",
        link: "https://bianchi.co.uk",
        id: 8,
        supplier: [23, 1, 2, 45, 16],
        supplier_names: ["name 23", "name 1", "name 2", "name 45", "name 16"],
    };
    const componentKey = brand.id;
    const pickUpBrand = jest.fn();
    const handleBrandChange = jest.fn();

    const component = shallow(
        <BrandEdit
            brand={brand}
            componentKey={componentKey}
            pickUpBrand={pickUpBrand}
            handleBrandChange={handleBrandChange}
        />);

    component.instance().removeSupplier(23);
    expect(handleBrandChange.mock.calls.length).toBe(1);
    expect(handleBrandChange.mock.calls[0][0]).toBe(componentKey);
    expect(handleBrandChange.mock.calls[0][1].id).toBe(brand.id);
    expect(handleBrandChange.mock.calls[0][1].dummyKey).toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].brand_name).toBe(brand.brand_name);
    expect(handleBrandChange.mock.calls[0][1].link).toBe(brand.link);
    expect(handleBrandChange.mock.calls[0][1].supplier).toEqual([1, 2, 45, 16]);
    expect(handleBrandChange.mock.calls[0][1].supplier_names).toEqual(["name 1", "name 2", "name 45", "name 16"]);
});
test("remove supplier when last in array of suppliers does not fail", () => {

    const brand = {
        brand_name: "e brand 8",
        link: "https://bianchi.co.uk",
        id: 8,
        supplier: [1, 2, 45, 16, 23],
        supplier_names: ["name 1", "name 2", "name 45", "name 16", "name 23"],
    };
    const componentKey = brand.id;
    const pickUpBrand = jest.fn();
    const handleBrandChange = jest.fn();

    const component = shallow(
        <BrandEdit
            brand={brand}
            componentKey={componentKey}
            pickUpBrand={pickUpBrand}
            handleBrandChange={handleBrandChange}
        />);

    component.instance().removeSupplier(23);
    expect(handleBrandChange.mock.calls.length).toBe(1);
    expect(handleBrandChange.mock.calls[0][0]).toBe(componentKey);
    expect(handleBrandChange.mock.calls[0][1].id).toBe(brand.id);
    expect(handleBrandChange.mock.calls[0][1].dummyKey).toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].brand_name).toBe(brand.brand_name);
    expect(handleBrandChange.mock.calls[0][1].link).toBe(brand.link);
    expect(handleBrandChange.mock.calls[0][1].supplier).toEqual([1, 2, 45, 16]);
    expect(handleBrandChange.mock.calls[0][1].supplier_names).toEqual(["name 1", "name 2", "name 45", "name 16"]);
});

test("remove supplier when only one in array of suppliers does not fail", () => {
    const brand = {
        brand_name: "e brand 8",
        link: "https://bianchi.co.uk",
        id: 8,
        supplier: [23],
        supplier_names: ["name 23"],
    };
    const componentKey = brand.id;
    const pickUpBrand = jest.fn();
    const handleBrandChange = jest.fn();

    const component = shallow(
        <BrandEdit
            brand={brand}
            componentKey={componentKey}
            pickUpBrand={pickUpBrand}
            handleBrandChange={handleBrandChange}
        />);

    component.instance().removeSupplier(23);
    expect(handleBrandChange.mock.calls.length).toBe(1);
    expect(handleBrandChange.mock.calls[0][0]).toBe(componentKey);
    expect(handleBrandChange.mock.calls[0][1].id).toBe(brand.id);
    expect(handleBrandChange.mock.calls[0][1].dummyKey).toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].brand_name).toBe(brand.brand_name);
    expect(handleBrandChange.mock.calls[0][1].link).toBe(brand.link);
    expect(handleBrandChange.mock.calls[0][1].supplier).toEqual([]);
    expect(handleBrandChange.mock.calls[0][1].supplier_names).toEqual([]);
});

test("remove supplier when one of array of suppliers does not fail", () => {
    const brand = {
        brand_name: "e brand 8",
        link: "https://bianchi.co.uk",
        id: 8,
        supplier: [1, 2, 23, 45, 16],
        supplier_names: ["name 1", "name 2", "name 23", "name 45", "name 16"],
    };
    const componentKey = brand.id;
    const pickUpBrand = jest.fn();
    const handleBrandChange = jest.fn();

    const component = shallow(
        <BrandEdit
            brand={brand}
            componentKey={componentKey}
            pickUpBrand={pickUpBrand}
            handleBrandChange={handleBrandChange}
        />);

    component.instance().removeSupplier(23);
    expect(handleBrandChange.mock.calls.length).toBe(1);
    expect(handleBrandChange.mock.calls[0][0]).toBe(componentKey);
    expect(handleBrandChange.mock.calls[0][1].id).toBe(brand.id);
    expect(handleBrandChange.mock.calls[0][1].dummyKey).toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].brand_name).toBe(brand.brand_name);
    expect(handleBrandChange.mock.calls[0][1].link).toBe(brand.link);
    expect(handleBrandChange.mock.calls[0][1].supplier).toEqual([1, 2, 45, 16]);
    expect(handleBrandChange.mock.calls[0][1].supplier_names).toEqual(["name 1", "name 2", "name 45", "name 16"]);
});