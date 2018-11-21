import React from 'react';
import BrandEdit from "../../../containers/brand/BrandEdit";
import {NEW_ELEMENT_ID} from "../../../helpers/constants";
// props are: brand, componentKey, pickUpBrand
test('BrandEdit shows new brand without supplier correctly', () => {
    const brand = {brand_name: "e brand 8", link: "https://bianchi.co.uk", id: 8};
    const componentKey = NEW_ELEMENT_ID;
    const pickUpBrand = jest.fn();
    const component = shallow(<BrandEdit brand={brand} componentKey={componentKey} pickUpBrand={pickUpBrand}/>);
    expect(component).toMatchSnapshot();
});
test('BrandEdit should call the passed drag function if provided when mouse down', () => {
    const brand = {brand_name: "e brand 8", link:"https://bianchi.co.uk", id:8, supplier:'34'};
    const componentKey = brand.id;
    const pickUpBrand = jest.fn();

    const component = shallow(<BrandEdit brand={brand} componentKey={componentKey} pickUpBrand={pickUpBrand}/>);
    expect(component).toMatchSnapshot();
    // TODO could try and test draggable - https://medium.freecodecamp.org/how-to-write-better-tests-for-drag-and-drop-operations-in-the-browser-f9a131f0b281
});