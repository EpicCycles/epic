import {BRAND_FIELD, DESCRIPTION_FIELD, FRAME_NAME_FIELD, SELL_PRICE_FIELD} from "../../helpers/models";
import {addFieldToState} from "../../helpers/utils";

const fieldListForTest = [BRAND_FIELD, SELL_PRICE_FIELD, DESCRIPTION_FIELD, FRAME_NAME_FIELD];
test("field not in field list not added to state", () => {
    const initialState = {
        id: 12,
        someFlag: false,
    };
    initialState[BRAND_FIELD.fieldName] = "12";
    const finalState = Object.assign({}, initialState);
    expect(addFieldToState(initialState, fieldListForTest, "field_i_dont_need", '99')).toEqual(finalState);
});
test("field in field list updated in state", () => {
    const initialState = {
        id: 12,
        someFlag: false,
    };
    initialState[BRAND_FIELD.fieldName] = "12";
    const finalState = Object.assign({}, initialState);
    finalState[BRAND_FIELD.fieldName] = "99";
    expect(addFieldToState(initialState, fieldListForTest, BRAND_FIELD.fieldName, '99')).toEqual(finalState);
});
test("field in field list added to state", () => {
    const initialState = {
        id: 12,
        someFlag: false,
    };
    const finalState = Object.assign({}, initialState);
    finalState[BRAND_FIELD.fieldName] = "99";
    const fieldName = BRAND_FIELD.fieldName + '_find_me';
    expect(addFieldToState(initialState, fieldListForTest, fieldName, '99')).toEqual(finalState);
});
test("field in field list changed in returned state", () => {
    const initialState = {
        id: 12,
        someFlag: false,
    };
    initialState[BRAND_FIELD.fieldName] = "12";
    const finalState = Object.assign({}, initialState);
    finalState[BRAND_FIELD.fieldName] = "99";
    const fieldName = BRAND_FIELD.fieldName + '_find_me';
    expect(addFieldToState(initialState, fieldListForTest, fieldName, '99')).toEqual(finalState);
});