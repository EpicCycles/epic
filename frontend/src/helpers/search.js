import {
  CHECKBOX,
  NUMBER,
  SELECT_MULTIPLE,
  SELECT_ONE,
  TEXT,
} from '../components/app/model/helpers/fields';

export const findMatchingObjects = (arrayOfObjects, searchFieldArray, searchCriteria) => {
  // first convert all search criteria to strings
  const fieldsToCheck = buildValueArray(searchFieldArray, searchCriteria);
  return arrayOfObjects.filter(o => doesObjectMatchCriteria(o, fieldsToCheck));
};
export const doesArrayContainMatches = (arrayOfObjects, searchFieldArray, searchCriteria) => {
  // first convert all search criteria to strings
  const fieldsToCheck = buildValueArray(searchFieldArray, searchCriteria);
  return arrayOfObjects.some(o => doesObjectMatchCriteria(o, fieldsToCheck));
};

export const buildValueArray = (searchFieldArray, searchCriteria) => {
  const fieldsWithValues = searchFieldArray.map(field => {
    const { fieldName, modelFieldName, type } = field;
    const searchFieldName = fieldName;
    if (searchCriteria[searchFieldName]) {
      let searchValue = searchCriteria[searchFieldName];
      switch (type) {
        case NUMBER:
        case SELECT_ONE:
          searchValue = searchValue.toString();
          break;
        case TEXT:
          searchValue = searchValue.toLowerCase();
          break;
        case SELECT_MULTIPLE:
          searchValue = searchValue.map(v => v.toString());
          break;
        default:
          break;
      }
      return { modelFieldName, type, searchValue };
    } else {
      return field;
    }
  });
  return fieldsWithValues.filter(f => f.searchValue);
};

export const doesObjectMatchCriteria = (model, fieldsToCheck) => {
  return fieldsToCheck.every(field => {
    const { modelFieldName, type, searchValue } = field;
    const modelValue = model[modelFieldName];
    switch (type) {
      case CHECKBOX:
        return searchValue === model[modelFieldName];
      case TEXT:
        return modelValue && modelValue.toLowerCase().includes(searchValue);
      case SELECT_MULTIPLE:
        return modelValue && searchValue.includes(modelValue.toString());
      default:
        return modelValue && searchValue === modelValue.toString();
    }
  });
};
