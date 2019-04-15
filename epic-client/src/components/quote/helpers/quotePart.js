import {
    PART_TYPE_FIELD,
    QUANTITY_FIELD,
    SUPPLIER_FIELD_OPTIONAL,
    TRADE_IN_PRICE_FIELD
} from "../../app/model/helpers/fields";
import {attributePlaceholder} from "../../partType/helpers/partType";
import {updateObject} from "../../../helpers/utils";
import {
    ADDITIONAL_DATA_FIELD,
    ADDITIONAL_DATA_FIELD_DISABLED,
    NOT_REQUIRED_FIELD,
    NOT_REQUIRED_FIELD_DISABLED,
    PART_DESC_FIELD,
    PART_DESC_FIELD_DISABLED,
    PART_PRICE_FIELD,
    PART_PRICE_FIELD_DISABLED,
    PART_TYPE_FIELD_DISABLED,
    QUANTITY_FIELD_DISABLED,
    SUPPLIER_FIELD_DISABLED,
    TRADE_IN_PRICE_FIELD_DISABLED
} from "./quotePartFields";
import {createEmptyModelWithDefaultFields} from "../../app/model/helpers/model";

export const quotePartNew = [
    PART_TYPE_FIELD,
    NOT_REQUIRED_FIELD,
    TRADE_IN_PRICE_FIELD_DISABLED,
    updateObject(PART_DESC_FIELD, { listId: 'all-parts', }),
    QUANTITY_FIELD,
    PART_PRICE_FIELD,
    ADDITIONAL_DATA_FIELD
];

export const buildModelFields = (partType, quotePart, bikePart) => {
    const fields = [];
    if (quotePart && quotePart.id) {
        fields.push(PART_TYPE_FIELD_DISABLED);
    } else {
        fields.push(PART_TYPE_FIELD);
    }

    let required = (bikePart && partType && (partType.can_be_omitted || partType.can_be_substituted));
    let desc = (!!partType);
    let part = (quotePart && quotePart.part);

    if (bikePart && partType && quotePart && quotePart.not_required) {
        desc = partType.can_be_substituted;
    }

    required ? fields.push(NOT_REQUIRED_FIELD) : fields.push(NOT_REQUIRED_FIELD_DISABLED);
    required && (quotePart && quotePart.not_required) ? fields.push(TRADE_IN_PRICE_FIELD) : fields.push(TRADE_IN_PRICE_FIELD_DISABLED);
    desc ? fields.push(updateObject(PART_DESC_FIELD, { listId: `parts-${partType.id}`, })) : fields.push(PART_DESC_FIELD_DISABLED);
    if (part) {
        const attributes = attributePlaceholder(partType);
        const additionalDataField = updateObject(ADDITIONAL_DATA_FIELD,
            { placeholder: attributes, title: attributes, });
        fields.push(QUANTITY_FIELD);
        fields.push(PART_PRICE_FIELD);
        fields.push(SUPPLIER_FIELD_OPTIONAL);
        fields.push(additionalDataField);
    } else {
        fields.push(QUANTITY_FIELD_DISABLED);
        fields.push(PART_PRICE_FIELD_DISABLED);
        fields.push(SUPPLIER_FIELD_DISABLED);
        fields.push(ADDITIONAL_DATA_FIELD_DISABLED);
    }

    return fields;
};

export const buildQuotePart = (quoteId, partTypeId) => {
    let quotePart = createEmptyModelWithDefaultFields([]);
    quotePart.quote = quoteId;
    quotePart.partType = partTypeId;
    return quotePart;
};