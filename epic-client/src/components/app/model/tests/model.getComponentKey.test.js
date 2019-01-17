import {NEW_ELEMENT_ID} from "../../../../helpers/constants";
import {generateRandomCode} from "../../../../helpers/utils";
import {getComponentKey} from "../helpers/model";

test('no model returns new element id', () => {
    expect(getComponentKey()).toBe(NEW_ELEMENT_ID);
});
test('empty model returns new element id', () => {
    expect(getComponentKey({})).toBe(NEW_ELEMENT_ID);
});
test('model with only id returns that', () => {
    const modelInstance = {
        id: 23,
        field: 'another field'
    };
    expect(getComponentKey(modelInstance)).toBe(23);
});
test('model with id and dummy key returns id', () => {
    const modelInstance = {
        id: 23,
        field: 'another field',
        dummyKey: generateRandomCode()
    };
    expect(getComponentKey(modelInstance)).toBe(23);
});
test('model with dummy key only returns dummyKey', () => {
    const modelInstance = {
        idTypeField: 23,
        field: 'another field',
        dummyKey: generateRandomCode()
    };
    expect(getComponentKey(modelInstance)).toBe(modelInstance.dummyKey);
});