import React from 'react';
import toJson from 'enzyme-to-json';
import SupplierProductFieldHeaders from '../SupplierProductFieldHeaders';

test('should display headers', () => {
  const component = shallow(<SupplierProductFieldHeaders />);
  expect(toJson(component)).toMatchSnapshot();
});
test('should display headers with locking, error and an extra class', () => {
  const component = shallow(
    <SupplierProductFieldHeaders lockFirstColumn className="pink" showErrors />,
  );
  expect(toJson(component)).toMatchSnapshot();
});
