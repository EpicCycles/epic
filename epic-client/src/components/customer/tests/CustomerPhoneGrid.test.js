import React from "react";

import CustomerPhoneGrid from "../CustomerPhoneGrid";
import {findDataTest} from "../../../../test/assert";

describe('CustomerPhoneGrid', () => {
    it('should render only a new phone when no phones passed', () => {
        const component = shallow(<CustomerPhoneGrid
            deleteCustomerPhone={jest.fn()}
            saveCustomerPhone={jest.fn()}
        />);
        expect(findDataTest(component, "existing-phone")).toHaveLength(0);
        expect(findDataTest(component, "new-phone")).toHaveLength(1);
    });
    it('should render existing and new phones when phones passed', () => {
        const phones = [
            { id: 1, telephone: 'FirstLine 1' },
            { id: 2, telephone: 'FirstLine 2' },
            { id: 3, telephone: 'FirstLine 3' },
        ];
        const component = shallow(<CustomerPhoneGrid
            deleteCustomerPhone={jest.fn()}
            saveCustomerPhone={jest.fn()}
            phones={phones}
        />);
        expect(findDataTest(component, "existing-phone")).toHaveLength(3);
        expect(findDataTest(component, "new-phone")).toHaveLength(1);
        expect(component.state('newPhone').telephone).toEqual(undefined);

    });
    it('should replace the new phone component when the props change to include a new phone', () => {
        const phones = [
            { id: 1, telephone: 'FirstLine 1' },
            { id: 2, telephone: 'FirstLine 2' },
            { id: 3, telephone: 'FirstLine 3' },
        ];
              const newPhoneToSave = { telephone: 'New Line 1', dummyKey: 'dummyKey' };
  const phonesWithNewPhone = [
            { id: 1, telephone: 'FirstLine 1' },
            { id: 2, telephone: 'FirstLine 2' },
            { id: 3, telephone: 'FirstLine 3' },
            newPhoneToSave,
        ];
        const component = shallow(<CustomerPhoneGrid
            deleteCustomerPhone={jest.fn()}
            saveCustomerPhone={jest.fn()}
            phones={phones}
        />);
        component.instance().saveNewCustomerPhone(newPhoneToSave);
        component.update();
        expect(component.state('newPhone')).toEqual(newPhoneToSave);

        expect(findDataTest(component, "existing-phone")).toHaveLength(3);
        expect(findDataTest(component, "new-phone")).toHaveLength(1);
        component.setProps({ phones: phonesWithNewPhone });
        // component.update();

        expect(findDataTest(component, "existing-phone")).toHaveLength(4);
        expect(findDataTest(component, "new-phone")).toHaveLength(1);
        expect(component.state('newPhone')).not.toEqual(newPhoneToSave);

    });
    it('should not replace the new phone component when the props change to include a new phone that is not this one', () => {
        const phones = [
            { id: 1, telephone: 'FirstLine 1' },
            { id: 2, telephone: 'FirstLine 2' },
            { id: 3, telephone: 'FirstLine 3' },
        ];
        const phonesWithNewPhone = [
            { id: 1, telephone: 'FirstLine 1' },
            { id: 3, telephone: 'FirstLine 3' },
            { id: 4, telephone: 'New Line 1' },
        ];
        const component = shallow(<CustomerPhoneGrid
            deleteCustomerPhone={jest.fn()}
            saveCustomerPhone={jest.fn()}
            phones={phones}
        />);
        const newPhoneToSave = { telephone: 'New Line 1 not this', dummyKey: 'dummyKey' };
        component.instance().saveNewCustomerPhone(newPhoneToSave);
        component.update();
        expect(component.state('newPhone')).toEqual(newPhoneToSave);

        expect(findDataTest(component, "existing-phone")).toHaveLength(3);
        expect(findDataTest(component, "new-phone")).toHaveLength(1);
        component.setProps({ phones: phonesWithNewPhone });
        component.update();

        expect(findDataTest(component, "existing-phone")).toHaveLength(3);
        expect(findDataTest(component, "new-phone")).toHaveLength(1);
        expect(component.state('newPhone')).toEqual(newPhoneToSave);

    });
});