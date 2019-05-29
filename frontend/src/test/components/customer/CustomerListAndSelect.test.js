import React from 'react';
import CustomerListAndSelect from '../../../components/customer/CustomerListAndSelect';
import { findDataTest } from '../../../test/jest_helpers/assert';

describe('CustomerListAndSelect.index tests', () => {
  // our mock login function to replace the one provided by mapDispatchToProps
  const mockGetCustomerListAndSelectPagefn = jest.fn();
  const mockGetCustomerListAndSelectfn = jest.fn();
  it('renders the CustomerListAndSelect correctly when there are no customers', () => {
    const component = shallow(
      <CustomerListAndSelect
        getCustomerListAndSelectPage={mockGetCustomerListAndSelectPagefn}
        getCustomerListAndSelect={mockGetCustomerListAndSelectfn}
        clearCustomerState={jest.fn()}
        getCustomerList={jest.fn()}
        addNewCustomer={jest.fn()}
        getCustomer={jest.fn()}
        count={0}
        customers={[]}
        isLoading={false}
        page={0}
        totalPages={0}
      />,
    );
    expect(findDataTest(component, 'search-block')).toHaveLength(1);
    expect(findDataTest(component, 'customer-block')).toHaveLength(0);
    expect(findDataTest(component, 'search-message')).toHaveLength(0);
    expect(findDataTest(component, 'start-message')).toHaveLength(1);
  });
  it('renders the CustomerListAndSelect correctly when there are customers', () => {
    const customers = [
      {
        id: 16,
        first_name: 'Anna',
        last_name: 'Weaver',
        email: 'anna.weaver@johnlewis.co.uk',
        add_date: '2018-07-04T13:02:09.988286+01:00',
        upd_date: '2018-07-04T13:02:09.988343+01:00',
      },
      {
        id: 26,
        first_name: 'dfds',
        last_name: 'Weasdfdsfver',
        add_date: '2018-07-04T13:02:09.988286+01:00',
        upd_date: '2018-07-04T13:02:09.988343+01:00',
      },
    ];
    const component = shallow(
      <CustomerListAndSelect
        getCustomerListAndSelectPage={mockGetCustomerListAndSelectPagefn}
        getCustomerListAndSelect={mockGetCustomerListAndSelectfn}
        addNewCustomer={jest.fn()}
        clearCustomerState={jest.fn()}
        getCustomer={jest.fn()}
        count={6}
        customers={customers}
        isLoading={false}
        page={0}
        totalPages={1}
      />,
    );
    expect(findDataTest(component, 'search-block')).toHaveLength(1);
    expect(findDataTest(component, 'customer-block')).toHaveLength(1);
    expect(findDataTest(component, 'search-message')).toHaveLength(0);
    expect(findDataTest(component, 'start-message')).toHaveLength(0);
  });
  it('renders correctly when there is more than one page of customers', () => {
    const customersMany = [
      {
        id: 16,
        first_name: 'Anna',
        last_name: 'Weaver',
        email: 'anna.weaver@johnlewis.co.uk',
        add_date: '2018-07-04T13:02:09.988286+01:00',
        upd_date: '2018-07-04T13:02:09.988343+01:00',
      },
      {
        id: 26,
        first_name: 'dfds',
        last_name: 'Weasdfdsfver',
        add_date: '2018-07-04T13:02:09.988286+01:00',
        upd_date: '2018-07-04T13:02:09.988343+01:00',
      },
      {
        id: 116,
        first_name: 'Anna',
        last_name: 'Weaver',
        email: 'anna.weaver@johnlewis.co.uk',
        add_date: '2018-07-04T13:02:09.988286+01:00',
        upd_date: '2018-07-04T13:02:09.988343+01:00',
      },
      {
        id: 126,
        first_name: 'dfds',
        last_name: 'Weasdfdsfver',
        add_date: '2018-07-04T13:02:09.988286+01:00',
        upd_date: '2018-07-04T13:02:09.988343+01:00',
      },
      {
        id: 216,
        first_name: 'Anna',
        last_name: 'Weaver',
        email: 'anna.weaver@johnlewis.co.uk',
        add_date: '2018-07-04T13:02:09.988286+01:00',
        upd_date: '2018-07-04T13:02:09.988343+01:00',
      },
      {
        id: 226,
        first_name: 'dfds',
        last_name: 'Weasdfdsfver',
        add_date: '2018-07-04T13:02:09.988286+01:00',
        upd_date: '2018-07-04T13:02:09.988343+01:00',
      },
    ];
    const component = shallow(
      <CustomerListAndSelect
        getCustomerListAndSelectPage={mockGetCustomerListAndSelectPagefn}
        getCustomerListAndSelect={mockGetCustomerListAndSelectfn}
        addNewCustomer={jest.fn()}
        clearCustomerState={jest.fn()}
        selectCustomer={jest.fn()}
        count={6}
        customers={customersMany}
        isLoading={false}
        page={0}
        totalPages={6}
      />,
    );
    expect(findDataTest(component, 'search-block')).toHaveLength(1);
    expect(findDataTest(component, 'customer-block')).toHaveLength(1);
    expect(findDataTest(component, 'search-message')).toHaveLength(0);
    expect(findDataTest(component, 'start-message')).toHaveLength(0);
  });
});
