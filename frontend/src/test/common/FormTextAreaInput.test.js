import React from 'react';
import toJson from 'enzyme-to-json';
import FormTextAreaInput from '../../common/FormTextAreaInput';

describe('FormTextAreaInput tests', () => {
  it('renders the form text input correctly', () => {
    const input = shallow(
      <FormTextAreaInput
        id="1234"
        label="Test"
        placeholder="Please enter your loyalty number"
        onChange={jest.fn()}
      />,
    );
    expect(toJson(input)).toMatchSnapshot();
  });

  it('renders an error when present', () => {
    const input = shallow(
      <FormTextAreaInput
        id="5678"
        label="Test"
        placeholder="Please enter your loyalty number"
        onChange={jest.fn()}
        error="Incorrect loyalty number"
      />,
    );
    expect(toJson(input)).toMatchSnapshot();
  });

  it('should call providedFunction when the clear Icon is clicked', () => {
    const value = 'test@johnlewis.co.uk';
    const providedFunction = jest.fn();
    const input = shallow(<FormTextAreaInput onClick={providedFunction} value={value} />);
    input.find('Icon').simulate('click');
    expect(providedFunction.mock.calls).toHaveLength(1);
  });

  it('should call onChange when an input is entered', () => {
    const onChange = jest.fn();
    const input = shallow(<FormTextAreaInput onChange={onChange} />);
    input.find('textarea').simulate('change', { target: { value: 1234567890123456 } });
    expect(onChange.mock.calls).toHaveLength(1);
    expect(onChange.mock.calls[0][1]).toBe(1234567890123456);
  });
});
