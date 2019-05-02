import {NEW_ELEMENT_ID} from "../../../../../helpers/constants";
import {generateRandomCode} from "../../../../../helpers/utils";
import {getModelKey} from "../model";

test('no model returns new element id', () => {
    expect(getModelKey()).toBe(NEW_ELEMENT_ID);
});
test('empty model returns new element id', () => {
    expect(getModelKey({})).toBe(NEW_ELEMENT_ID);
});
test('model with only id returns that', () => {
    const modelInstance = {
        id: 23,
        field: 'another field'
    };
    expect(getModelKey(modelInstance)).toBe(23);
});
test('model with id and dummy key returns id', () => {
    const modelInstance = {
        id: 23,
        field: 'another field',
        dummyKey: generateRandomCode()
    };
    expect(getModelKey(modelInstance)).toBe(23);
});
test('model with dummy key only returns dummyKey', () => {
    const modelInstance = {
        idTypeField: 23,
        field: 'another field',
        dummyKey: generateRandomCode()
    };
    expect(getModelKey(modelInstance)).toBe(modelInstance.dummyKey);
});