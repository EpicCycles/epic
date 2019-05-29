import React from 'react';
import toJson from 'enzyme-to-json';
import EditModelRow from '../../../components/app/model/EditModelRow';
import { customerAddressFields } from '../../../components/app/model/helpers/fields';

const foundName = 'find me';
const sections = [
  {
    id: 1,
    partTypes: [{ id: 11, name: 'id 11' }, { id: 21, name: 'id 11' }],
  },
  {
    id: 2,
    partTypes: [{ id: 2, name: foundName }, { id: 22, name: 'id 11' }],
  },
];
const brands = [
  { id: 1, brand_name: 'id is 1' },
  { id: 2, brand_name: foundName },
  { id: 3, brand_name: 'id is 3' },
];
const suppliers = [
  { id: 1, supplier_name: 'id is 1' },
  { id: 2, supplier_name: foundName },
  { id: 3, supplier_name: 'id is 3' },
];
const emptyModel = {};
const model = {
  id: 123,
  address1: 'line one',
  address2: 'line Ywo',
  address3: 'line Three',
  address4: 'line Four',
  postcode: 'xxxyyy',
  customer: 6,
};
describe('EditModelRow', () => {
  test('it renders', () => {
    const component = shallow(
      <EditModelRow model={emptyModel} modelFields={customerAddressFields} onChange={jest.fn()} />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });
  test('it renders with data', () => {
    const component = shallow(
      <EditModelRow
        model={model}
        modelFields={customerAddressFields}
        onChange={jest.fn()}
        className="red"
        suppliers={suppliers}
        sections={sections}
        brands={brands}
        persistedModel={model}
        lockFirstColumn
        childModels={[{ id: 23 }, { id: 34 }]}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });
});
