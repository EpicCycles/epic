import React from 'react';
import toJson from 'enzyme-to-json';
import PartTypeSelect from '../PartTypeSelect';

test('it displays correctly', () => {
  const sections = [
    {
      id: 1,
      name: 'sections1',
      partTypes: [
        {
          id: 11,
          name: 'partType 1',
        },
      ],
    },
    {
      id: 2,
      name: 'sections2',
      partTypes: [
        {
          id: 21,
          name: 'partType 21',
        },
        {
          id: 22,
          name: 'partType 22',
        },
        {
          id: 23,
          name: 'partType 23',
        },
      ],
    },
  ];
  const component = shallow(<PartTypeSelect sections={sections} fieldName="name_of_field" />);
  expect(toJson(component)).toMatchSnapshot();
});
