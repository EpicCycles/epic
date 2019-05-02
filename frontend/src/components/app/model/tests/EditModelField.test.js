import React from 'react';
import toJson from 'enzyme-to-json';
import { CURRENCY } from '../helpers/fields';
import EditModelField from '../EditModelField';
import { NEW_ELEMENT_ID } from '../../../../helpers/constants';

const field = {
  fieldName: 'data_field',
  type: CURRENCY,
  length: 10,
};
const model = { data_field: 23.9 };

test('it renders a field', () => {
  const component = shallow(
    <EditModelField
      index={0}
      field={field}
      model={model}
      componentKey={NEW_ELEMENT_ID}
      onChange={jest.fn()}
    />,
  );
  expect(toJson(component)).toMatchSnapshot();
});
