import React from 'react';
import toJson from 'enzyme-to-json';
import BrandEdit from '../../../components/brand/BrandEdit';
import { NEW_ELEMENT_ID } from '../../../helpers/constants';
import { BRAND_NAME_MISSING } from '../../../components/app/model/helpers/error';
describe('BrandEdit', () => {
  // props are: brand, componentKey, pickUpBrand
  it('should shows new brand without supplier correctly', () => {
    const brand = { brand_name: 'e brand 8', link: 'https://bianchi.co.uk', id: 8 };
    const componentKey = NEW_ELEMENT_ID;
    const pickUpBrand = jest.fn();
    const component = shallow(
      <BrandEdit brand={brand} componentKey={componentKey} pickUpBrand={pickUpBrand} />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });
  it('should pass a brand change and errors to an existing brand to the supplied function', () => {
    const brand = { brand_name: 'e brand 8', link: 'https://bianchi.co.uk', id: 8, supplier: '34' };
    const componentKey = brand.id;
    const pickUpBrand = jest.fn();
    const handleBrandChange = jest.fn();

    const component = shallow(
      <BrandEdit
        brand={brand}
        componentKey={componentKey}
        pickUpBrand={pickUpBrand}
        handleBrandChange={handleBrandChange}
      />,
    );
    component.instance().handleBrandValueChange('brand_name', '');
    expect(handleBrandChange.mock.calls).toHaveLength(1);
    expect(handleBrandChange.mock.calls[0][0]).toBe(componentKey);
    expect(handleBrandChange.mock.calls[0][1].id).toBe(brand.id);
    expect(handleBrandChange.mock.calls[0][1].brand_name).toBe(null);
    expect(handleBrandChange.mock.calls[0][1].error_detail).toEqual({
      brand_name: BRAND_NAME_MISSING,
    });
  });
  it('BrandEdit should set up a new brand as requested', () => {
    const brand = { brand_name: 'e brand 8', link: 'https://bianchi.co.uk', supplier: '34' };
    const componentKey = NEW_ELEMENT_ID;
    const pickUpBrand = jest.fn();
    const handleBrandChange = jest.fn();

    const component = shallow(
      <BrandEdit
        brand={brand}
        componentKey={componentKey}
        pickUpBrand={pickUpBrand}
        handleBrandChange={handleBrandChange}
      />,
    );
    component.instance().addAnother();
    expect(handleBrandChange.mock.calls).toHaveLength(1);
    expect(handleBrandChange.mock.calls[0][0]).toBe(componentKey);
    expect(handleBrandChange.mock.calls[0][1].id).toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].dummyKey).not.toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].brand_name).toBe(brand.brand_name);
    expect(handleBrandChange.mock.calls[0][1].link).toBe(brand.link);
  });
  it('should pass a brand change and errors to an new brand to the supplied function', () => {
    const brand = { brand_name: 'e brand 8', link: 'https://bianchi.co.uk', supplier: '34' };
    const componentKey = NEW_ELEMENT_ID;
    const pickUpBrand = jest.fn();
    const handleBrandChange = jest.fn();

    const component = shallow(
      <BrandEdit
        brand={brand}
        componentKey={componentKey}
        pickUpBrand={pickUpBrand}
        handleBrandChange={handleBrandChange}
      />,
    );
    component.instance().handleBrandValueChange('brand_name', '');
    expect(handleBrandChange.mock.calls).toHaveLength(1);
    expect(handleBrandChange.mock.calls[0][0]).toBe(componentKey);
    expect(handleBrandChange.mock.calls[0][1].id).toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].dummyKey).not.toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].brand_name).toBe(null);
    expect(handleBrandChange.mock.calls[0][1].link).toBe(brand.link);
    expect(handleBrandChange.mock.calls[0][1].error_detail).toEqual({
      brand_name: 'A name is required for the brand',
    });
  });
  it('should pass a brand change to an existing brand to the supplied function', () => {
    const brand = { brand_name: 'e brand 8', link: 'https://bianchi.co.uk', id: 8, supplier: '34' };
    const componentKey = brand.id;
    const pickUpBrand = jest.fn();
    const handleBrandChange = jest.fn();

    const component = shallow(
      <BrandEdit
        brand={brand}
        componentKey={componentKey}
        pickUpBrand={pickUpBrand}
        handleBrandChange={handleBrandChange}
      />,
    );

    component.instance().handleBrandValueChange('brand_name', 'New Name');
    expect(handleBrandChange.mock.calls).toHaveLength(1);
    expect(handleBrandChange.mock.calls[0][0]).toBe(componentKey);
    expect(handleBrandChange.mock.calls[0][1].id).toBe(brand.id);
    expect(handleBrandChange.mock.calls[0][1].brand_name).toBe('New Name');
    expect(handleBrandChange.mock.calls[0][1].error_detail).toEqual({});
  });
  it('should pass a brand change to an new brand to the supplied function', () => {
    const brand = { brand_name: 'e brand 8', link: 'https://bianchi.co.uk', supplier: '34' };
    const componentKey = NEW_ELEMENT_ID;
    const pickUpBrand = jest.fn();
    const handleBrandChange = jest.fn();

    const component = shallow(
      <BrandEdit
        brand={brand}
        componentKey={componentKey}
        pickUpBrand={pickUpBrand}
        handleBrandChange={handleBrandChange}
      />,
    );

    component.instance().handleBrandValueChange('brand_name', 'New Name');
    expect(handleBrandChange.mock.calls).toHaveLength(1);
    expect(handleBrandChange.mock.calls[0][0]).toBe(componentKey);
    expect(handleBrandChange.mock.calls[0][1].id).toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].dummyKey).not.toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].brand_name).toBe('New Name');
    expect(handleBrandChange.mock.calls[0][1].link).toBe(brand.link);
    expect(handleBrandChange.mock.calls[0][1].error_detail).toEqual({});
  });
  it('remove supplier when no suppliers does not fail', () => {
    const brand = { brand_name: 'e brand 8', link: 'https://bianchi.co.uk', id: 8 };
    const componentKey = brand.id;
    const pickUpBrand = jest.fn();
    const handleBrandChange = jest.fn();

    const component = shallow(
      <BrandEdit
        brand={brand}
        componentKey={componentKey}
        pickUpBrand={pickUpBrand}
        handleBrandChange={handleBrandChange}
      />,
    );

    component.instance().removeSupplier('25');
    expect(handleBrandChange.mock.calls).toHaveLength(0);
  });
  it('remove supplier when empty array of suppliers does not fail', () => {
    const brand = {
      brand_name: 'e brand 8',
      link: 'https://bianchi.co.uk',
      id: 8,
      supplier: [],
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
      />,
    );

    component.instance().removeSupplier('25');
    expect(handleBrandChange.mock.calls).toHaveLength(0);
  });
  it('remove supplier when first in array of suppliers does not fail', () => {
    const brand = {
      brand_name: 'e brand 8',
      link: 'https://bianchi.co.uk',
      id: 8,
      supplier: [23, 1, 2, 45, 16],
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
      />,
    );

    component.instance().removeSupplier(23);
    expect(handleBrandChange.mock.calls).toHaveLength(1);
    expect(handleBrandChange.mock.calls[0][0]).toBe(componentKey);
    expect(handleBrandChange.mock.calls[0][1].id).toBe(brand.id);
    expect(handleBrandChange.mock.calls[0][1].dummyKey).toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].brand_name).toBe(brand.brand_name);
    expect(handleBrandChange.mock.calls[0][1].link).toBe(brand.link);
    expect(handleBrandChange.mock.calls[0][1].supplier).toEqual([1, 2, 45, 16]);
  });
  it('remove supplier when last in array of suppliers does not fail', () => {
    const brand = {
      brand_name: 'e brand 8',
      link: 'https://bianchi.co.uk',
      id: 8,
      supplier: [1, 2, 45, 16, 23],
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
      />,
    );

    component.instance().removeSupplier(23);
    expect(handleBrandChange.mock.calls).toHaveLength(1);
    expect(handleBrandChange.mock.calls[0][0]).toBe(componentKey);
    expect(handleBrandChange.mock.calls[0][1].id).toBe(brand.id);
    expect(handleBrandChange.mock.calls[0][1].dummyKey).toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].brand_name).toBe(brand.brand_name);
    expect(handleBrandChange.mock.calls[0][1].link).toBe(brand.link);
    expect(handleBrandChange.mock.calls[0][1].supplier).toEqual([1, 2, 45, 16]);
  });

  it('remove supplier when only one in array of suppliers does not fail', () => {
    const brand = {
      brand_name: 'e brand 8',
      link: 'https://bianchi.co.uk',
      id: 8,
      supplier: [23],
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
      />,
    );

    component.instance().removeSupplier(23);
    expect(handleBrandChange.mock.calls).toHaveLength(1);
    expect(handleBrandChange.mock.calls[0][0]).toBe(componentKey);
    expect(handleBrandChange.mock.calls[0][1].id).toBe(brand.id);
    expect(handleBrandChange.mock.calls[0][1].dummyKey).toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].brand_name).toBe(brand.brand_name);
    expect(handleBrandChange.mock.calls[0][1].link).toBe(brand.link);
    expect(handleBrandChange.mock.calls[0][1].supplier).toEqual([]);
  });

  it('remove supplier when one of array of suppliers does not fail', () => {
    const brand = {
      brand_name: 'e brand 8',
      link: 'https://bianchi.co.uk',
      id: 8,
      supplier: [1, 2, 23, 45, 16],
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
      />,
    );

    component.instance().removeSupplier(23);
    expect(handleBrandChange.mock.calls).toHaveLength(1);
    expect(handleBrandChange.mock.calls[0][0]).toBe(componentKey);
    expect(handleBrandChange.mock.calls[0][1].id).toBe(brand.id);
    expect(handleBrandChange.mock.calls[0][1].dummyKey).toBe(undefined);
    expect(handleBrandChange.mock.calls[0][1].brand_name).toBe(brand.brand_name);
    expect(handleBrandChange.mock.calls[0][1].link).toBe(brand.link);
    expect(handleBrandChange.mock.calls[0][1].supplier).toEqual([1, 2, 45, 16]);
  });
});
