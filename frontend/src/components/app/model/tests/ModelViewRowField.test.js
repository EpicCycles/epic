import React from 'react';
import toJson from 'enzyme-to-json';
import { CURRENCY, DATE_TIME, TEXT } from '../helpers/fields';
import ModelViewRowField from '../ModelViewRowField';

describe('ModelViewRowField', () => {
  test('it should render when passed a field with data', () => {
    const field = {
      fieldName: 'data_field',
      type: DATE_TIME,
    };
    const model = { data_field: new Date(Date.UTC(2012, 11, 20, 3, 0, 0)) };
    expect(toJson(shallow(<ModelViewRowField field={field} model={model} />))).toMatchSnapshot();
  });
  test('it renders when passed a field that has no data', () => {
    const field = {
      fieldName: 'data_field',
      type: CURRENCY,
      length: 10,
    };
    expect(toJson(shallow(<ModelViewRowField field={field} />))).toMatchSnapshot();
  });
  test('it renders when passed a field that has multiple values', () => {
    const field = {
      fieldName: 'data_field',
      type: TEXT,
      length: 10,
    };
    const model = { data_field: ['one', 'two', 'three'] };
    expect(toJson(shallow(<ModelViewRowField field={field} />))).toMatchSnapshot();
  });
});
