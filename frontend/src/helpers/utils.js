import { colourStyles } from './constants';
import { getModelKey } from '../components/app/model/helpers/model';

export const sortObjectsByAttribute = (initialArray, attributeName = 'id') => {
  return initialArray.sort((a, b) => {
    const compareA = a[attributeName];
    const compareB = b[attributeName];

    if (typeof compareA === 'string') return compareString(compareA, compareB);
    return compareA - compareB;
  });
};
export const compareString = (a, b) => {
  const nameA = a.toUpperCase(); // ignore upper and lowercase
  const nameB = b.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
};
export const addItemsToArray = (oldArray = [], listOfItems = []) => {
  let newArray = oldArray.slice();
  listOfItems.forEach(item => {
    let itemKey = getModelKey(item);
    let existingIndex = findIndexOfObjectWithKey(newArray, itemKey);
    if (existingIndex < 0) newArray.push(item);
    else newArray[existingIndex] = item;
  });
  return newArray;
};
export const addItemsToArrayAtStart = (oldArray = [], listOfItems = []) => {
  let newArray = oldArray.slice();
  listOfItems.forEach(item => {
    let itemKey = getModelKey(item);
    let existingIndex = findIndexOfObjectWithKey(newArray, itemKey);
    if (existingIndex < 0) newArray.splice(0, 0, item);
    else newArray[existingIndex] = item;
  });
  return newArray;
};
export const removeItemFromArray = (oldArray = [], idToRemove) => {
  let existingIndex = findIndexOfObjectWithKey(oldArray, idToRemove);
  if (existingIndex < 0) return oldArray;
  let newList = oldArray.slice();
  newList.splice(existingIndex, 1);
  return newList;
};
export const flattenArrayOfArrays = startArray => {
  let flatArray = [];
  startArray.forEach(element => {
    if (Array.isArray(element)) flatArray = flatArray.concat(element);
    else flatArray.push(element);
  });
  return flatArray;
};
export const changeList = (oldList, checkObject) => {
  let newList = oldList.slice();
  if (newList.includes(checkObject)) {
    const index = newList.indexOf(checkObject);
    if (index !== -1) newList.splice(index, 1);
  } else {
    newList.push(checkObject);
  }
  return newList;
};
export const isItAnObject = thing => {
  return thing && Object.keys(thing).length > 0;
};
export const doWeHaveObjects = possibleArray => {
  return Array.isArray(possibleArray) && possibleArray.length > 0;
};

export const removeKey = (obj, deleteKey) => {
  let clone = updateObject(obj);
  delete clone[deleteKey];
  return clone;
};

export const getUpdatedObject = (fieldList, existingObject, newValues) => {
  let updatedObject = updateObject(existingObject);
  fieldList.forEach(field => {
    updatedObject[field.fieldName] = newValues[field.fieldName];
  });
  return updatedObject;
};

export const addToUniqueArray = (arrayOfObjects, newObject) => {
  if (arrayOfObjects) {
    if (Array.isArray(arrayOfObjects)) {
      if (arrayOfObjects.includes(newObject)) return arrayOfObjects;
      let returnArray = arrayOfObjects.slice();
      returnArray.push(newObject);
      return returnArray;
    } else {
      return arrayOfObjects;
    }
  } else {
    return [newObject];
  }
};
export const findObjectWithKey = (arrayOfObjects, componentKey) => {
  const objectWithId = findObjectWithId(arrayOfObjects, componentKey);
  if (objectWithId) return objectWithId;
  return findObjectWithDummyKey(arrayOfObjects, componentKey);
};
export const findIndexOfObjectWithKey = (arrayOfObjects, componentKey) => {
  if (Array.isArray(arrayOfObjects)) {
    const indexOfObjectWithId = findIndexOfObjectWithId(arrayOfObjects, componentKey);
    if (indexOfObjectWithId < 0) return findIndexOfObjectWithDummyKey(arrayOfObjects, componentKey);
    return indexOfObjectWithId;
  } else {
    return -1;
  }
};
export const findObjectWithId = (arrayOfObjects, objectId) => {
  if (isNaN(objectId)) return;
  if (Array.isArray(arrayOfObjects)) {
    // eslint-disable-next-line
        return arrayOfObjects.find(object => object.id === Number.parseInt(objectId));
  } else {
    return;
  }
};
export const findIndexOfObjectWithId = (arrayOfObjects, objectId) => {
  if (Array.isArray(arrayOfObjects)) {
    return arrayOfObjects.findIndex(object => object.id === Number.parseInt(objectId));
  } else {
    return -1;
  }
};
export const buildColourAttributesForId = elementId => {
  if (isNaN(elementId)) {
    return {
      colour: 'col-epic',
      background: 'bg-white',
      border: 'border-epic',
    };
  } else {
    const colourChoice = elementId % colourStyles.length;
    return {
      colour: colourStyles[colourChoice].colour,
      background: colourStyles[colourChoice].background,
      border: colourStyles[colourChoice].border,
    };
  }
};

export const findObjectWithDummyKey = (arrayOfObjects, dummyKey) => {
  return arrayOfObjects.find(object => object.dummyKey === dummyKey);
};
export const findIndexOfObjectWithDummyKey = (arrayOfObjects, dummyKey) => {
  return arrayOfObjects.findIndex(object => object.dummyKey === dummyKey);
};

export function generateRandomCode() {
  return Math.random()
    .toString(36)
    .replace('0.', '');
}

export const removeObjectWithIndex = (initialArray, removeIndex) => {
  if (removeIndex < 0) return initialArray;
  return initialArray.slice(0, removeIndex).concat(initialArray.slice(removeIndex + 1));
};

export const updateObjectInArray = (initialArray, updatedObject, componentKey) => {
  const arrayWithUpdates = initialArray.slice();
  const checkKey = componentKey ? componentKey : getModelKey(updatedObject);
  const objectToUpdateIndex = findIndexOfObjectWithKey(arrayWithUpdates, checkKey);
  if (objectToUpdateIndex > -1) {
    arrayWithUpdates[objectToUpdateIndex] = updatedObject;
  } else {
    arrayWithUpdates.push(updatedObject);
  }
  return arrayWithUpdates;
};

export const updateObject = (initialObject = {}, fieldList1 = {}, fieldList2 = {}) => {
  return Object.assign({}, initialObject, fieldList1, fieldList2);
};
export const updateObjectWithApiErrors = (object, actionPayload) => {
  const { error, error_detail } = actionPayload;
  return updateObject(object, { error, error_detail });
};
export const definedOrZero = numericField => numericField || numericField === 0;

export const updateObjectWithSelectionChanges = (object, fieldName, value) => {
  let newObject = updateObject(object);
  newObject[fieldName] = value;
  return newObject;
};
export default {
  generateRandomCode,
};
