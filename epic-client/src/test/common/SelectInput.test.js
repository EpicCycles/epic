import React from 'react';
import SelectInput from "../../common/SelectInput";

test("it renders with minimum data", () => {
    const options = [{ value: "H", name: "Home" }];
    const component = shallow(<SelectInput
        fieldName="myField"
        onChange={jest.fn()}
        options={options}
    />);
    expect(component).toMatchSnapshot();
});

test("it renders an empty option if one is allowed", () => {
    const options = [{ value: "H", name: "Home" }];
    const component = shallow(<SelectInput
        fieldName="myField"
        onChange={jest.fn()}
        options={options}
        isEmptyAllowed={true}
    />);
    expect(component).toMatchSnapshot();
    expect(component.find('option').length).toBe(2);
});
test("it renders a multiple select array if one is passed", () => {
    const options = [
        { value: "H", name: "Home" },
        { value: "A", name: "Away" },
        { value: "O", name: "Other" },
    ];
    const component = shallow(<SelectInput
        fieldName="myField"
        onChange={jest.fn()}
        options={options}
        isEmptyAllowed={true}
        isMultiple={true}
    />);
    expect(component).toMatchSnapshot();
    expect(component.find('option').length).toBe(4);
});
test("it renders a multiple select array if one is passed with correct size", () => {
    const options = [
        { value: "H", name: "Home" },
        { value: "A", name: "Away" },
        { value: "O", name: "Other" },
    ];
    const component = shallow(<SelectInput
        fieldName="myField"
        onChange={jest.fn()}
        options={options}
        isEmptyAllowed={false}
        isMultiple={true}
        multipleSize={2}
    />);
    expect(component).toMatchSnapshot();
    expect(component.find('option').length).toBe(3);
});
test("it sets a value to selected if it is in the array of selected values - single select", () => {
    const options = [
        { value: "H", name: "Home" },
        { value: "A", name: "Away" },
        { value: "O", name: "Other" },
    ];
    const selectedValue = ["A"];
    const component = shallow(<SelectInput
        fieldName="myField"
        onChange={jest.fn()}
        options={options}
        isEmptyAllowed={true}
        isMultiple={true}
        value={selectedValue}
    />);
    expect(component).toMatchSnapshot();
});
test("it sets a value to selected if it is in the array of selected values - multiple select", () => {
    const options = [
        { value: 1, name: "Home" },
        { value: 2, name: "Away" },
        { value: 3, name: "Other" },
    ];
    const selectedValue = [1,3];
    const component = shallow(<SelectInput
        fieldName="myField"
        onChange={jest.fn()}
        options={options}
        isEmptyAllowed={false}
        isMultiple={true}
        value={selectedValue}
    />);
    expect(component).toMatchSnapshot();
});
test("it renders the default value as selected if no value is passed", () => {
    const options = [
        { value: "H", name: "Home" },
        { value: "A", name: "Away", isDefault: true },
        { value: "O", name: "Other" },
    ];
    const selectedValue = [];
    const component = shallow(<SelectInput
        fieldName="myField"
        onChange={jest.fn()}
        options={options}
        isEmptyAllowed={false}
        isMultiple={false}
        value={selectedValue}
    />);
    expect(component).toMatchSnapshot();
});
test("it renders an error, title and a passed class", () => {
    const options = [
        { value: "H", name: "Home" },
        { value: "A", name: "Away", isDefault: true },
        { value: "O", name: "Other" },
    ];
    const selectedValue = [];
    const component = shallow(<SelectInput
        fieldName="myField"
        onChange={jest.fn()}
        options={options}
        isEmptyAllowed={false}
        isMultiple={false}
        value={selectedValue}
        error="show an error"
        title="show a title"
        className="pink"
    />);
    expect(component).toMatchSnapshot();
});
