import React from 'react';
import toJson from 'enzyme-to-json';
import PartTypeEdit from '../../../components/partType/PartTypeEdit';
import { NEW_ELEMENT_ID } from '../../../helpers/constants';

test('displays the PartTypeEdit component for an existing part type with attributes hidden', () => {
  const componentKey = '21';
  const partType = {
    _detail: false,
    id: 21,
    name: 'part one',
    can_be_substituted: false,
    can_be_omitted: true,
    customer_visible: true,
  };
  const component = shallow(<PartTypeEdit componentKey={componentKey} partType={partType} />);
  expect(toJson(component)).toMatchSnapshot();
});
test('displays the PartTypeEdit component for an existing part type with attributes', () => {
  const componentKey = 'dummy2';
  const partType = {
    _detail: true,
    dummyKey: componentKey,
    name: 'part one',
    can_be_substituted: false,
    can_be_omitted: true,
    customer_visible: true,
    attributes: ['attribute1', 'attribute2'],
  };
  const component = shallow(<PartTypeEdit componentKey={componentKey} partType={partType} />);
  expect(toJson(component)).toMatchSnapshot();
});
test('displays the PartTypeEdit component for a new part type with no attributes', () => {
  const partType = {
    _detail: true,
    dummyKey: NEW_ELEMENT_ID,
    name: 'part one',
    can_be_substituted: false,
    can_be_omitted: true,
    customer_visible: true,
  };
  const component = shallow(<PartTypeEdit componentKey={NEW_ELEMENT_ID} partType={partType} />);
  expect(toJson(component)).toMatchSnapshot();
});
