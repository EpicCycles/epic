import {PART_TYPE_FIELD, QUANTITY_FIELD, QUOTE_PRICE_FIELD} from "../../app/model/helpers/fields";
import {attributePlaceholder} from "../../partType/helpers/partType";
import {
    ADDITIONAL_DATA_FIELD,
    ADDITIONAL_DATA_FIELD_DISABLED,
    NOT_REQUIRED_FIELD,
    NOT_REQUIRED_FIELD_DISABLED,
    PART_DESC_FIELD,
    PART_DESC_FIELD_DISABLED,
    PART_TYPE_FIELD_DISABLED,
    QUANTITY_FIELD_DISABLED,
    QUOTE_PRICE_FIELD_DISABLED
} from "./quotePartFields";
import {updateObject} from "../../../helpers/utils";

export const quotePartNew = [
    PART_TYPE_FIELD,
    NOT_REQUIRED_FIELD,
    updateObject(PART_DESC_FIELD, { listId: 'all-parts', }),
    QUANTITY_FIELD,
    QUOTE_PRICE_FIELD,
    ADDITIONAL_DATA_FIELD
];

export const buildModelFields = (partType, quotePart, bikePart) => {
    if (!partType) return quotePartNew;

    const fields = [];
    if (quotePart && quotePart.id) {
        fields.push(PART_TYPE_FIELD_DISABLED);
    } else {
        fields.push(PART_TYPE_FIELD);
    }

    let required = (bikePart && (partType.can_be_omitted || partType.can_be_substituted));
    let desc = true;
    let quantity = !!quotePart;
    let price = !!quotePart;
    let info = (quotePart && quotePart.part);

    if (bikePart && quotePart && quotePart.not_required) {
        desc = partType.can_be_substituted;
        quantity = false;
    }

    required ? fields.push(NOT_REQUIRED_FIELD) : fields.push(NOT_REQUIRED_FIELD_DISABLED);
    desc ? fields.push(updateObject(PART_DESC_FIELD, { listId: `parts-${partType.id}`, })) : fields.push(PART_DESC_FIELD_DISABLED);
    quantity ? fields.push(QUANTITY_FIELD) : fields.push(QUANTITY_FIELD_DISABLED);
    price ? fields.push(QUOTE_PRICE_FIELD) : fields.push(QUOTE_PRICE_FIELD_DISABLED);
    if (info) {
        const attributes = attributePlaceholder(partType);
        const additionalDataField = updateObject(ADDITIONAL_DATA_FIELD,
            { placeholder: attributes, title: attributes, });
        fields.push(additionalDataField);
    } else {
        fields.push(ADDITIONAL_DATA_FIELD_DISABLED);
    }

    return fields;
};
