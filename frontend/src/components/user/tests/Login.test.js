import React from 'react';
import toJson from 'enzyme-to-json';
import Login from '../Login';

describe('Login', () => {
  it('displays login fields when user in session', () => {
    const component = shallow(<Login user={{ username: 'testUser' }} s />);
    expect(toJson(component)).toMatchSnapshot();
  });
  it('displays login fields when no user in session', () => {
    const component = shallow(<Login />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
