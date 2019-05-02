import React from 'react';
import toJson from 'enzyme-to-json';
import PartSelect from '../PartSelect';
import { NEW_ELEMENT_ID } from '../../../helpers/constants';
import { assertComponentHasExpectedProps } from '../../../../../test/jest_helpers/assert';

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

const parts = [
  {
    id: 65,
    part_name: 'A-Head Tapered Cartridge aluminium',
    trade_in_price: null,
    standard: false,
    stocked: false,
    partType: 3,
    brand: 3,
  },
  {
    id: 329,
    brand_name: 'Shimano',
    part_name: 'SLX M7000 rapidfire',
    trade_in_price: null,
    standard: false,
    stocked: false,
    partType: 5,
    brand: 6,
  },
  {
    id: 330,
    brand_name: 'Shimano',
    part_name: 'Deore XT M8000 Shadow Plus 11 speed',
    trade_in_price: null,
    standard: false,
    stocked: false,
    partType: 7,
    brand: 6,
  },
];

test('should render the component with default props', () => {
  const options = [
    { value: '65', name: 'brand 3 A-Head Tapered Cartridge aluminium' },
    { value: '329', name: 'Shimano SLX M7000 rapidfire' },
    { value: '330', name: 'Shimano Deore XT M8000 Shadow Plus 11 speed' },
  ];
  const props = {
    fieldName: 'field',
    onChange: jest.fn(),
    brands,
    parts,
  };
  const component = shallow(<PartSelect {...props} />);
  expect(toJson(component)).toMatchSnapshot();
  const selectInput = component.find('SelectInput');
  assertComponentHasExpectedProps(selectInput, {
    fieldName: props.fieldName,
    onChange: props.onChange,
    value: NEW_ELEMENT_ID,
    options,
    isEmptyAllowed: true,
    isMultiple: false,
    multipleSize: 0,
  });
});
