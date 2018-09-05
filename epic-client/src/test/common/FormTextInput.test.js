import React from 'react';
import FormTextInput from "../../common/FormTextInput";

test('renders the form text input correctly', () => {
    const input = shallow(
        <FormTextInput id="1234" label="Test" placeholder="Please enter your loyalty number" onChange={() => {
        }}/>
    );
    expect(input).toMatchSnapshot();
});

test('renders an error when present', () => {
    const input = shallow(
        <FormTextInput id="5678" label="Test" placeholder="Please enter your loyalty number" onChange={() => {
        }} error="Incorrect loyalty number"/>
    );
    expect(input).toMatchSnapshot();
});

xit("should call onClearEmail when the button is clicked", () => {
    const onChange = jest.fn();
    const value = "test@johnlewis.co.uk";
    const fieldName = "email";
    const onClearEmail = jest.fn();
    const input = shallow(
        <FormTextInput
            onClick={onClearEmail}
            onChange={onChange}
            value={value}
            fieldName={fieldName}
        />);
    expect(input).toMatchSnapshot();
    expect(input.find('#removeemail').length).toBe(1);
    input.find("#removeemail").simulate("click");
    expect(onClearEmail.mock.calls.length).toBe(1);
});

test("should call onChange when an input is entered", () => {
    const onChange = jest.fn();
    const value = "test@johnlewis.co.uk";
    const fieldName = "email";
    const onClearEmail = jest.fn();
    const input = shallow(
        <FormTextInput
            onClick={onClearEmail}
            onChange={onChange}
            value={value}
            fieldName={fieldName}
        />);
    expect(input).toMatchSnapshot();
    input.find("input").simulate("change", { target: { value: 1234567890123456 } });
    expect(onChange.mock.calls.length).toBe(1);
});
