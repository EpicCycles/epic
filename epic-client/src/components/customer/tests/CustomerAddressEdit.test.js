import React from 'react';
import CustomerAddressEdit from "../CustomerAddressEdit";
import {ADDRESS_MISSING} from "../../app/model/helpers/error";

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
            customerId={12}
            deleteCustomerAddress={jest.fn()}
            saveCustomerAddress={jest.fn()}
        />
    );
    expect(component).toMatchSnapshot();
});
it("renders correctly with a new customer address", () => {
    const customerAddress = {};
    const component = shallow(
        <CustomerAddressEdit
            customerAddress={customerAddress}
            customerId={12}
            deleteCustomerAddress={jest.fn()}
            saveCustomerAddress={jest.fn()}
        />
    );
    expect(component).toMatchSnapshot();
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
            customerId={12}
            deleteCustomerAddress={jest.fn()}
            saveCustomerAddress={jest.fn()}
        />
    );
    component.instance().handleInputChange("address1_123", 'new line 1');
    const customerAddressUpdated = {
        id: 123,
        address1: "new line 1",
        address2: "line Ywo",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6,
        error_detail: {},
        changed: true,
    };
    expect(component.state('customerAddress')).toEqual(customerAddressUpdated);

    const customerAddressWithError = {
        id: 123,
        address1: "",
        address2: "line Ywo",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6,
        error_detail: { address1: ADDRESS_MISSING },
        changed: true,
    };
    component.instance().handleInputChange("address1_123", '');
    expect(component.state('customerAddress')).toEqual(customerAddressWithError);
});
it("processes input changes and sets errors as appropriate for a new customer", () => {
    const customerAddress = {};
    const component = shallow(
        <CustomerAddressEdit
            customerAddress={customerAddress}
            customerId={12}
            deleteCustomerAddress={jest.fn()}
            saveCustomerAddress={jest.fn()}
        />
    );
    component.instance().handleInputChange("address1_123", 'new line 21');
    component.instance().handleInputChange("address2_123", 'new line 22');
    component.instance().handleInputChange("address3_123", 'new line 23');
    component.instance().handleInputChange("address4_123", 'new line 24');
    component.instance().handleInputChange("postcode_123", 'new postcode');
    const customerAddressUpdated = {
        address1: "new line 21",
        address2: "new line 22",
        address3: "new line 23",
        address4: "new line 24",
        postcode: "new postcode",
        customer: 12,
        error_detail: {},
        changed: true,
    };
    expect(component.state('customerAddress')).toEqual(customerAddressUpdated);

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
            customerId={12}
            deleteCustomerAddress={jest.fn()}
            saveCustomerAddress={jest.fn()}/>
    );
    component.instance().handleInputChange("address1_123", 'new line 21');
    component.instance().handleInputChange("address2_123", 'new line 22');
    component.instance().handleInputChange("address3_123", 'new line 23');
    component.instance().handleInputChange("address4_123", 'new line 24');
    component.instance().handleInputChange("postcode_123", 'new postcode');
    expect(component.state('customerAddress')).not.toEqual(customerAddress);

    component.instance().onClickReset();

    expect(component.state('customerAddress')).toEqual(customerAddress);
});
it("resets back for new customer when requested", () => {
    const customerAddress = {};
    const component = shallow(
        <CustomerAddressEdit
            customerAddress={customerAddress}
            customerId={12}
            deleteCustomerAddress={jest.fn()}
            saveCustomerAddress={jest.fn()}
        />
    );
    component.instance().handleInputChange("address1_123", 'new line 21');
    component.instance().handleInputChange("address2_123", 'new line 22');
    component.instance().handleInputChange("address3_123", 'new line 23');
    component.instance().handleInputChange("address4_123", 'new line 24');
    component.instance().handleInputChange("postcode_123", 'new postcode');
    expect(component.state('customerAddress')).not.toEqual({});

    component.instance().onClickReset();
    expect(component.state('customerAddress')).toEqual({ customer: 12 });
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
            deleteCustomerAddress={jest.fn()}
        />
    );
    component.instance().handleInputChange("address1_123", 'new line 21');
    component.instance().handleInputChange("address2_123", 'new line 22');
    component.instance().handleInputChange("address3_123", 'new line 23');
    component.instance().handleInputChange("address4_123", 'new line 24');
    component.instance().handleInputChange("postcode_123", 'new postcode');

    component.instance().saveOrCreateCustomerAddress();

    expect(saveCustomerAddress.mock.calls.length).toBe(1);
    expect(saveCustomerAddress.mock.calls[0][0].id).toBe(customerAddress.id);
    expect(saveCustomerAddress.mock.calls[0][0].address1).toBe("new line 21");
    expect(saveCustomerAddress.mock.calls[0][0].address2).toBe("new line 22");
    expect(saveCustomerAddress.mock.calls[0][0].address3).toBe("new line 23");
    expect(saveCustomerAddress.mock.calls[0][0].address4).toBe("new line 24");
    expect(saveCustomerAddress.mock.calls[0][0].postcode).toBe("new postcode");
    expect(saveCustomerAddress.mock.calls[0][0].customer).toBe(customerAddress.customer);
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
            deleteCustomerAddress={jest.fn()}
        />
    );
    component.instance().handleInputChange("address1_123", 'new line 21');
    component.instance().handleInputChange("address2_123", 'new line 22');
    component.instance().handleInputChange("address3_123", 'new line 23');
    component.instance().handleInputChange("address4_123", 'new line 24');
    component.instance().handleInputChange("postcode_123", 'new postcode');

    component.instance().saveOrCreateCustomerAddress();

    expect(saveCustomerAddress.mock.calls.length).toBe(1);
    expect(saveCustomerAddress.mock.calls[0][0].id).toBe(undefined);
    expect(saveCustomerAddress.mock.calls[0][0].address1).toBe("new line 21");
    expect(saveCustomerAddress.mock.calls[0][0].address2).toBe("new line 22");
    expect(saveCustomerAddress.mock.calls[0][0].address3).toBe("new line 23");
    expect(saveCustomerAddress.mock.calls[0][0].address4).toBe("new line 24");
    expect(saveCustomerAddress.mock.calls[0][0].postcode).toBe("new postcode");
    expect(saveCustomerAddress.mock.calls[0][0].customer).toBe(customerId);
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
            customerId={6}
            deleteCustomerAddress={deleteCustomerAddress}
            saveCustomerAddress={jest.fn()}
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
            saveCustomerAddress={jest.fn()}
        />
    );
    component.instance().handleInputChange("address1_123", 'new line 21');
    component.instance().handleInputChange("address2_123", 'new line 22');
    component.instance().handleInputChange("address3_123", 'new line 23');
    component.instance().handleInputChange("address4_123", 'new line 24');
    component.instance().handleInputChange("postcode_123", 'new postcode');

    component.instance().onClickDelete();
    expect(deleteCustomerAddress.mock.calls.length).toBe(0);
    expect(component.state('customerAddress')).toEqual({ customer: 98 });
});
