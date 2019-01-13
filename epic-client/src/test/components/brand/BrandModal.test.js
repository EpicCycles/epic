import React from 'react';

import BrandModal from "../../../components/brand/BrandModal";
import {BRAND_NAME_MISSING} from "../../../helpers/error";
import {NEW_ELEMENT_ID} from "../../../helpers/constants";

const suppliers = [
    { id: 1, supplier_name: "supplier 1" },
    { id: 2, supplier_name: "supplier 2" },
    { id: 3, supplier_name: "supplier 3" },
    { id: 4, supplier_name: "supplier 4" },
];

test("BrandModal displays correctly for a new brand", () => {
    const component = shallow(<BrandModal
        brand={{}}
        componentKey={NEW_ELEMENT_ID}
        brandModalOpen={true}
        deleteBrand={jest.fn()}
        saveBrand={jest.fn()}
        closeBrandModal={jest.fn()}
        suppliers={suppliers}
    />);
    expect(component).toMatchSnapshot();
});
test("BrandModal displays correctly for a brand", () => {
    const brand = {
        brand_name: "e brand 8",
        link: "https://bianchi.co.uk",
        id: 8,
        supplier: [23, 1, 2, 45, 16],
        supplier_names: ["name 23", "name 1", "name 2", "name 45", "name 16"],
    };
    const componentKey = brand.id;
    const component = shallow(<BrandModal
        brandModalOpen={true}
        brand={brand}
        componentKey={componentKey}
        suppliers={suppliers}
        deleteBrand={jest.fn()}
        saveBrand={jest.fn()}
        closeBrandModal={jest.fn()}
    />);
    expect(component).toMatchSnapshot();
});
test("BrandModal value changes processing 1", () => {
    const brand = {
        brand_name: "e brand 8",
        link: "https://bianchi.co.uk",
        id: 8,
        supplier: [23, 1, 2, 45, 16],
        supplier_names: ["name 23", "name 1", "name 2", "name 45", "name 16"],
    };
    const componentKey = brand.id;
    const component = shallow(<BrandModal
        brandModalOpen={true}
        brand={brand}
        componentKey={componentKey}
        suppliers={suppliers}
        deleteBrand={jest.fn()}
        saveBrand={jest.fn()}
        closeBrandModal={jest.fn()}
    />);

    //brand name change to no value
    component.instance().handleBrandValueChange("brand_name", "");
    const expectedData = Object.assign({}, brand, {
        brand_name: "",
        changed: true,
        error_detail: {brand_name: BRAND_NAME_MISSING},
    })
    expect(component.state('brand')).toEqual(expectedData);

});
test("BrandModal value changes processing 2", () => {
    const brand = {
        brand_name: "e brand 8",
        link: "https://bianchi.co.uk",
        id: 8,
        supplier: [23, 1, 2, 45, 16],
        supplier_names: ["name 23", "name 1", "name 2", "name 45", "name 16"],
    };
    const componentKey = brand.id;
    const component = shallow(<BrandModal
        brandModalOpen={true}
        brand={brand}
        componentKey={componentKey}
 suppliers={suppliers}
        deleteBrand={jest.fn()}
        saveBrand={jest.fn()}
        closeBrandModal={jest.fn()}
    />);

    //brand name change to value
    component.instance().handleBrandValueChange("brand_name", "new brand name");
    const expectedData = Object.assign({}, brand, {
        brand_name: "new brand name",
        changed: true,
        error_detail: {}
    });
    expect(component.state('brand')).toEqual(expectedData);

});
test("BrandModal value changes processing 3", () => {
    const brand = {
        brand_name: "e brand 8",
        link: "https://bianchi.co.uk",
        id: 8,
        supplier: [23, 1, 2, 45, 16],
        supplier_names: ["name 23", "name 1", "name 2", "name 45", "name 16"],
    };
    const componentKey = brand.id;
    const component = shallow(<BrandModal
        brandModalOpen={true}
        brand={brand}
        componentKey={componentKey}
        suppliers={suppliers}
        deleteBrand={jest.fn()}
        saveBrand={jest.fn()}
        closeBrandModal={jest.fn()}
    />);

    //link change to no value
    component.instance().handleBrandValueChange("link", "");
    const expectedData = Object.assign({}, brand, { link: "", changed: true, error_detail: {} });
    expect(component.state('brand')).toEqual(expectedData);
});
test("BrandModal value changes processing 4", () => {
    const brand = {
        brand_name: "e brand 8",
        link: "https://bianchi.co.uk",
        id: 8,
        supplier: [23, 1, 2, 45, 16],
        supplier_names: ["name 23", "name 1", "name 2", "name 45", "name 16"],
    };
    const componentKey = brand.id;
    const component = shallow(<BrandModal
        brandModalOpen={true}
        brand={brand}
        componentKey={componentKey}
        suppliers={suppliers}
        deleteBrand={jest.fn()}
        saveBrand={jest.fn()}
        closeBrandModal={jest.fn()}
    />);

    //link change to new value
    component.instance().handleBrandValueChange("link", "myLink.co.uk");
    const expectedData = Object.assign({}, brand, {
        link: "myLink.co.uk",
        changed: true,
        error_detail: {}
    });
    expect(component.state('brand')).toEqual(expectedData);
});
test("BrandModal value changes processing 5", () => {
    const brand = {
        brand_name: "e brand 8",
        link: "https://bianchi.co.uk",
        id: 8,
        supplier: [23, 1, 2, 45, 16],
        supplier_names: ["name 23", "name 1", "name 2", "name 45", "name 16"],
    };
    const componentKey = brand.id;
    const component = shallow(<BrandModal
        brandModalOpen={true}
        brand={brand}
        componentKey={componentKey}
        suppliers={suppliers}
        deleteBrand={jest.fn()}
        saveBrand={jest.fn()}
        closeBrandModal={jest.fn()}
    />);

    //supplier list changes
    component.instance().handleBrandValueChange("supplier", [suppliers[1].id]);
    const expectedData = Object.assign({}, brand, {
        supplier: [suppliers[1].id],
        supplier_names: [suppliers[1].supplier_name],
        changed: true,
        error_detail: {}
    });
    expect(component.state('brand')).toEqual(expectedData);
});