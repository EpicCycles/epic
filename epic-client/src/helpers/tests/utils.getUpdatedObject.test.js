import {BRAND_FIELD, DESCRIPTION_FIELD, FRAME_NAME_FIELD, SELL_PRICE_FIELD} from "../../components/app/model/helpers/fields";
import {addFieldToState, getUpdatedObject} from "../utils";

const fieldListForTest = [BRAND_FIELD, SELL_PRICE_FIELD, DESCRIPTION_FIELD, FRAME_NAME_FIELD];
test("field not in field list not added to object", () => {
    const initialObject = {
        id: 12,
        someFlag: false,
    };
    initialObject[BRAND_FIELD.fieldName] = "12";
    const newValues = { field_i_dont_need: '99' };
    const finalObject = Object.assign({}, initialObject);
    finalObject[BRAND_FIELD.fieldName] = newValues[BRAND_FIELD.fieldName];
    finalObject[SELL_PRICE_FIELD.fieldName] = newValues[SELL_PRICE_FIELD.fieldName];
    finalObject[DESCRIPTION_FIELD.fieldName] = newValues[DESCRIPTION_FIELD.fieldName];
    finalObject[FRAME_NAME_FIELD.fieldName] = newValues[FRAME_NAME_FIELD.fieldName];
    expect(getUpdatedObject(fieldListForTest, initialObject, newValues)).toEqual(finalObject);
});
test("field in field list updated on to object", () => {
    const initialObject = {
        id: 12,
        someFlag: false,
    };
    initialObject[BRAND_FIELD.fieldName] = "12";
    const newValues = { field_i_dont_need: '99' };
    newValues[BRAND_FIELD.fieldName] = "16";
    const finalObject = Object.assign({}, initialObject);
    finalObject[BRAND_FIELD.fieldName] = "16";
    finalObject[SELL_PRICE_FIELD.fieldName] = newValues[SELL_PRICE_FIELD.fieldName];
    finalObject[DESCRIPTION_FIELD.fieldName] = newValues[DESCRIPTION_FIELD.fieldName];
    finalObject[FRAME_NAME_FIELD.fieldName] = newValues[FRAME_NAME_FIELD.fieldName];
    expect(getUpdatedObject(fieldListForTest, initialObject, newValues)).toEqual(finalObject);
});
test("field in field list added to object", () => {
    const initialObject = {
        id: 12,
        someFlag: false,
    };
    const newValues = { field_i_dont_need: '99' };
    newValues[BRAND_FIELD.fieldName] = "16";
    const finalObject = Object.assign({}, initialObject);
    finalObject[BRAND_FIELD.fieldName] = newValues[BRAND_FIELD.fieldName];
    finalObject[SELL_PRICE_FIELD.fieldName] = newValues[SELL_PRICE_FIELD.fieldName];
    finalObject[DESCRIPTION_FIELD.fieldName] = newValues[DESCRIPTION_FIELD.fieldName];
    finalObject[FRAME_NAME_FIELD.fieldName] = newValues[FRAME_NAME_FIELD.fieldName];
    expect(getUpdatedObject(fieldListForTest, initialObject, newValues)).toEqual(finalObject);
});
test("all fields added to final object", () => {
    const initialObject = {};
    const newValues = { field_i_dont_need: '99' };
    newValues[BRAND_FIELD.fieldName] = "16";
    newValues[SELL_PRICE_FIELD.fieldName] = "27.89";
    newValues[DESCRIPTION_FIELD.fieldName] = "new description";
    newValues[FRAME_NAME_FIELD.fieldName] = "frame big";
    const finalObject = Object.assign({}, initialObject);
    finalObject[BRAND_FIELD.fieldName] = newValues[BRAND_FIELD.fieldName];
    finalObject[SELL_PRICE_FIELD.fieldName] = newValues[SELL_PRICE_FIELD.fieldName];
    finalObject[DESCRIPTION_FIELD.fieldName] = newValues[DESCRIPTION_FIELD.fieldName];
    finalObject[FRAME_NAME_FIELD.fieldName] = newValues[FRAME_NAME_FIELD.fieldName];
    expect(getUpdatedObject(fieldListForTest, initialObject, newValues)).toEqual(finalObject);
});
test("missing fields removed from final object", () => {
    const initialObject = {};
    initialObject[BRAND_FIELD.fieldName] = "16";
    initialObject[SELL_PRICE_FIELD.fieldName] = "27.89";
    initialObject[DESCRIPTION_FIELD.fieldName] = "new description";
    initialObject[FRAME_NAME_FIELD.fieldName] = "frame big";
    const newValues = { field_i_dont_need: '99' };

    const finalObject = Object.assign({}, initialObject);
    finalObject[BRAND_FIELD.fieldName] = newValues[BRAND_FIELD.fieldName];
    finalObject[SELL_PRICE_FIELD.fieldName] = newValues[SELL_PRICE_FIELD.fieldName];
    finalObject[DESCRIPTION_FIELD.fieldName] = newValues[DESCRIPTION_FIELD.fieldName];
    finalObject[FRAME_NAME_FIELD.fieldName] = newValues[FRAME_NAME_FIELD.fieldName];
    expect(getUpdatedObject(fieldListForTest, initialObject, newValues)).toEqual(finalObject);
});