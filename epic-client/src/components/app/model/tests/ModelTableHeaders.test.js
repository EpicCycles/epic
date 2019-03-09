import React from 'react';
import ModelTableHeaders from "../ModelTableHeaders";
import {customerFields} from "../helpers/fields";
import {findDataTest} from "../../../../../test/assert";

describe('ModelTableHeaders', () => {
    it('should show all the headers when a model has fields', () => {
        const component = shallow(<ModelTableHeaders modelFields={customerFields}/>);
        expect(findDataTest(component, "model-field-header")).toHaveLength(customerFields.length);
    });
 });