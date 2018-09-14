import {findIndexOfObjectWithId, findObjectWithId} from "./utils";

export const moveSectionUpOne = (sections, sectionId) => {
    return moveObjectUpOnePlace(sections, sectionId);
};
export const moveSectionDownOne = (sections, sectionId) => {
    return moveObjectDownOnePlace(sections, sectionId);
};
export const moveSectionToTop = (sections, sectionId) => {
    return moveObjectToTop(sections, sectionId);
};
export const moveSectionToBottom = (sections, sectionId) => {
    return moveObjectToBottom(sections, sectionId);
};
export const movePartTypeUpOne = (sections, sectionId, partTypeId) => {
    let finalSections = sections;
    const sectionConcernedIndex = findIndexOfObjectWithId(finalSections, sectionId);
    if ((sectionConcernedIndex > -1) && finalSections[sectionConcernedIndex].partTypes) {
        const fixedPartTypes = moveObjectUpOnePlace(finalSections[sectionConcernedIndex].partTypes, partTypeId);
        finalSections[sectionConcernedIndex].partTypes = fixedPartTypes;
    }
    return finalSections;
};
export const movePartTypeDownOne = (sections, sectionId, partTypeId) => {
    let finalSections = sections;
    const sectionConcernedIndex = findIndexOfObjectWithId(finalSections, sectionId);
    if ((sectionConcernedIndex > -1) && finalSections[sectionConcernedIndex].partTypes) {
        const fixedPartTypes = moveObjectDownOnePlace(finalSections[sectionConcernedIndex].partTypes, partTypeId);
        finalSections[sectionConcernedIndex].partTypes = fixedPartTypes;
    }
    return finalSections;
};
export const movePartTypeToTop = (sections, sectionId, partTypeId) => {
    let finalSections = sections;
    const sectionConcernedIndex = findIndexOfObjectWithId(finalSections, sectionId);
    if ((sectionConcernedIndex > -1) && finalSections[sectionConcernedIndex].partTypes) {
        const fixedPartTypes = moveObjectToTop(finalSections[sectionConcernedIndex].partTypes, partTypeId);
        finalSections[sectionConcernedIndex].partTypes = fixedPartTypes;
    }
    return finalSections;
};
export const movePartTypeToBottom = (sections, sectionId, partTypeId) => {
    let finalSections = sections;
    const sectionConcernedIndex = findIndexOfObjectWithId(finalSections, sectionId);
    if ((sectionConcernedIndex > -1) && finalSections[sectionConcernedIndex].partTypes) {
        const fixedPartTypes = moveObjectToBottom(finalSections[sectionConcernedIndex].partTypes, partTypeId);
        finalSections[sectionConcernedIndex].partTypes = fixedPartTypes;
    }
    return finalSections;
};
export const movePartTypeAttributeUpOne = (sections, sectionId, partTypeId, partTypeAttributeId) => {
    let finalSections = sections;
    const sectionConcernedIndex = findIndexOfObjectWithId(finalSections, sectionId);
    // TODO
    return finalSections;
};
export const movePartTypeAttributeDownOne = (sections, sectionId, partTypeId, partTypeAttributeId) => {
    let finalSections = sections;
    const sectionConcernedIndex = findIndexOfObjectWithId(finalSections, sectionId);
    // TODO
    return finalSections;
};
export const movePartTypeAttributeToTop = (sections, sectionId, partTypeId, partTypeAttributeId) => {
    let finalSections = sections;
    const sectionConcernedIndex = findIndexOfObjectWithId(finalSections, sectionId);
    // TODO
    return finalSections;
};
export const movePartTypeAttributeToBottom = (sections, sectionId, partTypeId, partTypeAttributeId) => {
    let finalSections = sections;
    const sectionConcernedIndex = findIndexOfObjectWithId(finalSections, sectionId);
    // TODO
    return finalSections;
};

export const moveObjectUpOnePlace = (arrayOfObjects, objectId) => {
    const objectToMove = findObjectWithId(arrayOfObjects, objectId);
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
    const objectToMove = findObjectWithId(finalArrayOfObjects, objectId);
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
    const objectToMove = findObjectWithId(finalArrayOfObjects, objectId);
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
    const objectToMove = findObjectWithId(finalArrayOfObjects, objectId);
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

