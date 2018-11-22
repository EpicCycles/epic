import React from 'react';
import CustomerPhoneEdit from "../../../components/customer/CustomerPhoneEdit";

// props - customerPhone {number_type, telephone}, customerId, saveCustomerPhone {function}, deleteCustomerPhone {function}
it("displays a passed customerPhone object correctly", () => {
    const customerPhone = {
        number_type: "H",
        telephone: "78736",
        id: 12
    };
    const component = shallow(
        <CustomerPhoneEdit customerPhone={customerPhone} />
    );
    expect(component).toMatchSnapshot();
});
it("displays a passed customerPhone object correctly when an error is present", () => {
    const customerPhone = {
        number_type: "H",
        telephone: "78736",
        id: 12,
        error:true
    };
    const component = shallow(
        <CustomerPhoneEdit customerPhone={customerPhone} />
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
    expect(component.state('isChanged')).toBeTruthy();

    component.instance().handleInputChange("telephone1", '78736');
    expect(component.state('isChanged')).toBeFalsy();

    component.instance().handleInputChange("numberType1", 'M');
    expect(component.state('isChanged')).toBeTruthy();
});
it("shows an error when the telephone number is removed", () => {
    const customerPhone = {
        number_type: "H",
        telephone: "78736",
        id: 12
    };
    const component = shallow(
        <CustomerPhoneEdit customerPhone={customerPhone}/>
    );
    component.instance().handleInputChange("telephone1", "");
    expect(component.state('isChanged')).toBeTruthy();
    expect(component.state('telephoneError')).toBe("Phone Number must be provided");
    expect(component.state('isValid')).toBeFalsy;
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
    component.instance().handleInputChange("telephone1", "");
    expect(component.state('isChanged')).toBeTruthy();
    expect(component.state('telephoneError')).toBe("Phone Number must be provided");
    expect(component.state('isValid')).toBeFalsy();

    component.instance().onClickReset();

    expect(component.state('isChanged')).toBeFalsy();
    expect(component.state('isValid')).toBeTruthy();
    expect(component.state('telephoneError')).toBe("");
    expect(component.state('telephone')).toBe(customerPhone.telephone);
    expect(component.state('number_type')).toBe(customerPhone.number_type);

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
    expect(component.state('isChanged')).toBeTruthy();

    component.instance().handleInputChange("numberType1", 'M');
    expect(component.state('isChanged')).toBeTruthy();

    component.instance().saveOrCreateCustomerPhone();
    expect(saveCustomerPhone.mock.calls.length).toBe(1);
    expect(saveCustomerPhone.mock.calls[0][0].number_type).toBe("M");
    expect(saveCustomerPhone.mock.calls[0][0].telephone).toBe("12345678");
    expect(saveCustomerPhone.mock.calls[0][0].id).toBe(customerPhone.id);
    expect(component.state('saveInProgress')).toBeTruthy();
});
it("calls method to delete phone details and sets state as appropriate", () => {
    const deleteCustomerPhone = jest.fn();
    const customerPhone = {
        number_type: "H",
        telephone: "78736",
        id: 12
    };
    const component = shallow(
        <CustomerPhoneEdit
            customerPhone={customerPhone}
            deleteCustomerPhone={deleteCustomerPhone}
        />
    );

    component.instance().onClickDelete();
    expect(deleteCustomerPhone.mock.calls.length).toBe(1);
    expect(deleteCustomerPhone.mock.calls[0][0]).toBe(customerPhone.id);
});
it("calls method to save new phone details and sets state as appropriate", () => {
    const saveCustomerPhone = jest.fn();
    const customerPhone = {};
    const customerId = 23;

    const component = shallow(
        <CustomerPhoneEdit
            customerPhone={customerPhone}
            saveCustomerPhone={saveCustomerPhone}
            customerId={customerId}
        />
    );
    component.instance().handleInputChange("telephone1", '12345678');
    component.instance().handleInputChange("numberType1", 'M');
    expect(component.state('isChanged')).toBeTruthy();
    expect(component.state('telephone')).toBe('12345678');
    expect(component.state('number_type')).toBe("M");

    component.instance().saveOrCreateCustomerPhone();
    expect(saveCustomerPhone.mock.calls.length).toBe(1);
    expect(saveCustomerPhone.mock.calls[0][0].number_type).toBe("M");
    expect(saveCustomerPhone.mock.calls[0][0].telephone).toBe("12345678");
    expect(saveCustomerPhone.mock.calls[0][0].customer).toBe(customerId);
    expect(component.state('saveInProgress')).toBeTruthy();
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
    expect(component.state('isChanged')).toBeTruthy();

    component.instance().handleInputChange("numberType1", 'M');
    expect(component.state('isChanged')).toBeTruthy();
    expect(component.state('telephone')).toBe('12345678');
    expect(component.state('number_type')).toBe("M");

    component.instance().onClickDelete();
    expect(deleteCustomerPhone.mock.calls.length).toBe(0);
    expect(component.state('isChanged')).toBeFalsy();
    expect(component.state('isValid')).toBeTruthy();
    expect(component.state('telephoneError')).toBe("");
    expect(component.state('telephone')).toBe("");
    expect(component.state('number_type')).toBe("H");
});
