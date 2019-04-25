import {
    doWeHaveObjects,
    findObjectWithKey,
    generateRandomCode,
    isItAnObject,
    removeKey,
    updateObject,
    updateObjectInArray
} from "../../../../helpers/utils";
import {NEW_ELEMENT_ID} from "../../../../helpers/constants";

export const modelIsAlreadyInArray = (modelArray, modelToCheck, modelFields) => {
    if (!doWeHaveObjects(modelArray)) return false;
    return modelArray.some(modelInstance => !checkForChanges(modelFields, modelInstance, modelToCheck));
};

export const createEmptyModelWithDefaultFields = (fieldList) => {
    let emptyModel = { dummyKey: generateRandomCode() };
    fieldList.forEach(field => {
        if (field.selectList && Array.isArray(field.selectList)) {
            const defaultValue = field.selectList.filter(listitem => listitem.isDefault);
            if (defaultValue.length > 0) emptyModel[field.fieldName] = defaultValue[0].value;
        } else if (field.default) {
            emptyModel[field.fieldName] = field.default;
        }
    });
    return emptyModel;
};
export const eliminateReadOnlyFields = (fieldList) => {
    return fieldList.filter(field => (!field.readOnly));
};

export const justReadOnlyFields = (fieldList) => {
    return fieldList.filter(field => (field.readOnly));
};

export const checkForChanges = (fieldList, existingObject, newValues) => {
    return eliminateReadOnlyFields(fieldList).some(field => {
        if (existingObject[field.fieldName] || newValues[field.fieldName])
            return existingObject[field.fieldName] !== newValues[field.fieldName];
        return false;
    })
};

export const addFieldToState = (initialState, fieldList, fieldName, input) => {
    let finalState = initialState;
    let modelField = getField(fieldList, fieldName);
    if (modelField) finalState = applyFieldValueToModel(initialState, modelField, input);

    return finalState;
};


export const getModelKey = modelInstance => {
    if (!modelInstance) return NEW_ELEMENT_ID;
    if (modelInstance.id) return modelInstance.id;
    if (modelInstance.dummyKey) return modelInstance.dummyKey;
    return NEW_ELEMENT_ID;
};

export const isModelValid = (modelInstance) => {
    return !(modelInstance.error || isItAnObject(modelInstance.error_detail));
};

export const applyFieldValueToModel = (modelInstance, field, value) => {
    let updatedModelInstance = updateObject(modelInstance);
    updatedModelInstance[field.fieldName] = value;
    updatedModelInstance.changed = true;
    if (!updatedModelInstance.error_detail) updatedModelInstance.error_detail = {};
    if (field.required && !value) {
        updatedModelInstance.error_detail[field.fieldName] = field.error;
        return updatedModelInstance;
    } else if (field.validator) {
        const error = field.validator(value, modelInstance);
        if (error) {
            updatedModelInstance.error_detail[field.fieldName] = error;
            return updatedModelInstance;
        }
    }
    updatedModelInstance.error_detail = removeKey(updatedModelInstance.error_detail, field.fieldName);
    return updatedModelInstance;
};
export const applyFieldValueToModelOnly = (modelInstance, field, value) => {
    let updatedModelInstance = updateObject(modelInstance);
    updatedModelInstance[field.fieldName] = value;
    updatedModelInstance.changed = true;
    return updatedModelInstance;
};

export const validateModelAndSetErrors = (modelInstance, modelFields) => {
    let error_detail = {};
    modelFields.forEach(field => {
        if (field.required && !modelInstance[field.fieldName]) {
            error_detail[field.fieldName] = field.error;
        } else if (field.validator) {
            const error = field.validator(modelInstance[field.fieldName], modelInstance);
            if (error) {
                error_detail[field.fieldName] = error;
            }
        }
    });
    return error_detail;
};

export const getAttribute = (modelFields, fieldName) => {
    let attribute;
    const modelFieldsSorted = modelFields.slice().sort((a, b) => b.fieldName.length - a.fieldName.length);
    modelFieldsSorted.some(field => {
        if (fieldName.startsWith(field.fieldName)) {
            attribute = field.fieldName;
            return true;
        }
        return false;
    });
    return attribute;
};

export const getField = (modelFields, fieldName) => {
    let modelField;
    const modelFieldsSorted = modelFields.slice().sort((a, b) => b.fieldName.length - a.fieldName.length);
    modelFieldsSorted.some(field => {
        if (fieldName.startsWith(field.fieldName)) {
            modelField = field;
            return true;
        }
        return false;
    });
    return modelField;
};

export const updateModelChanges = (modelInstance, attribute, fieldValue) => {
    let changes = updateObject(modelInstance.changes);
    if (fieldValue && (modelInstance[attribute] !== fieldValue)) {
        changes[attribute] = fieldValue;
    } else {
        changes = removeKey(changes, attribute);
    }
    return updateObject(modelInstance, { changes })
};
export const updateModelWithChanges = (modelInstance, modelFields, fieldName, fieldValue) => {
    const attribute = getAttribute(modelFields, fieldName);
    if (attribute) {
        return updateModelChanges(modelInstance, attribute, fieldValue)
    } else {
        console.error("attribute not found for", modelFields, fieldName)
    }
    return modelInstance;
};
export const updateModelArrayWithChanges = (modelArray, modelFields, fieldName, fieldValue, componentKey) => {
    const attribute = getAttribute(modelFields, fieldName);
    if (attribute) {
        let modelInstance = findObjectWithKey(modelArray, componentKey);
        let currentChanges = modelInstance.changes || {};
        if (fieldValue && (modelInstance[attribute] !== fieldValue)) {
            currentChanges[attribute] = fieldValue;
        } else {
            currentChanges = removeKey(currentChanges, attribute);
        }
        modelInstance.changes = currentChanges;
        return updateObjectInArray(modelArray, modelInstance, componentKey)
    } else {
        console.error("attribute not found for", modelFields, fieldName)
    }
    return modelArray;
};
export const updateModel = (model, modelFields, fieldName, fieldValue) => {
    const modelField = getField(modelFields, fieldName);
    if (modelField) {
        const updatedModel = applyFieldValueToModelOnly(model, modelField, fieldValue);
        updatedModel.error_detail = validateModelAndSetErrors(updatedModel, modelFields);
        return removeKey(updatedModel, 'error');
    }
    ;
    return model;
};

export const displayModelErrorSummary = (model, modelFields) => {
    let displayErrors = model.error;
    const fieldErrors = isItAnObject(model.error_detail) ? model.error_detail : {};
    for (var property in fieldErrors) {
        const field = getField(modelFields, property);
        if (!displayErrors) {
            displayErrors = "";
        } else {
            displayErrors += '<br>';
        }
        displayErrors += field.header + ": " + fieldErrors[property].join(" ");
    }

    return displayErrors;
};

export const getNameForValue = (value, sourceArray) => {
    if (!value) return undefined;
    let name = value;

    sourceArray.some(pair => {
        if (pair.value === value) {
            name = pair.name;
            return true;
        }
        return false;
    });
    return name;
};

export const hasErrors = (model) => {
    if (model.error && model.error.length > 0) return true;
    if (isItAnObject(model.error_detail)) return true;
    return false;
};

export const addErrorDetail = (error_detail = {}, field, error) => {
    let updated_error_detail = updateObject(error_detail);
    if (!Array.isArray(updated_error_detail[field])) {
        updated_error_detail[field] = [];
    }
    updated_error_detail[field].push(error);
    return updated_error_detail;
};

export const createNewModelInstance = () => {
    return { dummyKey: generateRandomCode() };
};
export const matchesModel = (persistedModel, modelFields, modelToCheck) => {
    return !checkForChanges(modelFields, persistedModel, modelToCheck);
};