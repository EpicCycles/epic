import React from "react";
import {BRAND, CHECKBOX, COUNTRY, CURRENCY, PART_TYPE, SUPPLIER, TEXT, TEXT_AREA} from "../helpers/fields";
import EditModelInput from "../EditModelInput";

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
const emptyModel = {};
const componentKey = 12;
test("it renders a currency field that has data", () => {
    const field = {
        fieldName: "data_field",
        type: CURRENCY,
        length: 10
    };
    const model = { data_field: 23.90 };
    expect(shallow(<EditModelInput
        field={field}
        model={model}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
    />)).toMatchSnapshot();
});
test("it renders a currency field that has no data", () => {
    const field = {
        fieldName: "data_field",
        type: CURRENCY,
        length: 10
    };
    expect(shallow(<EditModelInput
        field={field}
        model={emptyModel}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
    />)).toMatchSnapshot();
});
test("it renders a country field that has data", () => {
    const field = {
        fieldName: "data_field",
        type: COUNTRY,
    };
    const model = { data_field: "NZ" };
    expect(shallow(<EditModelInput
        field={field}
        model={model}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
    />)).toMatchSnapshot();
});
test("it renders a country field that has no data", () => {
    const field = {
        fieldName: "data_field",
        type: COUNTRY,
    };
    expect(shallow(<EditModelInput
        field={field}
        model={emptyModel}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
    />)).toMatchSnapshot();
});
test("it renders a text field that has data", () => {
    const field = {
        fieldName: "data_field",
        type: TEXT,
        length: 10
    };
    const model = { data_field: "SHow text" };
    expect(shallow(<EditModelInput
        field={field}
        model={model}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
    />)).toMatchSnapshot();
});
test("it renders a text field that has no data", () => {
    const field = {
        fieldName: "data_field",
        type: TEXT,
        length: 10
    };
    expect(shallow(<EditModelInput
        field={field}
        model={emptyModel}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
    />)).toMatchSnapshot();
});
test("it renders a textarea field that has data", () => {
    const field = {
        fieldName: "data_field",
        type: TEXT_AREA,
        size: 400,
    };
    const model = { data_field: "SHow text" };
    expect(shallow(<EditModelInput
        field={field}
        model={model}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
    />)).toMatchSnapshot();
});
test("it renders a textarea field that has no data", () => {
    const field = {
        fieldName: "data_field",
        type: TEXT_AREA,
        size: 400,
        header: "put text here"
    };
    expect(shallow(<EditModelInput
        field={field}
        model={emptyModel}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
    />)).toMatchSnapshot();
});

test("it renders a checkbox field that is true", () => {
    const field = {
        fieldName: "data_field",
        type: CHECKBOX,
    };
    const model = { data_field: true };
    expect(shallow(<EditModelInput
        field={field}
        model={model}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
    />)).toMatchSnapshot();
});
test("it renders a checkbox field that is false", () => {
    const field = {
        fieldName: "data_field",
        type: CHECKBOX,
    };
    const model = { data_field: false };
    expect(shallow(<EditModelInput
        field={field}
        model={model}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
    />)).toMatchSnapshot();
});
test("it renders a checkbox field that has no data", () => {
    const field = {
        fieldName: "data_field",
        type: CURRENCY,
        length: 10
    };
    expect(shallow(<EditModelInput
        field={field}
        model={emptyModel}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
    />)).toMatchSnapshot();
});
test("it renders a part type field that has data that is found", () => {
    const field = {
        fieldName: "data_field",
        type: PART_TYPE,
        length: 10
    };
    const model = { data_field: 2 };
    expect(shallow(<EditModelInput
        field={field}
        model={model}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
        sections={sections}
    />)).toMatchSnapshot();
});
test("it renders a part type field that has data that is not found", () => {
    const field = {
        fieldName: "data_field",
        type: PART_TYPE,
        length: 10
    };
    const model = { data_field: 202 };

    expect(shallow(<EditModelInput
        field={field}
        model={model}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
        sections={sections}
    />)).toMatchSnapshot();
});
test("it renders a part Type field that has no data", () => {
    const field = {
        fieldName: "data_field",
        type: PART_TYPE,
        length: 10
    };
    expect(shallow(<EditModelInput
        field={field}
        model={emptyModel}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
        sections={sections}
    />)).toMatchSnapshot();
});
test("it renders a brand field that has data that is found", () => {
    const field = {
        fieldName: "data_field",
        type: BRAND,
        length: 10
    };
    const model = { data_field: 2 };
    expect(shallow(<EditModelInput
        field={field}
        model={model}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
        brands={brands}
    />)).toMatchSnapshot();
});
test("it renders a brand field that has data that is not found", () => {
    const field = {
        fieldName: "data_field",
        type: BRAND,
    };
    const model = { data_field: 202 };

    expect(shallow(<EditModelInput
        field={field}
        model={model}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
        brands={brands}
    />)).toMatchSnapshot();
});
test("it renders a brand field that has no data", () => {
    const field = {
        fieldName: "data_field",
        type: BRAND,
    };
    expect(shallow(<EditModelInput
        field={field}
        model={emptyModel}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
        brands={brands}
    />)).toMatchSnapshot();
});
test("it renders a supplier field that has data that is found", () => {
    const field = {
        fieldName: "data_field",
        type: SUPPLIER,
        length: 10
    };
    const model = { data_field: 2 };
    expect(shallow(<EditModelInput
        field={field}
        model={model}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
        suppliers={suppliers}
    />)).toMatchSnapshot();
});
test("it renders a supplier field that has data that is not found", () => {
    const field = {
        fieldName: "data_field",
        type: SUPPLIER,
    };
    const model = { data_field: 202 };

    expect(shallow(<EditModelInput
        field={field}
        model={model}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
        suppliers={suppliers}
    />)).toMatchSnapshot();
});
test("it renders a supplier field that has no data", () => {
    const field = {
        fieldName: "data_field",
        type: SUPPLIER,
    };
    expect(shallow(<EditModelInput
        field={field}
        model={emptyModel}
        componentKey={componentKey}
        index={0}
        onChange={jest.fn()}
        suppliers={suppliers}
    />)).toMatchSnapshot();
});
test("it calls onchange with a valid field setting state correctly", () => {
    const field = {
        fieldName: "data_field",
        type: CURRENCY,
        length: 10
    };
    const model = { data_field: 23.90 };
    const persistedModel = { data_field: 123.99 };
    let onChange = jest.fn();
    let component = shallow(<EditModelInput
        field={field}
        model={model}
        persistedModel={persistedModel}
        componentKey={componentKey}
        index={0}
        onChange={onChange}
    />);
    component.instance().validateOnChange(field.fieldName, '45.75');
    expect(onChange.mock.calls.length).toBe(1);
    expect(onChange.mock.calls[0][0]).toBe(field.fieldName);
    expect(onChange.mock.calls[0][1]).toBe('45.75');
    expect(onChange.mock.calls[0][2]).toBe(componentKey);
});
test("it calls reset on a field to set back to model value", () => {
    const field = {
        fieldName: "data_field",
        type: CURRENCY,
        length: 10
    };
    const model = { data_field: 23.90 };
    const persistedModel = { data_field: 123.99 };
    let onChange = jest.fn();
    let component = shallow(<EditModelInput
        field={field}
        model={model}
        persistedModel={persistedModel}
        componentKey={componentKey}
        index={0}
        onChange={onChange}
    />);
    component.instance().resetField(field.fieldName);
    expect(onChange.mock.calls.length).toBe(1);
    expect(onChange.mock.calls[0][0]).toBe(field.fieldName);
    expect(onChange.mock.calls[0][1]).toBe(persistedModel.data_field);
    expect(onChange.mock.calls[0][2]).toBe(componentKey);
});
test("it calls reset on a field with no model and shows error", () => {
    const field = {
        fieldName: "data_field",
        type: CURRENCY,
        length: 10,
        required: true,
        error: "My data is missing"
    };
    const model = { data_field: 23.90 };
    let onChange = jest.fn();
    let component = shallow(<EditModelInput
        field={field}
        model={model}
        persistedModel={emptyModel}
        componentKey={componentKey}
        index={0}
        onChange={onChange}
    />);
    component.instance().resetField(field.fieldName);
    expect(onChange.mock.calls.length).toBe(1);
    expect(onChange.mock.calls[0][0]).toBe(field.fieldName);
    expect(onChange.mock.calls[0][1]).toBe("");
    expect(onChange.mock.calls[0][2]).toBe(componentKey);
});
test("it calls onchange with a missing field setting state correctly", () => {
    const field = {
        fieldName: "data_field",
        type: CURRENCY,
        length: 10,
        required: true,
        error: "My data is missing"
    };
    const model = { data_field: 23.90 };
    const persistedModel = { data_field: 123.99 };
    let onChange = jest.fn();
    let component = shallow(<EditModelInput
        field={field}
        model={model}
        persistedModel={persistedModel}
        componentKey={componentKey}
        index={0}
        onChange={onChange}
    />);
    component.instance().validateOnChange(field.fieldName);
    expect(onChange.mock.calls.length).toBe(1);
    expect(onChange.mock.calls[0][0]).toBe(field.fieldName);
    expect(onChange.mock.calls[0][1]).toBe("");
    expect(onChange.mock.calls[0][2]).toBe(componentKey);
});