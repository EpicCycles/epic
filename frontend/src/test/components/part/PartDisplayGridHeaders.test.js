import React from 'react';
import toJson from 'enzyme-to-json';
import PartDisplayGridHeaders from '../../../components/part/PartDisplayGridHeaders';

test('should display just part headers when supplier products no requested', () => {
  const component = shallow(<PartDisplayGridHeaders />);
  expect(toJson(component)).toMatchSnapshot();
});
test('should display all headers with locking and an extra class', () => {
  const component = shallow(
    <PartDisplayGridHeaders lockFirstColumn showSupplierProducts showErrors className="pink" />,
  );
  expect(toJson(component)).toMatchSnapshot();
});
test('should display all headers with locking and an extra class and actions', () => {
  const component = shallow(
    <PartDisplayGridHeaders
      lockFirstColumn
      showSupplierProducts
      showErrors
      className="pink"
      includeActions
    />,
  );
  expect(toJson(component)).toMatchSnapshot();
});
