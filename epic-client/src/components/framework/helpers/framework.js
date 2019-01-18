import {findObjectWithKey, updateObject} from "../../../helpers/utils";
import {NEW_ELEMENT_ID} from "../../../helpers/constants";
import {PART_TYPE_NAME_MISSING} from "../../app/model/helpers/error";

export const NEW_PART_TYPE = {
    attributes: [],
    name: "",
    can_be_substituted: true,
    can_be_omitted: true,
    customer_visible: true,
};
export const NEW_ATTRIBUTE = {
    attribute_name: "",
    in_use: true,
    mandatory: false,
    attribute_type: 1,
};
export const getPartTypeName = (partTypeId, sections) => {
    if (! partTypeId) return undefined;
    let partTypeName = "Unknown";
    sections.some(section => {
        return section.partTypes.some(partType => {
            if (partType.id === partTypeId) {
                partTypeName = partType.name;
                return true;
            }
            return false;
        });
    });
    return partTypeName;
};

export const processPartTypeValueChanges = (partType, componentKey, fieldName, input) => {
    const updatedPartType = updateObject(partType);
    if (fieldName.startsWith('name')) updatedPartType.name = input;
    if (!updatedPartType.name) {
        updatedPartType.error = true;
        updatedPartType.error_detail = PART_TYPE_NAME_MISSING;
    } else {
        updatedPartType.error = false;
        updatedPartType.error_detail = "";
    }
    if (fieldName.startsWith('description')) updatedPartType.description = input;
    if (fieldName.startsWith('can_be_substituted')) updatedPartType.can_be_substituted = input;
    if (fieldName.startsWith('can_be_omitted')) updatedPartType.can_be_omitted = input;
    if (fieldName.startsWith('customer_visible')) updatedPartType.customer_visible = input;
    if (fieldName.startsWith('attributes')) updatedPartType.attributes = input;
    if (fieldName.startsWith('synonyms')) updatedPartType.synonyms = input;
    if (fieldName.startsWith('detail')) updatedPartType._detail = input;
    if (componentKey === NEW_ELEMENT_ID) updatedPartType.dummyKey = NEW_ELEMENT_ID;

    updatedPartType.changed = true;
    return updatedPartType;
};
export const doesFieldMatchPartType = (partType, fieldName) => {
    const fieldNameLower = fieldName.toLowerCase();
    if (partType.name.toLowerCase() === fieldNameLower) {
        return true;
    } else {
        return partType.synonyms.some(synonym => {
            return (synonym.name.toLowerCase() === fieldNameLower);
        });
    }
};
export const attributeSummary = (attribute) => {
    let attributeDetail = [attribute.attribute_name];
    if (attribute.in_use) attributeDetail.push(" in use");
    if (attribute.mandatory) attributeDetail.push(" must be entered");
    if (attribute.options && attribute.options.length > 0) {
        attributeDetail.push(` allowed options: ${attribute.options.map((option) => {
            return option.option_name;
        }).toString()}`);
    }
    return attributeDetail.toString();
};
export const moveObjectUpOnePlace = (arrayOfObjects, objectId) => {
    const objectToMove = findObjectWithKey(arrayOfObjects, objectId);
    const currentIndex = arrayOfObjects.indexOf(objectToMove);
    if (currentIndex > 0) {
        let finalArray = arrayOfObjects;
        finalArray.splice(currentIndex, 1);
        const newPosition = currentIndex - 1;
        finalArray.splice(newPosition, 0, objectToMove);
        return resetPlacing(finalArray);
    } else {
        return arrayOfObjects;
    }
};
export const moveObjectDownOnePlace = (arrayOfObjects, objectId) => {
    let finalArrayOfObjects = arrayOfObjects;
    const objectToMove = findObjectWithKey(finalArrayOfObjects, objectId);
    const currentIndex = arrayOfObjects.indexOf(objectToMove);
    if (objectToMove && (currentIndex < (arrayOfObjects.length - 1))) {
        finalArrayOfObjects.splice(currentIndex, 1);
        const newPosition = currentIndex + 1;
        finalArrayOfObjects.splice(newPosition, 0, objectToMove);
        return resetPlacing(finalArrayOfObjects);
    } else {
        return finalArrayOfObjects;
    }
};
export const moveObjectToTop = (arrayOfObjects, objectId) => {
    let finalArrayOfObjects = arrayOfObjects;
    const objectToMove = findObjectWithKey(finalArrayOfObjects, objectId);
    const currentIndex = arrayOfObjects.indexOf(objectToMove);
    if (currentIndex > 0) {
        finalArrayOfObjects.splice(currentIndex, 1);
        finalArrayOfObjects.unshift(objectToMove);
        return resetPlacing(finalArrayOfObjects);
    } else {
        return finalArrayOfObjects;
    }
};
export const moveObjectToBottom = (arrayOfObjects, objectId) => {
    let finalArrayOfObjects = arrayOfObjects;
    const objectToMove = findObjectWithKey(finalArrayOfObjects, objectId);
    const currentIndex = arrayOfObjects.indexOf(objectToMove);
    if (objectToMove && (currentIndex < (arrayOfObjects.length - 1))) {
        finalArrayOfObjects.splice(currentIndex, 1);
        finalArrayOfObjects.push(objectToMove);
        return resetPlacing(finalArrayOfObjects);
    } else {
        return finalArrayOfObjects;
    }
};
export const renumberAll = (sections) => {
    let sectionSequence = 10;
    return sections.map((section) => {
        section.placing = sectionSequence;
        sectionSequence = sectionSequence + 10;
        let partTypeSequence = 10;
        section.partTypes = section.partTypes ? section.partTypes.map((partType) => {
            partType.placing = partTypeSequence;
            partTypeSequence = partTypeSequence + 10;
            let attributeSequence = 10;
            partType.attributes = partType.attributes ? partType.attributes.map((attribute) => {
                attribute.placing = attributeSequence;
                attribute.options = attribute.options ? resetPlacing(attribute.options) : [];
                attributeSequence = attributeSequence + 10;
                return attribute;
            }) : [];
            return partType;
        }) : section.partTypes = [];

        return section;
    })
};

export const resetPlacing = (arrayOfPlacedObjects) => {
    let objectPlacing = 10;
    return arrayOfPlacedObjects.map((placedObject) => {
        placedObject.placing = objectPlacing;
        objectPlacing = objectPlacing + 10;
        return placedObject;
    })
};

