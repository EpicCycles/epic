import React from 'react';
import SupplierSelect from "../../../components/supplier/SupplierSelect";
import {assertComponentHasExpectedProps} from "../../jest_helpers/assert";

describe('SupplierSelect', () => {
    it('should pass details down to the select input component', () => {
        const suppliers = [
            {
                "id": 1,
                "supplier_name": "id is 1",
            },
            {
                "id": 2,
                "supplier_name": "find me",
            },
            {
                "id": 3,
                "supplier_name": "id is 3",
            },
        ];
        const supplierOptions = [
            { value: 1, name: "id is 1" },
            { value: 2, name: "find me" },
            { value: 3, name: "id is 3" }
        ];
        const component = shallow(<SupplierSelect
            disabled={false}
            error=""
            fieldName="data_field_120"
            isEmptyAllowed={true}
            onChange={jest.fn()}
            supplierSelected={2}
            suppliers={suppliers}
        />);
        const selectInput = component.find('SelectInput');
        expect(selectInput).toHaveLength(1);
        assertComponentHasExpectedProps(selectInput, {
            fieldName: "data_field_120",
            value: 2,
            options: supplierOptions,
            isEmptyAllowed: true,
            error: ""
        });
    })
});
