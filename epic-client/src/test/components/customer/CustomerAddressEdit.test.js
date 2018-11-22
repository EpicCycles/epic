import React from 'react';
import CustomerAddressEdit from "../../../components/customer/CustomerAddressEdit";
// props customerAddress: {address1/2/3/4, postcode}, deleteCustomerAddress,saveCustomerAddress
it("renders correctly with a passed customer address", () => {
    const customerAddress = {
        id: 123,
        address1: "line one",
        address2: "line Ywo",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6
    };
    const component = shallow(
        <CustomerAddressEdit
            customerAddress={customerAddress}
        />
    );
    expect(component).toMatchSnapshot();
    expect(component.state('address1')).toBe("line one");
    expect(component.state('address2')).toBe("line Ywo");
    expect(component.state('address3')).toBe("line Three");
    expect(component.state('address4')).toBe("line Four");
    expect(component.state('postcode')).toBe("xxxyyy");
    expect(component.state('address1Error')).toBe("");
    expect(component.state('postcodeError')).toBe("");
    expect(component.state('isChanged')).toBeFalsy();
    expect(component.state('isValid')).toBeTruthy();
});
it("renders correctly with a new customer address", () => {
    const customerAddress = {};
    const component = shallow(
        <CustomerAddressEdit
            customerAddress={customerAddress}
        />
    );
    expect(component).toMatchSnapshot();
    expect(component.state('address1')).toBe("");
    expect(component.state('address2')).toBe("");
    expect(component.state('address3')).toBe("");
    expect(component.state('address4')).toBe("");
    expect(component.state('postcode')).toBe("");
    expect(component.state('address1Error')).toBe("");
    expect(component.state('postcodeError')).toBe("");
    expect(component.state('isChanged')).toBeFalsy();
    expect(component.state('isValid')).toBeTruthy();
});
it("processes input changes and sets errors as appropriate for an existing customer", () => {
    const customerAddress = {
        id: 123,
        address1: "line one",
        address2: "line Ywo",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6
    };
    const component = shallow(
        <CustomerAddressEdit
            customerAddress={customerAddress}
        />
    );
    component.instance().handleInputChange("address1_123", 'new line 1');
    expect(component.state('isChanged')).toBeTruthy();
    expect(component.state('address1')).toBe("new line 1");
    expect(component.state('isValid')).toBeTruthy();

    component.instance().handleInputChange("address1_123", '');
    expect(component.state('isChanged')).toBeTruthy();
    expect(component.state('address1')).toBe("");
    expect(component.state('isValid')).toBeFalsy();
    expect(component.state('address1Error')).toBe("At least 1 line of address must be provided");

    component.instance().handleInputChange("address1_123", 'new line 21');
    component.instance().handleInputChange("address2_123", 'new line 22');
    component.instance().handleInputChange("address3_123", 'new line 23');
    component.instance().handleInputChange("address4_123", 'new line 24');
    component.instance().handleInputChange("postcode_123", 'new postcode');
    expect(component.state('address1')).toBe("new line 21");
    expect(component.state('address2')).toBe("new line 22");
    expect(component.state('address3')).toBe("new line 23");
    expect(component.state('address4')).toBe("new line 24");
    expect(component.state('postcode')).toBe("new postcode");
    expect(component.state('isChanged')).toBeTruthy();
    expect(component.state('isValid')).toBeTruthy();

    component.instance().handleInputChange("postcode_123", '');
    expect(component.state('isChanged')).toBeTruthy();
    expect(component.state('postcode')).toBe("");
    expect(component.state('isValid')).toBeFalsy();
    expect(component.state('postcodeError')).toBe("Postcode must be provided");

    component.instance().handleInputChange("address1_123", customerAddress.address1);
    component.instance().handleInputChange("address2_123", customerAddress.address2);
    component.instance().handleInputChange("address3_123", customerAddress.address3);
    component.instance().handleInputChange("address4_123", customerAddress.address4);
    component.instance().handleInputChange("postcode_123", customerAddress.postcode);
    expect(component.state('address1Error')).toBe("");
    expect(component.state('postcodeError')).toBe("");
    expect(component.state('isChanged')).toBeFalsy();
    expect(component.state('isValid')).toBeTruthy();
});
it("processes input changes and sets errors as appropriate for a new customer", () => {
    const customerAddress = {};
    const component = shallow(
        <CustomerAddressEdit
            customerAddress={customerAddress}
        />
    );
    component.instance().handleInputChange("address1_123", 'new line 21');
    component.instance().handleInputChange("address2_123", 'new line 22');
    component.instance().handleInputChange("address3_123", 'new line 23');
    component.instance().handleInputChange("address4_123", 'new line 24');
    component.instance().handleInputChange("postcode_123", 'new postcode');
    expect(component.state('address1')).toBe("new line 21");
    expect(component.state('address2')).toBe("new line 22");
    expect(component.state('address3')).toBe("new line 23");
    expect(component.state('address4')).toBe("new line 24");
    expect(component.state('postcode')).toBe("new postcode");
    expect(component.state('isChanged')).toBeTruthy();
    expect(component.state('isValid')).toBeTruthy();

    component.instance().handleInputChange("address1_123", '');
    expect(component.state('isChanged')).toBeTruthy();
    expect(component.state('address1')).toBe("");
    expect(component.state('isValid')).toBeFalsy();
    expect(component.state('address1Error')).toBe("At least 1 line of address must be provided");

    component.instance().handleInputChange("postcode_123", '');
    expect(component.state('isChanged')).toBeTruthy();
    expect(component.state('postcode')).toBe("");
    expect(component.state('isValid')).toBeFalsy();
    expect(component.state('postcodeError')).toBe("Postcode must be provided");

    component.instance().handleInputChange("address1_123", "");
    component.instance().handleInputChange("address2_123", "");
    component.instance().handleInputChange("address3_123", "");
    component.instance().handleInputChange("address4_123", "");
    component.instance().handleInputChange("postcode_123", "");
    expect(component.state('isChanged')).toBeFalsy();
    expect(component.state('isValid')).toBeTruthy();
    expect(component.state('address1Error')).toBe("");
    expect(component.state('postcodeError')).toBe("");
});
it("resets back to existing customer when requested", () => {
    const customerAddress = {
        id: 123,
        address1: "line one",
        address2: "line Ywo",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6
    };
    const component = shallow(
        <CustomerAddressEdit
            customerAddress={customerAddress}
        />
    );
    component.instance().handleInputChange("address1_123", 'new line 21');
    component.instance().handleInputChange("address2_123", 'new line 22');
    component.instance().handleInputChange("address3_123", 'new line 23');
    component.instance().handleInputChange("address4_123", 'new line 24');
    component.instance().handleInputChange("postcode_123", 'new postcode');

    component.instance().onClickReset();

    expect(component.state('isChanged')).toBeFalsy();
    expect(component.state('address1')).toBe("line one");
    expect(component.state('address2')).toBe("line Ywo");
    expect(component.state('address3')).toBe("line Three");
    expect(component.state('address4')).toBe("line Four");
    expect(component.state('postcode')).toBe("xxxyyy");
    expect(component.state('address1Error')).toBe("");
    expect(component.state('postcodeError')).toBe("");
    expect(component.state('isChanged')).toBeFalsy();
    expect(component.state('isValid')).toBeTruthy();
});
it("resets back for new customer when requested", () => {
    const customerAddress = {};
    const component = shallow(
        <CustomerAddressEdit
            customerAddress={customerAddress}
        />
    );
    component.instance().handleInputChange("address1_123", 'new line 21');
    component.instance().handleInputChange("address2_123", 'new line 22');
    component.instance().handleInputChange("address3_123", 'new line 23');
    component.instance().handleInputChange("address4_123", 'new line 24');
    component.instance().handleInputChange("postcode_123", 'new postcode');
    expect(component.state('address1')).toBe("new line 21");
    expect(component.state('address2')).toBe("new line 22");
    expect(component.state('address3')).toBe("new line 23");
    expect(component.state('address4')).toBe("new line 24");
    expect(component.state('postcode')).toBe("new postcode");
    expect(component.state('isChanged')).toBeTruthy();

    component.instance().onClickReset();

    expect(component.state('address1')).toBe("");
    expect(component.state('address2')).toBe("");
    expect(component.state('address3')).toBe("");
    expect(component.state('address4')).toBe("");
    expect(component.state('postcode')).toBe("");
    expect(component.state('isChanged')).toBeFalsy();
    expect(component.state('isValid')).toBeTruthy();
    expect(component.state('address1Error')).toBe("");
    expect(component.state('postcodeError')).toBe("");
});
it("triggers save for an existing customer when requested", () => {
    const customerAddress = {
        id: 123,
        address1: "line one",
        address2: "line Ywo",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6
    };
    const saveCustomerAddress = jest.fn();
    const customerId = 98;
    const component = shallow(
        <CustomerAddressEdit
            customerAddress={customerAddress}
            saveCustomerAddress={saveCustomerAddress}
            customerId={customerId}
        />
    );
    component.instance().handleInputChange("address1_123", 'new line 21');
    component.instance().handleInputChange("address2_123", 'new line 22');
    component.instance().handleInputChange("address3_123", 'new line 23');
    component.instance().handleInputChange("address4_123", 'new line 24');
    component.instance().handleInputChange("postcode_123", 'new postcode');

    component.instance().saveOrCreateCustomerAddress();

    expect(component.state('isChanged')).toBeTruthy();
    expect(saveCustomerAddress.mock.calls.length).toBe(1);
    expect(saveCustomerAddress.mock.calls[0][0].id).toBe(customerAddress.id);
    expect(saveCustomerAddress.mock.calls[0][0].address1).toBe("new line 21");
    expect(saveCustomerAddress.mock.calls[0][0].address2).toBe("new line 22");
    expect(saveCustomerAddress.mock.calls[0][0].address3).toBe("new line 23");
    expect(saveCustomerAddress.mock.calls[0][0].address4).toBe("new line 24");
    expect(saveCustomerAddress.mock.calls[0][0].postcode).toBe("new postcode");
    expect(saveCustomerAddress.mock.calls[0][0].customer).toBe(customerAddress.customer);
    expect(component.state('saveInProgress')).toBeTruthy();
});
it("triggers save for a new customer when requested", () => {
    const customerAddress = {};
    const saveCustomerAddress = jest.fn();
    const customerId = 98;

    const component = shallow(
        <CustomerAddressEdit
            customerAddress={customerAddress}
            saveCustomerAddress={saveCustomerAddress}
            customerId={customerId}
        />
    );
    component.instance().handleInputChange("address1_123", 'new line 21');
    component.instance().handleInputChange("address2_123", 'new line 22');
    component.instance().handleInputChange("address3_123", 'new line 23');
    component.instance().handleInputChange("address4_123", 'new line 24');
    component.instance().handleInputChange("postcode_123", 'new postcode');

    component.instance().saveOrCreateCustomerAddress();

    expect(component.state('isChanged')).toBeTruthy();
    expect(saveCustomerAddress.mock.calls.length).toBe(1);
    expect(saveCustomerAddress.mock.calls[0][0].id).toBe(undefined);
    expect(saveCustomerAddress.mock.calls[0][0].address1).toBe("new line 21");
    expect(saveCustomerAddress.mock.calls[0][0].address2).toBe("new line 22");
    expect(saveCustomerAddress.mock.calls[0][0].address3).toBe("new line 23");
    expect(saveCustomerAddress.mock.calls[0][0].address4).toBe("new line 24");
    expect(saveCustomerAddress.mock.calls[0][0].postcode).toBe("new postcode");
    expect(saveCustomerAddress.mock.calls[0][0].customer).toBe(customerId);
    expect(component.state('saveInProgress')).toBeTruthy();
});
it("triggers delete for an existing customer when requested", () => {
    const customerAddress = {
        id: 123,
        address1: "line one",
        address2: "line Ywo",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6
    };
    const deleteCustomerAddress = jest.fn();
    const component = shallow(
        <CustomerAddressEdit
            customerAddress={customerAddress}
            deleteCustomerAddress={deleteCustomerAddress}
        />
    );
    component.instance().onClickDelete();
    expect(deleteCustomerAddress.mock.calls.length).toBe(1);
    expect(deleteCustomerAddress.mock.calls[0][0]).toBe(customerAddress.id);
});
it("clears data for a new customer when delete requested", () => {
    const customerAddress = {};
    const deleteCustomerAddress = jest.fn();
    const customerId = 98;

    const component = shallow(
        <CustomerAddressEdit
            customerAddress={customerAddress}
            deleteCustomerAddress={deleteCustomerAddress}
            customerId={customerId}
        />
    );
    component.instance().handleInputChange("address1_123", 'new line 21');
    component.instance().handleInputChange("address2_123", 'new line 22');
    component.instance().handleInputChange("address3_123", 'new line 23');
    component.instance().handleInputChange("address4_123", 'new line 24');
    component.instance().handleInputChange("postcode_123", 'new postcode');

    component.instance().onClickDelete();
    expect(deleteCustomerAddress.mock.calls.length).toBe(0);
    expect(component.state('address1')).toBe("");
    expect(component.state('address2')).toBe("");
    expect(component.state('address3')).toBe("");
    expect(component.state('address4')).toBe("");
    expect(component.state('postcode')).toBe("");
    expect(component.state('isChanged')).toBeFalsy();
    expect(component.state('isValid')).toBeTruthy();
    expect(component.state('address1Error')).toBe("");
    expect(component.state('postcodeError')).toBe("");
});
