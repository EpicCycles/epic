import React from "react";

import CustomerAddressGrid from "../CustomerAddressGrid";
import {findDataTest} from "../../../../test/assert";

describe('CustomerAddressGrid', () => {
    it('should render only a new address when no addresses passed', () => {
        const component = shallow(<CustomerAddressGrid
            deleteCustomerAddress={jest.fn()}
            saveCustomerAddress={jest.fn()}
        />);
        expect(findDataTest(component, "existing-address")).toHaveLength(0);
        expect(findDataTest(component, "new-address")).toHaveLength(1);
    });
    it('should render existing and new addresses when addresses passed', () => {
        const addresses = [
            { id: 1, address1: 'FirstLine 1' },
            { id: 2, address1: 'FirstLine 2' },
            { id: 3, address1: 'FirstLine 3' },
        ];
        const component = shallow(<CustomerAddressGrid
            deleteCustomerAddress={jest.fn()}
            saveCustomerAddress={jest.fn()}
            addresses={addresses}
        />);
        expect(findDataTest(component, "existing-address")).toHaveLength(3);
        expect(findDataTest(component, "new-address")).toHaveLength(1);
        expect(component.state('new-address').address1).toEqual(undefined);

    });
    it('should replace the new address component when the props change to include a new address', () => {
        const addresses = [
            { id: 1, address1: 'FirstLine 1' },
            { id: 2, address1: 'FirstLine 2' },
            { id: 3, address1: 'FirstLine 3' },
        ];
        const addressesWithNewAddress = [
            { id: 1, address1: 'FirstLine 1' },
            { id: 2, address1: 'FirstLine 2' },
            { id: 3, address1: 'FirstLine 3' },
            { id: 4, address1: 'New Line 1' },
        ];
        const component = shallow(<CustomerAddressGrid
            deleteCustomerAddress={jest.fn()}
            saveCustomerAddress={jest.fn()}
            addresses={addresses}
        />);
        const newAddressToSave = { address1: 'New Line 1 not this', dummyKey: 'dummyKey' };
        component.instance().saveNewCustomerAddress(newAddressToSave);
        component.update();
        expect(component.state('new-address')).toEqual(newAddressToSave);

        expect(findDataTest(component, "existing-address")).toHaveLength(3);
        expect(findDataTest(component, "new-address")).toHaveLength(1);
        component.setProps({ addresses: addressesWithNewAddress });
        component.update();

        expect(findDataTest(component, "existing-address")).toHaveLength(4);
        expect(findDataTest(component, "new-address")).toHaveLength(1);
        expect(component.state('new-address')).toNotEqual(newAddressToSave);

    });
    it('should not replace the new address component when the props change to include a new address that is not this one', () => {
        const addresses = [
            { id: 1, address1: 'FirstLine 1' },
            { id: 2, address1: 'FirstLine 2' },
            { id: 3, address1: 'FirstLine 3' },
        ];
        const addressesWithNewAddress = [
            { id: 1, address1: 'FirstLine 1' },
            { id: 3, address1: 'FirstLine 3' },
            { id: 4, address1: 'New Line 1' },
        ];
        const component = shallow(<CustomerAddressGrid
            deleteCustomerAddress={jest.fn()}
            saveCustomerAddress={jest.fn()}
            addresses={addresses}
        />);
        const newAddressToSave = { address1: 'New Line 1 not this', dummyKey: 'dummyKey' };
        component.instance().saveNewCustomerAddress(newAddressToSave);
        component.update();
        expect(component.state('new-address')).toEqual(newAddressToSave);

        expect(findDataTest(component, "existing-address")).toHaveLength(3);
        expect(findDataTest(component, "new-address")).toHaveLength(1);
        component.setProps({ addresses: addressesWithNewAddress });
        component.update();

        expect(findDataTest(component, "existing-address")).toHaveLength(3);
        expect(findDataTest(component, "new-address")).toHaveLength(1);
        expect(component.state('new-address')).toEqual(newAddressToSave);

    });
});