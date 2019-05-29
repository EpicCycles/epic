import {
  ATTRIBUTE_VALUE,
  NUMBER,
  RADIO,
  SELECT_ONE,
  TEXT,
} from '../../../../components/app/model/helpers/fields';
import { buildFieldForAttribute } from '../../../../components/partTypeAttribute/helpers/partTypeAttribute';
import { SELECT_ONE_MISSING, VALUE_MISSING } from '../../../../components/app/model/helpers/error';

test('it formats a text field', () => {
  const selectAttribute = {
    id: 11,
    options: [],
    attribute_name: 'Valve Length',
    in_use: true,
    mandatory: false,
    placing: 10,
    attribute_type: '1',
    partType: 19,
  };
  const expectedField = {
    header: selectAttribute.attribute_name,
    required: selectAttribute.mandatory,
    fieldName: ATTRIBUTE_VALUE,
    type: TEXT,
  };
  expect(buildFieldForAttribute(selectAttribute)).toEqual(expectedField);
});
test('it formats a mandatory text field', () => {
  const selectAttribute = {
    id: 11,
    options: [],
    attribute_name: 'Valve Length',
    in_use: true,
    mandatory: true,
    placing: 10,
    attribute_type: '1',
    partType: 19,
  };
  const expectedField = {
    header: selectAttribute.attribute_name,
    required: selectAttribute.mandatory,
    fieldName: ATTRIBUTE_VALUE,
    type: TEXT,
    error: VALUE_MISSING,
  };
  expect(buildFieldForAttribute(selectAttribute)).toEqual(expectedField);
});
test('it formats a numeric field', () => {
  const selectAttribute = {
    id: 11,
    options: [],
    attribute_name: 'Valve Length',
    in_use: true,
    mandatory: false,
    placing: 10,
    attribute_type: '2',
    partType: 19,
  };
  const expectedField = {
    header: selectAttribute.attribute_name,
    required: selectAttribute.mandatory,
    fieldName: ATTRIBUTE_VALUE,
    type: NUMBER,
  };
  expect(buildFieldForAttribute(selectAttribute)).toEqual(expectedField);
});
test('it formats a mandatory numeric field', () => {
  const selectAttribute = {
    id: 11,
    options: [],
    attribute_name: 'Valve Length',
    in_use: true,
    mandatory: true,
    placing: 10,
    attribute_type: '2',
    partType: 19,
  };
  const expectedField = {
    header: selectAttribute.attribute_name,
    required: selectAttribute.mandatory,
    fieldName: ATTRIBUTE_VALUE,
    type: NUMBER,
    error: VALUE_MISSING,
  };
  expect(buildFieldForAttribute(selectAttribute)).toEqual(expectedField);
});
test('it formats a radio field', () => {
  const selectAttribute = {
    id: 11,
    options: [
      {
        id: 3,
        option_name: 'Short',
        placing: 10,
        part_type_attribute: 11,
      },
      {
        id: 8,
        option_name: 'Extra Long',
        placing: 40,
        part_type_attribute: 11,
      },
    ],
    attribute_name: 'Valve Length',
    in_use: true,
    mandatory: false,
    placing: 10,
    attribute_type: '3',
    partType: 19,
  };
  const expectedField = {
    header: selectAttribute.attribute_name,
    required: selectAttribute.mandatory,
    fieldName: ATTRIBUTE_VALUE,
    type: RADIO,
    selectList: [{ value: 'Short' }, { value: 'Extra Long' }],
  };
  expect(buildFieldForAttribute(selectAttribute)).toEqual(expectedField);
});
test('it formats a mandatory radio field', () => {
  const selectAttribute = {
    id: 11,
    options: [
      {
        id: 3,
        option_name: 'Short',
        placing: 10,
        part_type_attribute: 11,
      },
      {
        id: 8,
        option_name: 'Extra Long',
        placing: 40,
        part_type_attribute: 11,
      },
    ],
    attribute_name: 'Valve Length',
    in_use: true,
    mandatory: true,
    placing: 10,
    attribute_type: '3',
    partType: 19,
  };
  const expectedField = {
    header: selectAttribute.attribute_name,
    required: selectAttribute.mandatory,
    fieldName: ATTRIBUTE_VALUE,
    type: RADIO,
    selectList: [{ value: 'Short' }, { value: 'Extra Long' }],
    error: SELECT_ONE_MISSING,
  };
  expect(buildFieldForAttribute(selectAttribute)).toEqual(expectedField);
});
test('it formats a select field', () => {
  const selectAttribute = {
    id: 11,
    options: [
      {
        id: 3,
        option_name: 'Short',
        placing: 10,
        part_type_attribute: 11,
      },
      {
        id: 4,
        option_name: 'Medium',
        placing: 20,
        part_type_attribute: 11,
      },
      {
        id: 5,
        option_name: 'Long',
        placing: 30,
        part_type_attribute: 11,
      },
      {
        id: 8,
        option_name: 'Extra Long',
        placing: 40,
        part_type_attribute: 11,
      },
    ],
    attribute_name: 'Valve Length',
    in_use: true,
    mandatory: false,
    placing: 10,
    attribute_type: '4',
    partType: 19,
  };
  const expectedField = {
    header: selectAttribute.attribute_name,
    required: selectAttribute.mandatory,
    fieldName: ATTRIBUTE_VALUE,
    type: SELECT_ONE,
    selectList: [
      { value: 'Short' },
      { value: 'Medium' },
      { value: 'Long' },
      { value: 'Extra Long' },
    ],
  };
  expect(buildFieldForAttribute(selectAttribute)).toEqual(expectedField);
});
test('it formats a mandatory select field', () => {
  const selectAttribute = {
    id: 11,
    options: [
      {
        id: 3,
        option_name: 'Short',
        placing: 10,
        part_type_attribute: 11,
      },
      {
        id: 4,
        option_name: 'Medium',
        placing: 20,
        part_type_attribute: 11,
      },
      {
        id: 5,
        option_name: 'Long',
        placing: 30,
        part_type_attribute: 11,
      },
      {
        id: 8,
        option_name: 'Extra Long',
        placing: 40,
        part_type_attribute: 11,
      },
    ],
    attribute_name: 'Valve Length',
    in_use: true,
    mandatory: true,
    placing: 10,
    attribute_type: '4',
    partType: 19,
  };
  const expectedField = {
    header: selectAttribute.attribute_name,
    required: selectAttribute.mandatory,
    fieldName: ATTRIBUTE_VALUE,
    type: SELECT_ONE,
    selectList: [
      { value: 'Short' },
      { value: 'Medium' },
      { value: 'Long' },
      { value: 'Extra Long' },
    ],
    error: SELECT_ONE_MISSING,
  };
  expect(buildFieldForAttribute(selectAttribute)).toEqual(expectedField);
});
