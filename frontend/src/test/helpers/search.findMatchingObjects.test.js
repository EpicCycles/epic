import { CHECKBOX, SELECT_MULTIPLE } from '../../components/app/model/helpers/fields';
import { findMatchingObjects } from '../../helpers/search';

describe('findMatchingObjects', () => {
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
  it('should return a matching object when a single object matches the criteria', () => {
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
    const expectedResult = [
      {
        mMultiple: 'anything',
        mText: 'any text',
        m_select: 'select any',
        mBool: true,
        m_num: 123,
      },
    ];
    expect(findMatchingObjects(models, fieldsToCheck, searchCriteria)).toEqual(expectedResult);
  });
  it('should return the matching object when a single object in the array matches the criteria', () => {
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
    const expectedResult = [
      {
        mMultiple: 'anything',
        mText: 'any text',
        m_select: 'select any',
        mBool: true,
        m_num: 123,
      },
    ];
    expect(findMatchingObjects(models, fieldsToCheck, searchCriteria)).toEqual(expectedResult);
  });
  it('should return matching objects when a many objects in the array match the criteria', () => {
    const models = [
      { mBool: true, mMultiple: '4' },
      {
        mMultiple: '2',
        mText: 'any text',
        m_select: 'select any',
        mBool: true,
        m_num: 123,
      },
      { m_num: 123, mBool: true },
      { mMultiple: 2, mBool: true },
      { mMultiple: 21, mBool: true },
    ];
    const fieldsToCheck = [booleanField, selectMultipleField];
    const searchCriteria = { fBool: true, fMultiple: ['2', 4] };
    const expectedResult = [
      { mBool: true, mMultiple: '4' },
      {
        mMultiple: '2',
        mText: 'any text',
        m_select: 'select any',
        mBool: true,
        m_num: 123,
      },
      { mMultiple: 2, mBool: true },
    ];
    expect(findMatchingObjects(models, fieldsToCheck, searchCriteria)).toEqual(expectedResult);
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
    expect(findMatchingObjects(models, fieldsToCheck, searchCriteria)).toEqual([]);
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
    expect(findMatchingObjects(models, fieldsToCheck, searchCriteria)).toEqual([]);
  });
});
