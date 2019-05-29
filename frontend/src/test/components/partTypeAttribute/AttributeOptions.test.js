import React from 'react';
import toJson from 'enzyme-to-json';
import AttributeOptions from '../../../components/partTypeAttribute/AttributeOptions';

describe('AttributeOptions tests', () => {
  const attributeId = 234;

  it('renders the form correctly with no options', () => {
    const input = shallow(<AttributeOptions options={[]} attributeKey={attributeId} />);
    expect(toJson(input)).toMatchSnapshot();
  });
  it('renders the form correctly with options', () => {
    const options = [
      { id: 123, part_type_attribute: 101, option_name: 'braze' },
      { id: 323, part_type_attribute: 101, option_name: 'band', delete: false },
      { part_type_attribute: 1, option_name: 'boggle', dummyKey: 'hjgfkuyg34' },
    ];
    const input = shallow(<AttributeOptions options={options} attributeKey={attributeId} />);
    expect(toJson(input)).toMatchSnapshot();
  });
  it('renders the form correctly when all options deleted', () => {
    const optionsDeleted = [
      { id: 123, part_type_attribute: 101, option_name: 'braze', delete: true },
      { id: 323, part_type_attribute: 101, option_name: 'band', delete: true },
      { part_type_attribute: 1, option_name: 'braze', dummyKey: 'hjgfkuyg34', delete: true },
    ];
    const input = shallow(<AttributeOptions options={optionsDeleted} attributeKey={attributeId} />);
    expect(toJson(input)).toMatchSnapshot();
  });
});
