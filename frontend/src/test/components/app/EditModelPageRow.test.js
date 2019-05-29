import React from 'react';
import toJson from 'enzyme-to-json';
import EditModelPageRow from '../../../components/app/model/EditModelPageRow';
import { ADDRESS1_FIELD } from '../../../components/app/model/helpers/fields';
import { NEW_ELEMENT_ID } from '../../../helpers/constants';

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
describe('EditModelPageRow', () => {
  test('it renders', () => {
    const component = shallow(
      <EditModelPageRow
        model={emptyModel}
        field={ADDRESS1_FIELD}
        index={12}
        onChange={jest.fn()}
        componentKey={NEW_ELEMENT_ID}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });
  test('it renders with data', () => {
    const component = shallow(
      <EditModelPageRow
        model={model}
        field={ADDRESS1_FIELD}
        componentKey={1}
        index={2}
        onChange={jest.fn()}
        className="red"
        suppliers={suppliers}
        sections={sections}
        brands={brands}
        persistedModel={model}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });
});
