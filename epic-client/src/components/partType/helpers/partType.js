import {updateObject} from "../../../helpers/utils";
import {PART_TYPE_NAME_MISSING} from "../../app/model/helpers/error";
import {NEW_ELEMENT_ID} from "../../../helpers/constants";

export const getPartTypeName = (partTypeId, sections) => {
    if (!partTypeId) return undefined;
    const partType = getPartType(partTypeId, sections);
    if (partType) return partType.name;
    return 'Unknown Part Type';
};
export const getPartType = (partTypeToFind, sections) => {
    if (Number.isNaN(partTypeToFind)) return undefined;
    const partTypeId = Number(partTypeToFind);
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
export const attributePlaceholder = (partType) => {
    let placeholder = [];
    if (partType.attributes) partType.attributes.forEach(attribute => {
        if (attribute.in_use) {
            if (attribute.options && attribute.options.length > 0) {
                placeholder.push(`${attribute.attribute_name}(${attribute.options.map((option) => {
                    return option.option_name;
                }).toString()})`);
            } else {
                placeholder.push(attribute.attribute_name);
            }
        }
    });
    return placeholder.join(', ');
};