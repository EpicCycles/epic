import React from 'react';
import CustomerDetailEdit from "../CustomerDetailEdit";
import {Icon} from "semantic-ui-react";

describe("CustomerDetailEdit tests", () => {
    const customer = {
        id: 16,
        first_name: 'Anna',
        last_name: 'Weaver',
        email: 'anna.weaver@johnlewis.co.uk',
        add_date: '2018-07-04T13:02:09.988286+01:00',
        upd_date: '2018-07-04T13:02:09.988343+01:00'
    };
    it('renders the form text correctly with customer', () => {
        const input = shallow(
            <CustomerDetailEdit customer={customer} />
        );
        expect(input).toMatchSnapshot();
    });
    it('renders the form text correctly with no customer', () => {
        const input = shallow(
            <CustomerDetailEdit />
        );
        expect(input).toMatchSnapshot();
    });
    it('shows the buttons when changes are present', () => {
        const acceptChanges = jest.fn();

        const input = shallow(
            <CustomerDetailEdit customer={customer} acceptCustomerChanges={acceptChanges}/>
        );
        input.setState({changed: true});
        expect(input.find("#accept-cust").prop("disabled")).toEqual(false);
        expect(input.find(Icon).length).toBe(3);

        input.find("#accept-cust").at(0).simulate("click");
        expect(acceptChanges.mock.calls.length).toBe(1);
        input.setState({error: "missing a field"});

        expect(input.find("#accept-cust").prop("disabled")).toEqual(true);
    })
});
