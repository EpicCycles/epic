import React from 'react';
import toJson from 'enzyme-to-json';
import PartTypeAttributes from '../../../components/partTypeAttribute/PartTypeAttributes';

describe('PartTypeAttributes tests', () => {
  const attributes = [
    {
      id: 12,
      options: [],
      attribute_name: 'Colour',
      in_use: true,
      mandatory: true,
      placing: 1,
      attribute_type: '1',
      partType: 18,
    },
    {
      id: 17,
      options: [],
      attribute_name: 'Size',
      in_use: true,
      mandatory: true,
      placing: 2,
      attribute_type: '1',
      partType: 18,
    },
    {
      id: 11,
      options: [
        {
          id: 5,
          attribute_option: 'Long',
          part_type_attribute: 11,
        },
        {
          id: 4,
          attribute_option: 'Medium',
          part_type_attribute: 11,
        },
        {
          id: 3,
          attribute_option: 'Short',
          part_type_attribute: 11,
        },
      ],
      attribute_name: 'Valve Length',
      in_use: true,
      mandatory: false,
      placing: 1,
      attribute_type: '4',
      partType: 19,
    },
  ];

  const partTypeId = 234;

  it('renders the form correctly with no attributes', () => {
    const input = shallow(<PartTypeAttributes attributes={[]} partTypeId={partTypeId} />);
    expect(toJson(input)).toMatchSnapshot();
  });
  it('renders the form correctly with attributes', () => {
    const input = shallow(
      <PartTypeAttributes attributes={attributes} partTypeId={attributes[0].partType} />,
    );
    expect(toJson(input)).toMatchSnapshot();
  });
  it('renders the form correctly when all attributes deleted', () => {
    const attributesDeleted = [
      { id: 123, partType: 101, delete: true },
      { id: 323, partType: 101, delete: true },
      { partType: 1, dummyKey: 'hjgfkuyg34', delete: true },
    ];
    const input = shallow(
      <PartTypeAttributes
        attributes={attributesDeleted}
        partTypeId={attributesDeleted[0].partType}
      />,
    );
    expect(toJson(input)).toMatchSnapshot();
  });
});
