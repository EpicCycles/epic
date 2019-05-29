import React from 'react';
import toJson from 'enzyme-to-json';
import { NEW_ELEMENT_ID } from '../../../helpers/constants';
import SectionEdit from '../../../components/section/SectionEdit';

test('SectionEdit shows a NEW section correctly', () => {
  const section = { name: 'section is new' };
  const component = shallow(<SectionEdit componentKey={NEW_ELEMENT_ID} section={section} />);
  expect(toJson(component)).toMatchSnapshot();
});
test('SectionEdit shows an existing section correctly', () => {
  const componentKey = 22;
  const section = {
    name: 'section is old',
    id: componentKey,
    partTypes: ['pt1'],
  };
  const component = shallow(<SectionEdit componentKey={componentKey} section={section} />);
  expect(toJson(component)).toMatchSnapshot();
});
test('SectionEdit shows an existing section with partTypes expanded correctly', () => {
  const componentKey = 22;
  const section = {
    name: 'section is old',
    id: componentKey,
    partTypes: ['pt1', 'pt2'],
    _detail: true,
  };
  const component = shallow(<SectionEdit componentKey={componentKey} section={section} />);
  expect(toJson(component)).toMatchSnapshot();
});
