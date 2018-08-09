import React from 'react';
import FormTextInput from "../../common/FormTextInput";

describe("FormTextInput tests", () => {
  it('renders the form text input correctly', () => {
    const input = shallow(
      <FormTextInput id="1234" label="Test" placeholder="Please enter your loyalty number" onChange={()=>{}} />
    );
    expect(input).toMatchSnapshot();
  });

  it('renders an error when present', ()=>{
    const input = shallow(
      <FormTextInput id="5678" label="Test" placeholder="Please enter your loyalty number" onChange={()=>{}} error="Incorrect loyalty number" />
    );
    expect(input).toMatchSnapshot();
  });

  it("should call onClearEmail when the button is clicked", () => {
    const value = "test@johnlewis.co.uk";
    const onClearEmail = jest.fn();
    const input = shallow(
      <FormTextInput
        onClick={onClearEmail}
        value={value}
      />);
    input.find("Icon").simulate("click");
    expect(onClearEmail.mock.calls.length).toBe(1);
  });

  it("should call onChange when an input is entered", () => {
    const onChange = jest.fn();
    const input = shallow(
      <FormTextInput
        onChange={onChange}
      />);
    input.find("input").simulate("change", {target:{value:1234567890123456}});
    expect(onChange.mock.calls.length).toBe(1);
    expect(onChange.mock.calls[0][0]).toBe(1234567890123456);
  });
});