import React from 'react';
import toJson from 'enzyme-to-json';
import Header from '../Header';
// user, application, removeMessage
test('is displays correctly', () => {
  const user = {
    first_name: 'anna',
    last_name: 'Weaver',
    username: 'AVIW',
  };
  const application = {
    message: 'Message to be displayed',
  };
  const component = shallow(<Header user={user} application={application} />);
  expect(toJson(component)).toMatchSnapshot();
});
