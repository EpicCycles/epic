import {BRAND_FIELD, DESCRIPTION_FIELD, FRAME_NAME_FIELD, SELL_PRICE_FIELD} from "../fields";
import {checkForChanges} from "../model";

const fieldListForTest = [BRAND_FIELD, SELL_PRICE_FIELD, DESCRIPTION_FIELD, FRAME_NAME_FIELD];
describe('model.checkForChanges', () => {

    it("no field values returns false", () => {
        const existingObject = {};
        const newValues = {};
        expect(checkForChanges(fieldListForTest, existingObject, newValues)).toBeFalsy();
    });
    it("no field changes returns false", () => {
        const existingObject = {};
        const newValues = {};
        existingObject[BRAND_FIELD.fieldName] = "Brand 1;";
        newValues[BRAND_FIELD.fieldName] = "Brand 1;";
        expect(checkForChanges(fieldListForTest, existingObject, newValues)).toBeFalsy();
    });
    it("a single field change returns true", () => {
        const existingObject = {};
        const newValues = {};
        existingObject[BRAND_FIELD.fieldName] = "Brand 1;";
        existingObject[SELL_PRICE_FIELD.fieldName] = "27.99";
        newValues[BRAND_FIELD.fieldName] = "Brand 1;";
        newValues[SELL_PRICE_FIELD.fieldName] = "26.99";
        expect(checkForChanges(fieldListForTest, existingObject, newValues)).toBeTruthy();
    });
    it("a single field not present on the original object returns true", () => {
        const existingObject = {};
        const newValues = {};
        existingObject[BRAND_FIELD.fieldName] = "Brand 1;";
        existingObject[SELL_PRICE_FIELD.fieldName] = "27.99";
        newValues[BRAND_FIELD.fieldName] = "Brand 1;";
        newValues[SELL_PRICE_FIELD.fieldName] = "27.99";
        newValues[DESCRIPTION_FIELD.fieldName] = "Added description";
        expect(checkForChanges(fieldListForTest, existingObject, newValues)).toBeTruthy();
    });
    it("field changes for field not in field list don't affect the result", () => {
        const existingObject = {};
        const newValues = {};
        existingObject["not on new"] = "ignore old";
        existingObject[BRAND_FIELD.fieldName] = "Brand 1;";
        existingObject[SELL_PRICE_FIELD.fieldName] = "27.99";
        existingObject[DESCRIPTION_FIELD.fieldName] = "My description";
        newValues[BRAND_FIELD.fieldName] = "Brand 1;";
        newValues[SELL_PRICE_FIELD.fieldName] = "27.99";
        newValues[DESCRIPTION_FIELD.fieldName] = "My description";
        newValues["not on old"] = "ignore new";
        expect(checkForChanges(fieldListForTest, existingObject, newValues)).toBeFalsy();
    });
    it("should return false when a field is added with no content", () => {
        const existingObject = {};
        const newValues = {};
        existingObject[BRAND_FIELD.fieldName] = "Brand 1;";
        existingObject[DESCRIPTION_FIELD.fieldName] = "My description";
        newValues[BRAND_FIELD.fieldName] = "Brand 1;";
        newValues[SELL_PRICE_FIELD.fieldName] = "";
        newValues[DESCRIPTION_FIELD.fieldName] = "My description";
        expect(checkForChanges(fieldListForTest, existingObject, newValues)).toBeFalsy();
    });
});
