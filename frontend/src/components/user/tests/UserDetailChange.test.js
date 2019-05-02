import React from 'react';
import toJson from 'enzyme-to-json';
import UserDetailChange from '../UserDetailChange';

describe('UserDetailChange', () => {
  test('displays correctly', () => {
    const component = shallow(<UserDetailChange changeUserData={jest.fn()} />);
    expect(toJson(component)).toMatchSnapshot();
  });
  test('displays correctly with a user', () => {
    const user = {
      user: {
        username: 'fred',
        first_name: 'Frederick',
        last_name: 'Jones,',
        email: 'fred@fred.jones.org',
      },
    };
    const component = shallow(<UserDetailChange changeUserData={jest.fn()} user={user} />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
