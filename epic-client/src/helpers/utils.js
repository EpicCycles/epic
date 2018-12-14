import {colourStyles} from "./constants";

export const checkForChanges = (fieldList, existingObject, newValues) => {
    return fieldList.some(field => {
        return existingObject[field.fieldName] !== newValues[field.fieldName];
    })
};
export const validateData = (fieldList, currentValues) => {
    let errors = {};
    fieldList.forEach(field => {
        if (field.required) {
            if (!currentValues[field.fieldName]) {
                errors[field.fieldName] = field.error;
            }
        }
    });
    return errors;
};
export const addFieldToState = (initialState, fieldList, fieldName, input) => {
    let finalState = initialState;
    fieldList.some(field => {
        if (fieldName.startsWith(field.fieldName)) {
            if (input) {
                finalState[field.fieldName] = input;
            } else {
                finalState = removeKey(finalState, field.fieldName);
            }
            return true;
        }
        return false;
    });
    return finalState;
};

export const removeKey = (obj, deleteKey) => {
  let clone = Object.assign({}, obj);
  delete clone[deleteKey];
  return clone;
};

export const getUpdatedObject = (fieldList, existingObject, newValues) => {
    let updatedObject = Object.assign({}, existingObject);
    fieldList.forEach(field => {
        updatedObject[field.fieldName] = newValues[field.fieldName];
    });
    return updatedObject;
};
export const validateEmailFormat = (email) => {
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailPattern.test(email);
};
export const validatePostcodeFormat = (postcode) => {
    const postcodePattern = /^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$/;
    return postcodePattern.test(postcode);
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
    if (Array.isArray(arrayOfObjects)) {
        // eslint-disable-next-line
        return arrayOfObjects.find(object => object.id == objectId);
    } else {
        return -1;
    }
};
export const findIndexOfObjectWithId = (arrayOfObjects, objectId) => {
    if (Array.isArray(arrayOfObjects)) {
        return arrayOfObjects.indexOf(findObjectWithId(arrayOfObjects, objectId));
    } else {
        return -1;
    }
};
export const buildColourAttributesForId = (elementId) => {
    if (isNaN(elementId)) {
        return {
            colour: "col-epic",
            background: "bg-white",
            border: "border-epic"
        };
    } else {
        const colourChoice = elementId % colourStyles.length;
        return {
            colour: colourStyles[colourChoice].colour,
            background: colourStyles[colourChoice].background,
            border: colourStyles[colourChoice].border
        };
    }
};

export const findObjectWithDummyKey = (arrayOfObjects, dummyKey) => {
    return arrayOfObjects.find(object => object.dummyKey === dummyKey);
};
export const findIndexOfObjectWithDummyKey = (arrayOfObjects, dummyKey) => {
    return arrayOfObjects.indexOf(findObjectWithDummyKey(arrayOfObjects, dummyKey));
};

export const generateRandomCode = () => {
    return Math.random().toString(36).replace('0.', '');
};

export const removeObjectWithIndex = (initialArray, removeIndex) => {
    if (removeIndex < 0) return initialArray;
    return initialArray.slice(0, removeIndex).concat(initialArray.slice((removeIndex + 1)));
};
