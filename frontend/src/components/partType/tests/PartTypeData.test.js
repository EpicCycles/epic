import React from 'react';
import toJson from 'enzyme-to-json';
import PartTypeData from '../PartTypeData';
import { NEW_ELEMENT_ID } from '../../../helpers/constants';

test('displays the PartTypeData component for an existing part type with attributes', () => {
  const componentKey = '21';
  const partType = {
    _detail: false,
    id: 21,
    name: 'part one',
    can_be_substituted: false,
    can_be_omitted: true,
    customer_visible: true,
  };
  const component = shallow(<PartTypeData componentKey={componentKey} partType={partType} />);
  expect(toJson(component)).toMatchSnapshot();
});
test('displays the PartTypeData component for an new part type with attributes', () => {
  const componentKey = 'dummy2';
  const partType = {
    _detail: true,
    dummyKey: componentKey,
    name: 'part one',
    can_be_substituted: false,
    can_be_omitted: true,
    customer_visible: true,
    attributes: ['attribute1', 'attribute2'],
    synonyms: ['synonym1', 'synonym1'],
  };
  const component = shallow(<PartTypeData componentKey={componentKey} partType={partType} />);
  expect(toJson(component)).toMatchSnapshot();
});
test('displays the PartTypeData component for a new part type with no attributes', () => {
  const partType = {
    _detail: true,
    dummyKey: NEW_ELEMENT_ID,
    name: 'part one',
    can_be_substituted: false,
    can_be_omitted: true,
    customer_visible: true,
  };
  const component = shallow(<PartTypeData componentKey={NEW_ELEMENT_ID} partType={partType} />);
  expect(toJson(component)).toMatchSnapshot();
});
