import React from 'react';
import EditModelPage from '../../../components/app/model/EditModelPage';
import { customerAddressFields } from '../../../components/app/model/helpers/fields';
import { findDataTest } from '../../jest_helpers/assert';

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
describe('EditModelPage', () => {
  it('should show just edit fields when read only not required and there are no errors', () => {
    const component = shallow(
      <EditModelPage model={emptyModel} modelFields={customerAddressFields} onChange={jest.fn()} />,
    );
    expect(findDataTest(component, 'field-to-edit')).toHaveLength(7);
    expect(findDataTest(component, 'field-to-view')).toHaveLength(0);
    expect(findDataTest(component, 'show-error-detail')).toHaveLength(0);
  });
  it('should show edit and view fields when view fields are required', () => {
    const component = shallow(
      <EditModelPage
        model={model}
        modelFields={customerAddressFields}
        onChange={jest.fn()}
        className="red"
        suppliers={suppliers}
        sections={sections}
        brands={brands}
        persistedModel={model}
        showReadOnlyFields
      />,
    );
    expect(findDataTest(component, 'field-to-edit')).toHaveLength(7);
    expect(findDataTest(component, 'field-to-view')).toHaveLength(2);
    expect(findDataTest(component, 'show-error-detail')).toHaveLength(0);
  });
  it('should show edit, view and errors when all are present', () => {
    const modelWithError = {
      id: 123,
      address1: 'line one',
      address2: 'line Ywo',
      address3: 'line Three',
      address4: 'line Four',
      postcode: 'xxxyyy',
      customer: 6,
      error_detail: {
        non_field_errors: ['This address is already in use for the same customer'],
      },
    };
    const component = shallow(
      <EditModelPage
        model={modelWithError}
        modelFields={customerAddressFields}
        onChange={jest.fn()}
        className="red"
        suppliers={suppliers}
        sections={sections}
        brands={brands}
        persistedModel={model}
        showReadOnlyFields
      />,
    );
    expect(findDataTest(component, 'field-to-edit')).toHaveLength(7);
    expect(findDataTest(component, 'field-to-view')).toHaveLength(2);
    expect(findDataTest(component, 'show-error-detail')).toHaveLength(1);
  });
});
