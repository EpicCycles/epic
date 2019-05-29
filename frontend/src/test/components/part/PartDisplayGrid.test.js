import React from 'react';
import toJson from 'enzyme-to-json';
import {NEW_ELEMENT_ID} from "../../../helpers/constants";
import PartDisplayGrid from "../../../components/part/PartDisplayGrid";


const brands = [
  { id: 1, brand_name: 'brand 1' },
  { id: 2, brand_name: 'brand 2', supplier: [] },
  { id: 3, brand_name: 'brand 3', supplier: [1] },
  { id: 4, brand_name: 'brand 4', delete: true },
  {
    id: 5,
    brand_name: 'brand 5',
    changed: true,
    supplier: [1, 3],
  },
  { dummyKey: '123ABC', brand_name: 'brand new', changed: true },
  { dummyKey: NEW_ELEMENT_ID, brand_name: 'brand new 2', changed: true },
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
      },
    ],
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
      },
      {
        id: 14,
      },
    ],
  },
  {
    id: 3,
    name: 'section 3 name',
    partTypes: [
      {
        id: 171,
      },
    ],
  },
];
const parts = [
  { id: 11, partType: 1 },
  { id: 13, partType: 3 },
  { id: 214, partType: 14 },
  { id: 212, partType: 12 },
  { id: 29, partType: 9 },
  { id: 3171, partType: 171 },
];
const suppliers = [{ id: 12, name: 'supplier Name' }, { id: 22, name: 'supplier Name 2' }];
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
    check_date: new Date('2015-03-25T12:00:00-06:30'),
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
    check_date: new Date('2015-03-25T12:00:00-06:30'),
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
    check_date: new Date('2015-03-25T12:00:00-06:30'),
  },
];
test('should display just parts when supplier products not required', () => {
  const component = shallow(<PartDisplayGrid parts={parts} sections={sections} brands={brands} />);
  expect(toJson(component)).toMatchSnapshot();
  expect(component.find('PartDisplayGridRow')).toHaveLength(6);
});
test('should display parts and supplier parts when supplier products are required', () => {
  const component = shallow(
    <PartDisplayGrid
      lockFirstColumn
      showSupplierProducts
      parts={parts}
      sections={sections}
      brands={brands}
      supplierProducts={supplierProducts}
      suppliers={suppliers}
    />,
  );
  expect(toJson(component)).toMatchSnapshot();
  expect(component.find('PartDisplayGridRow')).toHaveLength(6);
});
