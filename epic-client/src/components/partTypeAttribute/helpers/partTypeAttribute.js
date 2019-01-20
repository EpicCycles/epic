import {ATTRIBUTE_VALUE, NUMBER, OPTION_NAME, RADIO, SELECT_ONE, TEXT} from "../../app/model/helpers/fields";
import {SELECT_ONE_MISSING, VALUE_MISSING} from "../../app/model/helpers/error";

const TYPE_TEXT = '1';
const TYPE_NUMBER = '2';
const TYPE_RADIO = '3';
const TYPE_SELECT = '4';
export const ATTRIBUTE_OPTION_TYPES = [
    { value: TYPE_TEXT, name: 'Text', isDefault: true },
    { value: TYPE_NUMBER, name: 'Numeric' },
    { value: TYPE_RADIO, name: 'Single - Radio' },
    { value: TYPE_SELECT, name: 'Single - Dropdown' },
];

export const buildFieldForAttribute = (attribute) => {
    let field = {
        header: attribute.attribute_name,
        required: attribute.mandatory,
        fieldName: ATTRIBUTE_VALUE,
    };
    switch (attribute.attribute_type) {
        case  TYPE_TEXT:
            field.type = TEXT;
            if (attribute.mandatory) field.error = VALUE_MISSING;
            break;
        case  TYPE_NUMBER:
            field.type = NUMBER;
            if (attribute.mandatory) field.error = VALUE_MISSING;
            break;
        case  TYPE_RADIO:
            field.type = RADIO;
            field.selectList = attribute.options.map(option => {
                return { value: option[OPTION_NAME] }
            });
            if (attribute.mandatory) field.error = SELECT_ONE_MISSING;
            break;
        case  TYPE_SELECT:
            field.type = SELECT_ONE;
            field.selectList = attribute.options.map(option => {
                return { value: option[OPTION_NAME] }
            });
            if (attribute.mandatory) field.error = SELECT_ONE_MISSING;
            break;
        default:
            field.type = TEXT;
            if (attribute.mandatory) field.error = VALUE_MISSING;
    }
    return field;
};
