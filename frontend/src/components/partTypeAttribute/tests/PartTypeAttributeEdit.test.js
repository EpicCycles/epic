import React from 'react';
import toJson from 'enzyme-to-json';
import PartTypeAttributeEdit from '../PartTypeAttributeEdit';

describe('PartTypeAttributeEdit tests', () => {
  const attribute = { id: 123, part_type_attribute: 101, attribute_option: 'braze' };

  it('renders the component correctly with a new attribute', () => {
    const input = shallow(<PartTypeAttributeEdit attribute={{}} componentKey="new" />);
    expect(toJson(input)).toMatchSnapshot();
  });
  it('renders the component correctly with an attribute', () => {
    const input = shallow(<PartTypeAttributeEdit attribute={attribute} componentKey="new" />);
    expect(toJson(input)).toMatchSnapshot();
  });
});
