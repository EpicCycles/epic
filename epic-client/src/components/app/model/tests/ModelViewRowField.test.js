import React from 'react';
import {CURRENCY, DATE_TIME, TEXT} from "../helpers/fields";
import ModelViewRowField from "../ModelViewRowField";

const foundName = "find me";
const sections = [
    {
        id: 1,
        partTypes: [
            { id: 11, name: "id 11" },
            { id: 21, name: "id 11" },
        ]
    },
    {
        id: 2,
        partTypes: [
            { id: 2, name: foundName },
            { id: 22, name: "id 11" },
        ]
    },
];
const brands = [
    { id: 1, brand_name: "id is 1" },
    { id: 2, brand_name: foundName },
    { id: 3, brand_name: "id is 3" },
];
const suppliers = [
    { id: 1, supplier_name: "id is 1" },
    { id: 2, supplier_name: foundName },
    { id: 3, supplier_name: "id is 3" },
];
describe('ModelViewRowField', () => {

    test("it should render when passed a field with data", () => {
        const field = {
            fieldName: "data_field",
            type: DATE_TIME,
        };
        const model = { data_field: new Date(Date.UTC(2012, 11, 20, 3, 0, 0)) };
        expect(shallow(<ModelViewRowField field={field} model={model}/>)).toMatchSnapshot();
    });
    test("it renders when passed a field that has no data", () => {
        const field = {
            fieldName: "data_field",
            type: CURRENCY,
            length: 10
        };
        expect(shallow(<ModelViewRowField field={field}/>)).toMatchSnapshot();
    });
    test("it renders when passed a field that has multiple values", () => {
        const field = {
            fieldName: "data_field",
            type: TEXT,
            length: 10
        };
        const model = { data_field: ['one', 'two', 'three'] };
        expect(shallow(<ModelViewRowField field={field}/>)).toMatchSnapshot();
    });

});
