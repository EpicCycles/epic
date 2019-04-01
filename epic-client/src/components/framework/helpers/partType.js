import {updateObject} from "../../../helpers/utils";
import {PART_TYPE_NAME_MISSING} from "../../app/model/helpers/error";
import {NEW_ELEMENT_ID} from "../../../helpers/constants";

export const getPartTypeName = (partTypeId, sections) => {
    if (!partTypeId) return undefined;
    const partType = getPartType(partTypeId, sections);
    if (partType) return partType.name;
    return 'Unknown Part Type';
};
export const getPartType = (partTypeId, sections) => {
    if (!partTypeId) return undefined;
    let partType;
    sections.some(section => {
        return section.partTypes.some(aPartType => {
            if (aPartType.id === partTypeId) {
                partType = aPartType;
                return true;
            }
            return false;
        });
    });
    return partType;
};
export const getPartTypeAttributeFields = (partTypeId, sections) => {
    const partType = getPartType(partTypeId, sections);
    if (partType) return partType.attributes;
    return [];
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