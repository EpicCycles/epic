import React from "react";
import CustomerAddLink from "../CustomerAddLink";
import {findDataTest} from "../../../../test/assert";

describe('CustomerAddLink', () => {
    test('should render when passed props', () => {
        const component = shallow(<CustomerAddLink addNewCustomer={jest.fn()}/>)
        expect(findDataTest(component, "add-customer-icon")).toHaveLength(1);
    });
    test('should call passed method when add link is clicked', () => {
        const addNewCustomer = jest.fn();
        const component = shallow(<CustomerAddLink addNewCustomer={addNewCustomer}/>)
        findDataTest(component, "add-customer-icon").simulate('click');
        expect(addNewCustomer).toHaveBeenCalledTimes(1);
    });
});