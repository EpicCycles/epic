import React from 'react';
import CustomerListGridHeaders from "../CustomerListGridHeaders";
import {findDataTest} from "../../../../test/assert";
import {customerFields} from "../../app/model/helpers/fields";

describe('CustomerListGridHeaders', () => {
    it('should show just fields when no other parts are requested', () => {
        const component = shallow(<CustomerListGridHeaders/>);
        expect(findDataTest(component, "customer-field-headers")).toHaveLength(1);
        expect(findDataTest(component, "customer-actions")).toHaveLength(0);
        expect(findDataTest(component, "customer-errors")).toHaveLength(0);
    });
    it('should show error column when errors are requested', () => {
        const component = shallow(<CustomerListGridHeaders
            showErrors={true}
        />);
        expect(findDataTest(component, "customer-field-headers")).toHaveLength(1);
        expect(findDataTest(component, "customer-actions")).toHaveLength(0);
        expect(findDataTest(component, "customer-errors")).toHaveLength(1);
    });
    it('should show fields and actions when actions are requested', () => {
        const component = shallow(<CustomerListGridHeaders
            includeActions={true}
        />);
        expect(findDataTest(component, "customer-field-headers")).toHaveLength(1);
        expect(findDataTest(component, "customer-actions")).toHaveLength(1);
        expect(findDataTest(component, "customer-errors")).toHaveLength(0);
    });
    it('should show fields, errors and actions when actions and errors are requested', () => {
        const component = shallow(<CustomerListGridHeaders
            includeActions={true}
            showErrors={true}
        />);
        expect(findDataTest(component, "customer-field-headers")).toHaveLength(1);
        expect(findDataTest(component, "customer-actions")).toHaveLength(1);
        expect(findDataTest(component, "customer-errors")).toHaveLength(1);
    });
});