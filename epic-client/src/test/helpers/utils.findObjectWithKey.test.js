import React from 'react';
import {findIndexOfObjectWithKey} from "../../helpers/utils";

describe('findIndexOfObjectWithKey tests', () => {
    const objects = [
        { id: 123, part_type_attribute: 101, attribute_option: 'braze' },
        { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: false },
        { part_type_attribute: 1, attribute_option: 'braze', dummyKey: 'hjgfkuyg34', delete: true },
    ];
    it('does not fail if an key is not found', () => {
        const object = findIndexOfObjectWithKey(objects, 2324324324);
        expect(object).toBe(undefined);
    });
    it('finds an id', () => {
        const object = findIndexOfObjectWithKey(objects, 323);
        expect(object).toEqual(objects[1]);
    });
    it('finds astring equivalent id', () => {
        const object = findIndexOfObjectWithKey(objects, '123');
        expect(object).toEqual(objects[0]);
    });
    it('finds a dummy key', () => {
        const object = findIndexOfObjectWithKey(objects, 'hjgfkuyg34');
        expect(object).toEqual(objects[2]);
    });

});
