import React from 'react';
import { NEW_ELEMENT_ID } from '../../../helpers/constants';
import Brands from '../../../components/brand/Brands';
import { addToUniqueArray } from '../../../helpers/utils';

const brands = [
  { id: 1, brand_name: 'brand 1' },
  { id: 2, brand_name: 'brand 2', supplier: [] },
  { id: 3, brand_name: 'brand 3', supplier: [1] },
  { id: 4, brand_name: 'brand 4', delete: true },
  { id: 5, brand_name: 'brand 5', changed: true, supplier: [1, 3] },
  { dummyKey: '123ABC', brand_name: 'brand new', changed: true },
  { dummyKey: NEW_ELEMENT_ID, brand_name: 'brand new 2', changed: true },
];
const suppliers = [
  { id: 1, supplier_name: 'supplier 1' },
  { id: 2, supplier_name: 'supplier 2' },
  { id: 3, supplier_name: 'supplier 3' },
  { id: 4, supplier_name: 'supplier 4' },
];

describe('Brands', () => {
  test('brand change for existing brand calls update with the right brands objects', () => {
    const updateBrands = jest.fn();
    const updatedBrand = Object.assign({}, brands[2], { brand_name: 'updated brand name' });
    let expectedBrands = brands.slice();
    expectedBrands[2] = updatedBrand;

    const component = shallow(
      <Brands brands={brands} suppliers={suppliers} updateBrands={updateBrands} />,
    );

    component.instance().handleBrandChange(updatedBrand.id, updatedBrand);
    expect(updateBrands.mock.calls).toHaveLength(1);
    expect(updateBrands.mock.calls[0][0]).toEqual(expectedBrands);
  });
  test('brand change for new brand calls update with the right brands objects', () => {
    const updateBrands = jest.fn();
    const updatedBrand = {
      dummyKey: 'newDummy',
      brand_name: 'new dummy brand',
    };
    let expectedBrands = brands.slice();
    expectedBrands.push(updatedBrand);

    const component = shallow(
      <Brands brands={brands} suppliers={suppliers} updateBrands={updateBrands} />,
    );

    component.instance().handleBrandChange(updatedBrand.dummyKey, updatedBrand);
    expect(updateBrands.mock.calls).toHaveLength(1);
    expect(updateBrands.mock.calls[0][0]).toEqual(expectedBrands);
  });
  test('does not fail when adding supplier and supplier not found', () => {
    const updateBrands = jest.fn();

    const component = shallow(
      <Brands brands={brands} suppliers={suppliers} updateBrands={updateBrands} />,
    );
    component.instance().addSupplierToBrand(2, 99);
    expect(updateBrands.mock.calls).toHaveLength(0);
  });
  test('does not fail when adding supplier and brand not found', () => {
    const updateBrands = jest.fn();

    const component = shallow(
      <Brands brands={brands} suppliers={suppliers} updateBrands={updateBrands} />,
    );
    component.instance().addSupplierToBrand(99, 2);
    expect(updateBrands.mock.calls).toHaveLength(0);
  });
  test('does not fail when adding supplier and neither brand nor supplier are found', () => {
    const updateBrands = jest.fn();

    const component = shallow(
      <Brands brands={brands} suppliers={suppliers} updateBrands={updateBrands} />,
    );
    component.instance().addSupplierToBrand(99, 98);
    expect(updateBrands.mock.calls).toHaveLength(0);
  });
  test('adds a supplier when no existing array', () => {
    const updateBrands = jest.fn();
    const updatedBrand = Object.assign({}, brands[0], {
      supplier: [suppliers[1].id],
      changed: true,
    });
    let expectedBrands = brands.slice();
    expectedBrands[0] = updatedBrand;

    const component = shallow(
      <Brands brands={brands} suppliers={suppliers} updateBrands={updateBrands} />,
    );
    component.instance().addSupplierToBrand(brands[0].id, suppliers[1].id);
    expect(updateBrands.mock.calls).toHaveLength(1);
    expect(updateBrands.mock.calls[0][0]).toEqual(expectedBrands);
  });
  test('adds a supplier when existing empty array', () => {
    const updateBrands = jest.fn();
    const updatedBrand = Object.assign({}, brands[1], {
      supplier: [suppliers[1].id],
      changed: true,
    });
    let expectedBrands = brands.slice();
    expectedBrands[1] = updatedBrand;

    const component = shallow(
      <Brands brands={brands} suppliers={suppliers} updateBrands={updateBrands} />,
    );
    component.instance().addSupplierToBrand(brands[1].id, suppliers[1].id);
    expect(updateBrands.mock.calls).toHaveLength(1);
    expect(updateBrands.mock.calls[0][0]).toEqual(expectedBrands);
  });
  test('adds a supplier when existing array with entries', () => {
    const updateBrands = jest.fn();
    const updatedBrand = Object.assign({}, brands[2], {
      supplier: addToUniqueArray(brands[2].supplier, suppliers[1].id),
      changed: true,
    });
    let expectedBrands = brands.slice();
    expectedBrands[2] = updatedBrand;
    const component = shallow(
      <Brands brands={brands} suppliers={suppliers} updateBrands={updateBrands} />,
    );
    component.instance().addSupplierToBrand(brands[2].id, suppliers[1].id);
    expect(updateBrands.mock.calls).toHaveLength(1);
  });
  test('does not add a supplier when existing array with entries has it already', () => {
    const updateBrands = jest.fn();
    const updatedBrand = Object.assign({}, brands[4], {
      changed: true,
    });
    let expectedBrands = brands.slice();
    expectedBrands[4] = updatedBrand;
    const component = shallow(
      <Brands brands={brands} suppliers={suppliers} updateBrands={updateBrands} />,
    );
    component.instance().addSupplierToBrand(brands[4].id, suppliers[0].id);
    expect(updateBrands.mock.calls).toHaveLength(1);
  });
});
