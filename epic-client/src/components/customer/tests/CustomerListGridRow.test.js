import React from "react";
import CustomerListGridRow from "../CustomerListGridRow";
import {assertComponentHasExpectedProps, findDataTest} from "../../../../test/assert";
import {customerFields} from "../../app/model/helpers/fields";

describe('CustomerListGridRow', () => {
    const customer = {
        id: 1,
        first_name: 'Anna',
        last_name: 'Weaver',
        email: 'anna.weaver@johnlewis.co.uk',
        add_date: '2018-07-04T13:02:09.988286+01:00',
        upd_date: '2018-07-04T13:02:09.988343+01:00'
    };
    it('should show all areas when action is passed and model', () => {
        const getCustomer = jest.fn();
        const component = shallow(<CustomerListGridRow
            customer={customer}
            getCustomer={getCustomer}
            lockFirstColumn={true}
        />);
        const fieldcells = findDataTest(component, "customer-fields");
        expect(fieldcells).toHaveLength(1);
        assertComponentHasExpectedProps(fieldcells, {
            modelFields: customerFields,
            model: customer,
            lockFirstColumn: true
        });
        const actions = findDataTest(component, "customer-actions");
        expect(actions).toHaveLength(1);
        assertComponentHasExpectedProps(actions, {
            actions: {
                iconName: 'edit',
                iconTitle: 'edit customer',
                iconAction: getCustomer,
            },
            componentKey: 1,
        });
    })
    it('should show only fields when just model passed', () => {
        const component = shallow(<CustomerListGridRow
            customer={customer}
        />);
        const fieldcells = findDataTest(component, "customer-fields");
        expect(fieldcells).toHaveLength(1);
        assertComponentHasExpectedProps(fieldcells, {
            modelFields: customerFields,
            model: customer,
        });
        const actions = findDataTest(component, "customer-actions");
        expect(actions).toHaveLength(0);
    })
});