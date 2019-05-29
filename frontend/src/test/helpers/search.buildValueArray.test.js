import {
  CHECKBOX,
  NUMBER,
  SELECT_MULTIPLE,
  SELECT_ONE,
  TEXT,
} from '../../components/app/model/helpers/fields';
import { buildValueArray } from '../../helpers/search';

describe('buildValueArray', () => {
  const numberField = { fieldName: 'f_num', modelFieldName: 'm_num', type: NUMBER };
  const selectOneField = {
    fieldName: 'f_select',
    modelFieldName: 'm_select',
    type: SELECT_ONE,
  };
  const textField = {
    fieldName: 'fText',
    modelFieldName: 'mText',
    type: TEXT,
  };
  const selectMultipleField = {
    fieldName: 'fMultiple',
    modelFieldName: 'mMultiple',
    type: SELECT_MULTIPLE,
  };
  const otherField = {
    fieldName: 'fOther',
    modelFieldName: 'mOther',
    type: CHECKBOX,
  };
  it('should return a string for a NUMBER field', () => {
    const searchCriteria = { f_num: 23 };
    const expectedResult = [{ modelFieldName: 'm_num', type: NUMBER, searchValue: '23' }];
    expect(buildValueArray([numberField], searchCriteria)).toEqual(expectedResult);
  });
  it('should return a string for a SELECT_ONE field', () => {
    const searchCriteria = { f_select: 23 };
    const expectedResult = [{ modelFieldName: 'm_select', type: SELECT_ONE, searchValue: '23' }];
    expect(buildValueArray([selectOneField], searchCriteria)).toEqual(expectedResult);
  });
  it('should return the lower case version for a TEXT field', () => {
    const searchFields = [textField];
    const searchCriteria = { fText: 'Mostly Mixed case' };
    const expectedResult = [
      { modelFieldName: 'mText', type: TEXT, searchValue: 'mostly mixed case' },
    ];
    expect(buildValueArray(searchFields, searchCriteria)).toEqual(expectedResult);
  });
  it('should return the raw for any field that has no conversion', () => {
    const searchFields = [otherField];
    const searchCriteria = { fOther: true };
    const expectedResult = [{ modelFieldName: 'mOther', type: CHECKBOX, searchValue: true }];
    expect(buildValueArray(searchFields, searchCriteria)).toEqual(expectedResult);
  });
  it('should return an array of strings for a multiple select field', () => {
    const searchFields = [selectMultipleField];
    const searchCriteria = { fMultiple: [2, 3, '4'] };
    const expectedResult = [
      { modelFieldName: 'mMultiple', type: SELECT_MULTIPLE, searchValue: ['2', '3', '4'] },
    ];
    expect(buildValueArray(searchFields, searchCriteria)).toEqual(expectedResult);
  });

  it('should return only the values set', () => {
    const searchFields = [selectOneField, selectMultipleField, textField];
    const searchCriteria = { fMultiple: [2, 3, '4'] };
    const expectedResult = [
      { modelFieldName: 'mMultiple', type: SELECT_MULTIPLE, searchValue: ['2', '3', '4'] },
    ];
    expect(buildValueArray(searchFields, searchCriteria)).toEqual(expectedResult);
  });
});
