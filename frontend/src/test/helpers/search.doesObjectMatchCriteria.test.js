import {
  CHECKBOX,
  NUMBER,
  SELECT_MULTIPLE,
  SELECT_ONE,
  TEXT,
} from '../../components/app/model/helpers/fields';
import { doesObjectMatchCriteria } from '../../helpers/search';

describe('doesObjectMatchCriteria', () => {
  const multipleValue = {
    modelFieldName: 'mMultiple',
    type: SELECT_MULTIPLE,
    searchValue: ['2', '3', '4'],
  };
  const stringValue = {
    modelFieldName: 'mText',
    type: TEXT,
    searchValue: 'mostly mixed case',
  };
  const booleanValue = { modelFieldName: 'mBool', type: CHECKBOX, searchValue: true };
  const selectValue = { modelFieldName: 'm_select', type: SELECT_ONE, searchValue: '23' };
  const numberValue = { modelFieldName: 'm_num', type: NUMBER, searchValue: '23' };
  it('should return true when a single checkbox field matches the model value', () => {
    const model = {
      mMultiple: 'anything',
      mText: 'any text',
      m_select: 'select any',
      mBool: true,
      m_num: 123,
    };
    const fieldsToCheck = [booleanValue];
    expect(doesObjectMatchCriteria(model, fieldsToCheck)).toBeTruthy();
  });
  it('should return false when a single checkbox field is not the same on the model value', () => {
    const model = {
      mMultiple: 'anything',
      mText: 'any text',
      m_select: 'select any',
      mBool: false,
      m_num: 123,
    };
    const fieldsToCheck = [booleanValue];
    expect(doesObjectMatchCriteria(model, fieldsToCheck)).toBeFalsy();
  });
  it('should return false when a single checkbox field is not  on the model value', () => {
    const model = {
      mMultiple: 'anything',
      mText: 'any text',
      m_select: 'select any',
      m_num: 123,
    };
    const fieldsToCheck = [booleanValue];
    expect(doesObjectMatchCriteria(model, fieldsToCheck)).toBeFalsy();
  });
  it('should return true when a number matches the field on the model', () => {
    const model = {
      mMultiple: 'anything',
      mText: 'any text',
      m_select: 'select any',
      m_num: 23,
    };
    const fieldsToCheck = [numberValue];
    expect(doesObjectMatchCriteria(model, fieldsToCheck)).toBeTruthy();
  });
  it('should return false when a number does not match the field on the model', () => {
    const model = {
      mMultiple: 'anything',
      mText: 'any text',
      m_select: 'select any',
      m_num: 123,
    };
    const fieldsToCheck = [numberValue];
    expect(doesObjectMatchCriteria(model, fieldsToCheck)).toBeFalsy();
  });
  it('should return false when the field on the model has no value', () => {
    const model = {
      mMultiple: 'anything',
      mText: 'any text',
      m_select: 'select any',
    };
    const fieldsToCheck = [numberValue];
    expect(doesObjectMatchCriteria(model, fieldsToCheck)).toBeFalsy();
  });
  it('should return true when a selected matches the field on the model', () => {
    const model = {
      mMultiple: 'anything',
      mText: 'any text',
      m_select: 23,
      m_num: 123,
    };
    const fieldsToCheck = [selectValue];
    expect(doesObjectMatchCriteria(model, fieldsToCheck)).toBeTruthy();
  });
  it('should return false when a selected value does not match the field on the model', () => {
    const model = {
      mMultiple: 'anything',
      mText: 'any text',
      m_select: 'select any',
      m_num: 123,
    };
    const fieldsToCheck = [selectValue];
    expect(doesObjectMatchCriteria(model, fieldsToCheck)).toBeFalsy();
  });
  it('should return false when the field on the model has no value', () => {
    const model = {
      mMultiple: 'anything',
      mText: 'any text',
    };
    const fieldsToCheck = [selectValue];
    expect(doesObjectMatchCriteria(model, fieldsToCheck)).toBeFalsy();
  });
  it('should return true when one of the selected values matches the field on the model', () => {
    const model = {
      mMultiple: 3,
      mText: 'any text',
      m_select: 'select any',
      m_num: 23,
    };
    const fieldsToCheck = [multipleValue];
    expect(doesObjectMatchCriteria(model, fieldsToCheck)).toBeTruthy();
  });
  it('should return false when none of the selected values does not match the field on the model', () => {
    const model = {
      mMultiple: '6',
      mText: 'any text',
      m_select: 'select any',
      m_num: 123,
    };
    const fieldsToCheck = [multipleValue];
    expect(doesObjectMatchCriteria(model, fieldsToCheck)).toBeFalsy();
  });
  it('should return false when the field on the model has no value', () => {
    const model = {
      mText: 'any text',
      m_select: 'select any',
    };
    const fieldsToCheck = [multipleValue];
    expect(doesObjectMatchCriteria(model, fieldsToCheck)).toBeFalsy();
  });
  it('should return true when the string is contained in the value the model', () => {
    const model = {
      mMultiple: 3,
      mText: 'any textmostly mixed Case',
      m_select: 'select any',
      m_num: 23,
    };
    const fieldsToCheck = [stringValue];
    expect(doesObjectMatchCriteria(model, fieldsToCheck)).toBeTruthy();
  });
  it('should return false when the exact string is not in the field on the model', () => {
    const model = {
      mMultiple: '6',
      mText: 'mostly mixed any text case',
      m_select: 'select any',
      m_num: 123,
    };
    const fieldsToCheck = [stringValue];
    expect(doesObjectMatchCriteria(model, fieldsToCheck)).toBeFalsy();
  });
  it('should return false when the field on the model has no value', () => {
    const model = {
      m_select: 'select any',
    };
    const fieldsToCheck = [stringValue];
    expect(doesObjectMatchCriteria(model, fieldsToCheck)).toBeFalsy();
  });
  it('should return true when all conditions are matched', () => {
    const model = {
      mMultiple: 3,
      mText: 'any MOSTLY mixed case text',
      mBool: true,
      m_select: '23',
      m_num: 23,
    };
    const fieldsToCheck = [stringValue, multipleValue, selectValue, numberValue, booleanValue];
    expect(doesObjectMatchCriteria(model, fieldsToCheck)).toBeTruthy();
  });
  it('should return false when any condition is not matched', () => {
    const model = {
      mMultiple: 31,
      mText: 'any MOSTLY mixed case text',
      mBool: true,
      m_select: '23',
      m_num: 23,
    };
    const fieldsToCheck = [stringValue, multipleValue, selectValue, numberValue, booleanValue];
    expect(doesObjectMatchCriteria(model, fieldsToCheck)).toBeFalsy();
  });
});
