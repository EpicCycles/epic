import React from 'react';
import toJson from 'enzyme-to-json';
import BikeUploadFrame from '../BikeUploadFrame';
import { NEW_ELEMENT_ID } from '../../../helpers/constants';

const brands = [
  { id: 1, brand_name: 'brand 1' },
  { id: 2, brand_name: 'brand 2', supplier: [], supplier_names: [] },
  { id: 3, brand_name: 'brand 3', supplier: [1], supplier_names: ['supplier 1'] },
  { id: 4, brand_name: 'brand 4', delete: true },
  {
    id: 5,
    brand_name: 'brand 5',
    changed: true,
    supplier: [1, 3],
    supplier_names: ['supplier 1', 'supplier 3'],
  },
  { dummyKey: '123ABC', brand_name: 'brand new', changed: true },
  { dummyKey: NEW_ELEMENT_ID, brand_name: 'brand new 2', changed: true },
];
test('upload frame details displays when none entered', () => {
  const component = shallow(<BikeUploadFrame brands={brands} />);
  expect(toJson(component)).toMatchSnapshot();
});
test('upload frame details displays when frame entered', () => {
  const component = shallow(
    <BikeUploadFrame brands={brands} brandSelected={brands[0].id} frameName="bicicletta" />,
  );
  expect(toJson(component)).toMatchSnapshot();
});
