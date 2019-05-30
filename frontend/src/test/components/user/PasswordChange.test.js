import React from 'react';
import toJson from 'enzyme-to-json';
import PasswordChange from '../../../components/user/PasswordChange';

test('displays correctly', () => {
  const component = shallow(<PasswordChange changePassword={jest.fn()} />);
  expect(toJson(component)).toMatchSnapshot();
});