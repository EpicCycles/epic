import React from 'react';
import {updateCustomerBasic} from "../customer";


describe("customer updateCustomerBasic tests", () => {
    const oldCustpmer = {
        first_name: 'Anna',
        last_name: 'Weaver',
        email: 'anna.weaver@johnlewis.co.uk',
        add_date: '2018-07-04T13:02:09.988286+01:00',
        upd_date: '2018-07-04T13:02:09.988343+01:00'
    };
    it('updates an existing customer', () => {
        let customerUpdates = {
            first_name: 'Sam',
            last_name: 'Williams',
            email: 'sam.weaver@johnlewis.co.uk'
        };

        let newCustomer = updateCustomerBasic(oldCustpmer, customerUpdates);
        expect(newCustomer.first_name).toBe(customerUpdates.first_name);
        expect(newCustomer.last_name).toBe(customerUpdates.last_name);
        expect(newCustomer.email).toBe(customerUpdates.email);
    });
    it('updates an existing customer removing email', () => {
        let customerUpdates = {
            first_name: 'Sam',
            last_name: 'Williams',
            email: ''
        };

        let newCustomer = updateCustomerBasic(oldCustpmer, customerUpdates);
        expect(newCustomer.first_name).toBe(customerUpdates.first_name);
        expect(newCustomer.last_name).toBe(customerUpdates.last_name);
        expect(newCustomer.email).toBe(customerUpdates.email);
    });
    it('creates a new customer', () => {
        let customerUpdates = {
            first_name: 'Sam',
            last_name: 'Williams',
            email: 'sam.weaver@johnlewis.co.uk'
        };
        let newCustomer = updateCustomerBasic({}, customerUpdates);
        expect(newCustomer.first_name).toBe(customerUpdates.first_name);
    });
    it('creates a new customer with no email', () => {
        let customerUpdates = {
            first_name: 'Sam',
            last_name: 'Williams',
            email: ''
        };
        let newCustomer = updateCustomerBasic({}, customerUpdates);
        expect(newCustomer.first_name).toBe(customerUpdates.first_name);
    });
});