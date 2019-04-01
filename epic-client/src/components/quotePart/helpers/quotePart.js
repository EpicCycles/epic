import {getPartTypeAttributeFields} from "../../framework/helpers/partType";
import {doWeHaveObjects, updateObject} from "../../../helpers/utils";
import {buildFieldForAttribute} from "../../partTypeAttribute/helpers/partTypeAttribute";

export const completeQuotePart = (quotePart, sections) => {
    if (quotePart.part) {
        if (!quotePart.rrp) return false;
        if (!hasMandatoryAttributes(quotePart, sections)) return false;
    } else {
        if (!quotePart.replacement_part) return false; // must have a part if it isn't a replacement
    }
    if (quotePart.replacement_part && (!quotePart.trade_in_price)) return false;
    if ((!quotePart.replacement_part) && (quotePart.trade_in_price)) return false;

    return true;
};
export const hasMandatoryAttributes = (quotePart, sections) => {
    const attributes = getPartTypeAttributeFields(quotePart.partType, sections).filter(attribute => attribute.mandatory);
    if (attributes.length === 0) return true;
    return attributes.every(attribute => quotePart.quote_part_attributes.some(quotePartAttribute => ((quotePartAttribute.partTypeAttribute === attribute.id) && (quotePartAttribute.attribute_value))));
};

export const addAttributes = (quotePart, sections) => {
    let quote_part_attributes = [];
    if (doWeHaveObjects(quotePart.quote_part_attributes)) return quotePart;
    if (quotePart.part) {
        quote_part_attributes = getPartTypeAttributeFields(quotePart.partType, sections)
            .map(attribute => {
                return {
                    partTypeAttribute: attribute.id
                };
            });
    }
    return updateObject(quotePart, { quote_part_attributes })
};

export const getAttributeObjectsAndFields = (quotePart, sections) => {
    if (!quotePart.part) return [];

    return getPartTypeAttributeFields(quotePart.partType, sections)
        .map(attribute => {
            return {
                model: quotePart.quote_part_attributes.filter(qpa => qpa.partTypeAttribute === attribute.id)[0],
                field: buildFieldForAttribute(attribute)
            }
        });
};

