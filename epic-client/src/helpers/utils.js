import {colourStyles, NEW_ELEMENT_ID} from "./constants";

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
export const isItAnObject = (thing) => {
    return (thing && (Object.keys(thing).length > 0));
};
export const doWeHaveObjects = (possibleArray) => {
    return (possibleArray && possibleArray.length > 0);
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

export const updateObjectInArray = (initialArray, updatedObject, componentKey) => {
    const arrayWithUpdates = initialArray.slice();
    const objectToUpdateIndex = findIndexOfObjectWithKey(arrayWithUpdates, componentKey);
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
export const definedOrZero = (numericField) => (numericField || numericField === 0);