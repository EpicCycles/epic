import React from 'react';
import toJson from 'enzyme-to-json';
import CustomerRow from '../CustomerRow';

describe('CustomerRow tests', () => {
  const customer = {
    id: 1,
    first_name: 'Anna',
    last_name: 'Weaver',
    email: 'anna.weaver@johnlewis.co.uk',
    add_date: '2018-07-04T13:02:09.988286+01:00',
    upd_date: '2018-07-04T13:02:09.988343+01:00',
  };

  it('renders the row correctly', () => {
    const input = shallow(<CustomerRow customer={customer} />);
    expect(toJson(input)).toMatchSnapshot();
  });

  it('calls the edit customer function when the button is clicked', () => {
    const editCustomer = jest.fn();

    const input = shallow(<CustomerRow customer={customer} getCustomer={editCustomer} />);
    expect(input.find('#edit-cust-1')).toHaveLength(1);
    input
      .find('#edit-cust-1')
      .at(0)
      .simulate('click');
    expect(editCustomer.mock.calls).toHaveLength(1);
  });
});
