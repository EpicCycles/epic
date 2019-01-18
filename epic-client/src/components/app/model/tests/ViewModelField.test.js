import React from 'react';
import {BRAND, CHECKBOX, COUNTRY, CURRENCY, DATE_TIME, PART_TYPE, SELL_PRICE, SUPPLIER, TEXT} from "../helpers/fields";
import ViewModelField from "../ViewModelField";
const foundName = "find me";
const sections = [
    {
        id: 1,
        partTypes: [
            {id:11, name: "id 11"},
            {id:21, name: "id 11"},
        ]
    },
    {
        id: 2,
        partTypes: [
            {id:2, name: foundName},
            {id:22, name: "id 11"},
        ]
    },
];
const brands = [
    {id:1, brand_name: "id is 1"},
    {id:2, brand_name: foundName},
    {id:3, brand_name: "id is 3"},
];
const suppliers = [
    {id:1, supplier_name: "id is 1"},
    {id:2, supplier_name: foundName},
    {id:3, supplier_name: "id is 3"},
];

test("it renders a date field that has data", () => {
    const field =  {
        fieldName: "data_field",
        type: DATE_TIME,
    };
    const model= {data_field: new Date(Date.UTC(2012, 11, 20, 3, 0, 0))};
    expect(shallow(<ViewModelField field={field} model={model} />)).toMatchSnapshot();
});
test("it renders a date field that has no data", () => {
    const field =  {
        fieldName: "data_field",
        type: CURRENCY,
        length:10
    };
    expect(shallow(<ViewModelField field={field} />)).toMatchSnapshot();
});
test("it renders a currency field that has data", () => {
    const field =  {
        fieldName: "data_field",
        type: CURRENCY,
        length:10
    };
    const model= {data_field: 23.90};
    expect(shallow(<ViewModelField field={field} model={model} />)).toMatchSnapshot();
});
test("it renders a currency field that has no data", () => {
    const field =  {
        fieldName: "data_field",
        type: CURRENCY,
        length:10
    };
    expect(shallow(<ViewModelField field={field} />)).toMatchSnapshot();
});
test("it renders a country field that has data", () => {
    const field =  {
        fieldName: "data_field",
        type: COUNTRY,
    };
    const model= {data_field: "DE"};
    expect(shallow(<ViewModelField field={field} model={model} />)).toMatchSnapshot();
});
test("it renders a country field that has no data", () => {
    const field =  {
        fieldName: "data_field",
        type: COUNTRY,
    };
    expect(shallow(<ViewModelField field={field} />)).toMatchSnapshot();
});
test("it renders a text field that has data", () => {
    const field =  {
        fieldName: "data_field",
        type: TEXT,
        length:10
    };
    const model= {data_field: "SHow text"};
    expect(shallow(<ViewModelField field={field} model={model} />)).toMatchSnapshot();
});
test("it renders a text field that has no data", () => {
    const field =  {
        fieldName: "data_field",
        type: TEXT,
        length:10
    };
    expect(shallow(<ViewModelField field={field} />)).toMatchSnapshot();
});
test("it renders a checkbox field that is true", () => {
    const field =  {
        fieldName: "data_field",
        type: CHECKBOX,
    };
    const model= {data_field: true};
    expect(shallow(<ViewModelField field={field} model={model} />)).toMatchSnapshot();
});
test("it renders a checkbox field that is false", () => {
    const field =  {
        fieldName: "data_field",
        type: CHECKBOX,
    };
    const model= {data_field: false};
    expect(shallow(<ViewModelField field={field} model={model} />)).toMatchSnapshot();
});
test("it renders a checkbox field that has no data", () => {
    const field =  {
        fieldName: "data_field",
        type: CURRENCY,
        length:10
    };
    expect(shallow(<ViewModelField field={field} />)).toMatchSnapshot();
});
test("it renders a part type field that has data that is found", () => {
    const field =  {
        fieldName: "data_field",
        type: PART_TYPE,
        length:10
    };
    const model= {data_field: 2};
    expect(shallow(<ViewModelField field={field} model={model} sections={sections} />)).toMatchSnapshot();
});
test("it renders a part type field that has data that is not found", () => {
    const field =  {
        fieldName: "data_field",
        type: PART_TYPE,
        length:10
    };
    const model= {data_field: 202};

    expect(shallow(<ViewModelField field={field} model={model} sections={sections} />)).toMatchSnapshot();
});
test("it renders a part Type field that has no data", () => {
    const field =  {
        fieldName: "data_field",
        type: PART_TYPE,
        length:10
    };
    expect(shallow(<ViewModelField field={field} sections={sections} />)).toMatchSnapshot();
});
test("it renders a brand field that has data that is found", () => {
    const field =  {
        fieldName: "data_field",
        type: BRAND,
        length:10
    };
    const model= {data_field: 2};
    expect(shallow(<ViewModelField field={field} model={model} brands={brands} />)).toMatchSnapshot();
});
test("it renders a brand field that has data that is not found", () => {
    const field =  {
        fieldName: "data_field",
        type: BRAND,
    };
    const model= {data_field: 202};

    expect(shallow(<ViewModelField field={field} model={model} brands={brands} />)).toMatchSnapshot();
});
test("it renders a brand field that has no data", () => {
    const field =  {
        fieldName: "data_field",
        type: BRAND,
    };
    expect(shallow(<ViewModelField field={field} brands={brands} />)).toMatchSnapshot();
});
test("it renders a supplier field that has data that is found", () => {
    const field =  {
        fieldName: "data_field",
        type: SUPPLIER,
        length:10
    };
    const model= {data_field: 2};
    expect(shallow(<ViewModelField field={field} model={model} suppliers={suppliers} />)).toMatchSnapshot();
});
test("it renders a supplier field that has data that is not found", () => {
    const field =  {
        fieldName: "data_field",
        type: SUPPLIER,
    };
    const model= {data_field: 202};

    expect(shallow(<ViewModelField field={field} model={model} suppliers={suppliers} />)).toMatchSnapshot();
});
test("it renders a supplier field that has no data", () => {
    const field =  {
        fieldName: "data_field",
        type: SUPPLIER,
    };
    expect(shallow(<ViewModelField field={field} suppliers={suppliers} />)).toMatchSnapshot();
});
