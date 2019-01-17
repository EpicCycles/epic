import React from 'react';
import FormTextAreaInput from "../FormTextAreaInput";

describe("FormTextAreaInput tests", () => {
  it('renders the form text input correctly', () => {
    const input = shallow(
      <FormTextAreaInput id="1234" label="Test" placeholder="Please enter your loyalty number" onChange={()=>{}} />
    );
    expect(input).toMatchSnapshot();
  });

  it('renders an error when present', ()=>{
    const input = shallow(
      <FormTextAreaInput id="5678" label="Test" placeholder="Please enter your loyalty number" onChange={()=>{}} error="Incorrect loyalty number" />
    );
    expect(input).toMatchSnapshot();
  });

  it("should call providedFunction when the clear Icon is clicked", () => {
    const value = "test@johnlewis.co.uk";
    const providedFunction = jest.fn();
    const input = shallow(
      <FormTextAreaInput
        onClick={providedFunction}
        value={value}
      />);
    input.find("Icon").simulate("click");
    expect(providedFunction.mock.calls.length).toBe(1);
  });

  it("should call onChange when an input is entered", () => {
    const onChange = jest.fn();
    const input = shallow(
      <FormTextAreaInput
        onChange={onChange}
      />);
    input.find("textarea").simulate("change", {target:{value:1234567890123456}});
    expect(onChange.mock.calls.length).toBe(1);
    expect(onChange.mock.calls[0][1]).toBe(1234567890123456);
  });
});