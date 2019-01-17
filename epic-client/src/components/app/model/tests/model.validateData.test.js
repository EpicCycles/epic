import {BRAND_FIELD, DESCRIPTION_FIELD, FRAME_NAME_FIELD, SELL_PRICE_FIELD} from "../helpers/fields";
import {validateData} from "../helpers/validators";

const fieldListForTest = [BRAND_FIELD, SELL_PRICE_FIELD, DESCRIPTION_FIELD, FRAME_NAME_FIELD];

test("all required fields plus other fields returns no errors", () => {
    let testValues = {};
    testValues[BRAND_FIELD.fieldName] = "1";
    testValues[SELL_PRICE_FIELD.fieldName] = "26.99";
    testValues[DESCRIPTION_FIELD.fieldName] = "my description";
    testValues[FRAME_NAME_FIELD.fieldName] = "A frame name";
    expect(validateData(fieldListForTest, testValues)).toEqual({});
});
test("all required fields plus no other fields returns no errors", () => {
    let testValues = {};
    testValues[BRAND_FIELD.fieldName] = "1";
    testValues[FRAME_NAME_FIELD.fieldName] = "A frame name";
    expect(validateData(fieldListForTest, testValues)).toEqual({});
});
test("single required fields missing returns error for that field", () => {
    let testValues = {};
    let expectedErrors = {};
    testValues[BRAND_FIELD.fieldName] = "1";
    testValues[SELL_PRICE_FIELD.fieldName] = "26.99";
    testValues[DESCRIPTION_FIELD.fieldName] = "my description";
    expectedErrors[FRAME_NAME_FIELD.fieldName] = FRAME_NAME_FIELD.error;
    expect(validateData(fieldListForTest, testValues)).toEqual(expectedErrors);
});
test("single required fields empty returns error for that field", () => {
    let testValues = {};
    let expectedErrors = {};
    testValues[BRAND_FIELD.fieldName] = "1";
    testValues[SELL_PRICE_FIELD.fieldName] = "26.99";
    testValues[DESCRIPTION_FIELD.fieldName] = "my description";
    testValues[FRAME_NAME_FIELD.fieldName] = "";
    expectedErrors[FRAME_NAME_FIELD.fieldName] = FRAME_NAME_FIELD.error;
    expect(validateData(fieldListForTest, testValues)).toEqual(expectedErrors);
});
test("multiple required fields missingor empty returns error for that field", () => {
    let testValues = {};
    let expectedErrors = {};
    testValues[BRAND_FIELD.fieldName] = "";
    testValues[SELL_PRICE_FIELD.fieldName] = "26.99";
    testValues[DESCRIPTION_FIELD.fieldName] = "my description";
    expectedErrors[FRAME_NAME_FIELD.fieldName] = FRAME_NAME_FIELD.error;
    expectedErrors[BRAND_FIELD.fieldName] = BRAND_FIELD.error;
    expect(validateData(fieldListForTest, testValues)).toEqual(expectedErrors);
});
test("no required fields present returns empty errors", () => {
    expect(validateData([SELL_PRICE_FIELD, DESCRIPTION_FIELD], {})).toEqual({});
});
