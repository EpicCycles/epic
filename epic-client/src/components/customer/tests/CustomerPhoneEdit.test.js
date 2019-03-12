import React from 'react';
import CustomerPhoneEdit from "../CustomerPhoneEdit";

describe('CustomerPhoneEdit', () => {


    it("displays a passed customerPhone object correctly", () => {
        const customerPhone = {
            number_type: "H",
            telephone: "78736",
            id: 12
        };
        const component = shallow(
            <CustomerPhoneEdit customerPhone={customerPhone}/>
        );
        expect(component).toMatchSnapshot();
    });
    it("displays a passed customerPhone object correctly when an error is present", () => {
        const customerPhone = {
            number_type: "H",
            telephone: "78736",
            id: 12,
            error: true
        };
        const component = shallow(
            <CustomerPhoneEdit customerPhone={customerPhone}/>
        );
        expect(component).toMatchSnapshot();
    });
    it("sets the changed flag when a value changes", () => {
        const customerPhone = {
            number_type: "H",
            telephone: "78736",
            id: 12
        };
        const component = shallow(
            <CustomerPhoneEdit customerPhone={customerPhone}/>
        );
        component.instance().handleInputChange("telephone1", '12345678');
        expect(component.state('customerPhone').changed).toBeTruthy();

        component.instance().handleInputChange("telephone1", '78736');
        expect(component.state('customerPhone').changed).toBeTruthy();

        component.instance().handleInputChange("number_type1", 'M');
        expect(component.state('customerPhone').changed).toBeTruthy();
    });
    it("resets to passed state when reset if clicked", () => {
        const customerPhone = {
            number_type: "H",
            telephone: "78736",
            id: 12
        };
        const component = shallow(
            <CustomerPhoneEdit customerPhone={customerPhone}/>
        );
        expect(component.state('customerPhone')).toEqual(customerPhone);
        component.instance().handleInputChange("telephone1", "");
        expect(component.state('customerPhone').changed).toBeTruthy();
        component.instance().onClickReset();
        expect(component.state('customerPhone').changed).toBeFalsy();

    });
    it("calls method to save phone details and sets state as appropriate", () => {
        const saveCustomerPhone = jest.fn();
        const customerPhone = {
            number_type: "H",
            telephone: "78736",
            id: 12
        };
        const component = shallow(
            <CustomerPhoneEdit
                customerPhone={customerPhone}
                saveCustomerPhone={saveCustomerPhone}
            />
        );
        component.instance().handleInputChange("telephone1", '12345678');
        expect(component.state('customerPhone').changed).toBeTruthy();

        component.instance().handleInputChange("number_type1", 'M');
        expect(component.state('customerPhone').changed).toBeTruthy();
    });
    it("calls handles clearing a new customer phone", () => {
        const deleteCustomerPhone = jest.fn();
        const customerPhone = {};
        const component = shallow(
            <CustomerPhoneEdit
                customerPhone={customerPhone}
                deleteCustomerPhone={deleteCustomerPhone}
            />
        );
        component.instance().handleInputChange("telephone1", '12345678');
        expect(component.state('customerPhone').changed).toBeTruthy();

        component.instance().handleInputChange("number_type1", 'M');
        expect(component.state('customerPhone').changed).toBeTruthy();

    });
});