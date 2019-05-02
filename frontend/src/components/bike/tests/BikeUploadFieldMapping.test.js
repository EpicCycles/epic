import React from 'react';
import toJson from 'enzyme-to-json';
import { COLOURS_FIELD } from '../../app/model/helpers/fields';
import { BikeUploadFieldMapping } from '../BikeUploadFieldMapping';

const undoMapping = jest.fn();

test('it renders correctly when no rows match', () => {
  const field = COLOURS_FIELD;
  const rowMappings = [];
  const component = shallow(
    <BikeUploadFieldMapping
      field={field}
      index={0}
      rowMappings={rowMappings}
      undoMapping={undoMapping}
    />,
  );
  expect(toJson(component)).toMatchSnapshot();
});
test('it renders correctly when rows match', () => {
  const field = COLOURS_FIELD;
  const rowMappings = [{ fieldName: 'blah' }];
  const component = shallow(
    <BikeUploadFieldMapping
      field={field}
      index={1}
      rowMappings={rowMappings}
      undoMapping={undoMapping}
    />,
  );
  expect(toJson(component)).toMatchSnapshot();
});
