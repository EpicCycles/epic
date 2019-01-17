import React from 'react';
import {findIndexOfObjectWithKey} from "../utils";

describe('findIndexOfObjectWithKey tests', () => {
    const objects = [
        { id: 123, part_type_attribute: 101, attribute_option: 'braze' },
        { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: false },
        { part_type_attribute: 1, attribute_option: 'braze', dummyKey: 'hjgfkuyg34', delete: true },
    ];
    it('does not fail if an key is not found', () => {
        const index = findIndexOfObjectWithKey(objects, 2324324324);
        expect(index).toEqual(-1);
    });
    it('finds an id', () => {
        const index = findIndexOfObjectWithKey(objects, 323);
        expect(index).toEqual(1);
    });
    it('finds astring equivalent id', () => {
        const index = findIndexOfObjectWithKey(objects, '323');
        expect(index).toEqual(1);
    });
    it('finds a dummy key', () => {
        const index = findIndexOfObjectWithKey(objects, 'hjgfkuyg34');
        expect(index).toEqual(2);
    });

});
