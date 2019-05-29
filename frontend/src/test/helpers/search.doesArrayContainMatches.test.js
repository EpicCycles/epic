import {
  CHECKBOX,
  SELECT_MULTIPLE,
} from '../../components/app/model/helpers/fields';
import { doesArrayContainMatches } from '../../helpers/search';

describe('doesArrayContainMatches', () => {
  const selectMultipleField = {
    fieldName: 'fMultiple',
    modelFieldName: 'mMultiple',
    type: SELECT_MULTIPLE,
  };
  const booleanField = {
    fieldName: 'fBool',
    modelFieldName: 'mBool',
    type: CHECKBOX,
  };
  it('should return true when a single object matches the criteria', () => {
    const models = [
      {
        mMultiple: 'anything',
        mText: 'any text',
        m_select: 'select any',
        mBool: true,
        m_num: 123,
      },
    ];
    const fieldsToCheck = [booleanField];
    const searchCriteria = { fBool: true };
    expect(doesArrayContainMatches(models, fieldsToCheck, searchCriteria)).toBeTruthy();
  });
  it('should return true when a single object in the array matches the criteria', () => {
    const models = [
      { mBool: false },
      {
        mMultiple: 'anything',
        mText: 'any text',
        m_select: 'select any',
        mBool: true,
        m_num: 123,
      },
      { m_num: 123 },
    ];
    const fieldsToCheck = [booleanField];
    const searchCriteria = { fBool: true };
    expect(doesArrayContainMatches(models, fieldsToCheck, searchCriteria)).toBeTruthy();
  });
  it('should return true when a many objects in the array match the criteria', () => {
    const models = [
      { mBool: false, mMultiple: '4' },
      {
        mMultiple: '2',
        mText: 'any text',
        m_select: 'select any',
        mBool: true,
        m_num: 123,
      },
      { m_num: 123 },
      { mMultiple: 2 },
    ];
    const fieldsToCheck = [booleanField, selectMultipleField];
    const searchCriteria = { fBool: true, fMultiple: ['2', 4] };
    expect(doesArrayContainMatches(models, fieldsToCheck, searchCriteria)).toBeTruthy();
  });
  it('should return false when a single object does not match the criteria', () => {
    const models = [
      {
        mMultiple: 'anything',
        mText: 'any text',
        m_select: 'select any',
        mBool: false,
        m_num: 123,
      },
    ];
    const fieldsToCheck = [booleanField];
    const searchCriteria = { fBool: true };
    expect(doesArrayContainMatches(models, fieldsToCheck, searchCriteria)).toBeFalsy();
  });
  it('should return false when a no object in the array matches the criteria', () => {
    const models = [
      { mBool: false },
      { m_num: 123 },
      {
        mMultiple: 'anything',
        mText: 'any text',
        m_select: 'select any',
        mBool: false,
        m_num: 123,
      },
    ];
    const fieldsToCheck = [booleanField];
    const searchCriteria = { fBool: true };
    expect(doesArrayContainMatches(models, fieldsToCheck, searchCriteria)).toBeFalsy();
  });
});
