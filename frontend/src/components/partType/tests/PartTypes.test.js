import React from 'react';
import toJson from 'enzyme-to-json';
import PartTypes from '../PartTypes';
import { NEW_ELEMENT_ID } from '../../../helpers/constants';

test('PartTypes displays when none present', () => {
  const partTypes = [];
  const sectionKey = NEW_ELEMENT_ID;

  const component = shallow(<PartTypes sectionKey={sectionKey} partTypes={partTypes} />);
  expect(toJson(component)).toMatchSnapshot();
});
test('PartTypes displays when some present', () => {
  const partTypes = [
    { id: 23 },
    { dummyKey: 'dummy1' },
    { dummyKey: 'dummy2', changed: true },
    { id: 45, delete: true },
    { id: 62, error: true, error_detail: 'errors' },
    { dummyKey: NEW_ELEMENT_ID },
  ];
  const sectionKey = 66;

  const component = shallow(<PartTypes sectionKey={sectionKey} partTypes={partTypes} />);
  expect(toJson(component)).toMatchSnapshot();
});
test('PartTypes displays when only deleted present', () => {
  const partTypes = [{ dummyKey: 'dummy2', changed: true, delete: true }, { id: 45, delete: true }];
  const sectionKey = 66;

  const component = shallow(<PartTypes sectionKey={sectionKey} partTypes={partTypes} />);
  expect(toJson(component)).toMatchSnapshot();
});
