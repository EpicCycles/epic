import {findObjectWithId} from "./utils";
export const NEW_FRAMEWORK_ID = "new";

export const attributeSummary = (attribute) => {
    // var a2 = a1.map(function(item) { return item.toUpperCase(); });  array1.toString()
    let attributeDetail = [attribute.attribute_name];
    if (attribute.in_use) attributeDetail.push(" in use");
    if (attribute.mandatory) attributeDetail.push(" must be entered");
    if (attribute.options && attribute.options.length > 0) {
        attributeDetail.push(` allowed options: ${attribute.options.map((option) => {
            return option.attribute_option;
        }).toString()}`);
    }
    return attributeDetail.toString();

    /*
     "id": 4,
                        "options": [
                            {
                                "id": 2,
                                "attribute_option": "Band",
                                "part_type_attribute": 4
                            },
                            {
                                "id": 1,
                                "attribute_option": "Braze",
                                "part_type_attribute": 4
                            }
                        ],
                        "attribute_name": "Braze/Band",
                        "in_use": true,
                        "mandatory": true,
                        "placing": 1,
                        "attribute_type": "3",
                        "partType": 9
     */
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

