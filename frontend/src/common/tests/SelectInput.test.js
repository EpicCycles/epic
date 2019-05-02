import React from 'react';
import toJson from 'enzyme-to-json';
import SelectInput from '../SelectInput';

describe('SelectInput', () => {
  test('it renders with minimum data', () => {
    const options = [{ value: 'H', name: 'Home' }];
    const component = shallow(
      <SelectInput fieldName="myField" onChange={jest.fn()} options={options} />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  test('it renders an empty option if one is allowed', () => {
    const options = [{ value: 'H', name: 'Home' }];
    const component = shallow(
      <SelectInput fieldName="myField" onChange={jest.fn()} options={options} isEmptyAllowed />,
    );
    expect(toJson(component)).toMatchSnapshot();
    expect(component.find('option')).toHaveLength(2);
  });
  test('it renders a multiple select array if one is passed', () => {
    const options = [
      { value: 'H', name: 'Home' },
      { value: 'A', name: 'Away' },
      { value: 'O', name: 'Other' },
    ];
    const component = shallow(
      <SelectInput
        fieldName="myField"
        onChange={jest.fn()}
        options={options}
        isEmptyAllowed
        isMultiple
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
    expect(component.find('option')).toHaveLength(4);
  });
  test('it renders a multiple select array if one is passed with correct size', () => {
    const options = [
      { value: 'H', name: 'Home' },
      { value: 'A', name: 'Away' },
      { value: 'O', name: 'Other' },
    ];
    const component = shallow(
      <SelectInput
        fieldName="myField"
        onChange={jest.fn()}
        options={options}
        isEmptyAllowed={false}
        isMultiple
        multipleSize={2}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
    expect(component.find('option')).toHaveLength(3);
  });
  test('it sets a value to selected when single value', () => {
    const options = [
      { value: 'H', name: 'Home' },
      { value: 'A', name: 'Away' },
      { value: 'O', name: 'Other' },
    ];
    const selectedValue = ['A'];
    const component = shallow(
      <SelectInput
        fieldName="myField"
        onChange={jest.fn()}
        options={options}
        isEmptyAllowed
        isMultiple
        value={selectedValue}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });
  test('it sets a value to selected when multiple select and values', () => {
    const options = [
      { value: 1, name: 'Home' },
      { value: 2, name: 'Away' },
      { value: 3, name: 'Other' },
    ];
    const selectedValue = [1, 3];
    const component = shallow(
      <SelectInput
        fieldName="myField"
        onChange={jest.fn()}
        options={options}
        isEmptyAllowed={false}
        isMultiple
        value={selectedValue}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });
  test('it renders the default value as selected if no value is passed', () => {
    const options = [
      { value: 'H', name: 'Home' },
      { value: 'A', name: 'Away', isDefault: true },
      { value: 'O', name: 'Other' },
    ];
    const selectedValue = [];
    const component = shallow(
      <SelectInput
        fieldName="myField"
        onChange={jest.fn()}
        options={options}
        isEmptyAllowed={false}
        isMultiple={false}
        value={selectedValue}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });
  test('it renders an error, title and a passed class', () => {
    const options = [
      { value: 'H', name: 'Home' },
      { value: 'A', name: 'Away', isDefault: true },
      { value: 'O', name: 'Other' },
    ];
    const selectedValue = [];
    const component = shallow(
      <SelectInput
        fieldName="myField"
        onChange={jest.fn()}
        options={options}
        isEmptyAllowed={false}
        isMultiple={false}
        value={selectedValue}
        error="show an error"
        title="show a title"
        className="pink"
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });
});
