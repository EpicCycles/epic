import React from 'react';
import CustomerRow from "../../../containers/customer/CustomerRow";

describe("CustomerRow tests", () => {
    const customer = {
        id:1,
        first_name: 'Anna',
        last_name: 'Weaver',
        email: 'anna.weaver@johnlewis.co.uk',
        add_date: '2018-07-04T13:02:09.988286+01:00',
        upd_date: '2018-07-04T13:02:09.988343+01:00'
    };

    it('renders the row correctly', () => {
        const input = shallow(
            <CustomerRow customer={customer} />
        );
        expect(input).toMatchSnapshot();
    });

    it('shows the buttons when changes are present', () => {
        const editCustomer = jest.fn();

        const input = shallow(
            <CustomerRow customer={customer} getCustomer={editCustomer}/>
        );
        expect(input.find("#edit-cust-1").length).toBe(1);
        input.find("#edit-cust-1").at(0).simulate("click");
        expect(editCustomer.mock.calls.length).toBe(1);
    });

});