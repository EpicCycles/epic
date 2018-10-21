import React from 'react';
import {attributeSummary} from "../../helpers/framework";

test('returns an attribute correctly with no options', () => {
    const attribute = {
        "attribute_name": "Braze/Band",
        "in_use": true,
        "mandatory": true,
    };
    const attributeStringExpected = "Braze/Band, in use, must be entered";
    expect(attributeSummary(attribute)).toBe(attributeStringExpected);
});
test('returns an attribute correctly with an empty array of options', () => {
    const attribute = {
        "attribute_name": "Braze/Band",
        "in_use": false,
        "mandatory": true,
        options: []
    };
    const attributeStringExpected = "Braze/Band, must be entered";
    expect(attributeSummary(attribute)).toBe(attributeStringExpected);
});
test('returns an attribute correctly with an array of options', () => {
    const attribute = {
        "attribute_name": "Braze/Band",
        "in_use": true,
        "mandatory": false,
        options: [
            {
                "id": 2,
                "attribute_option": "Band",
                "part_type_attribute": 4
            },
            {
                "id": 1,
                "attribute_option": "Braze",
                "part_type_attribute": 4
            }
        ],
    };
    const attributeStringExpected = "Braze/Band, in use, allowed options: Band,Braze";
    expect(attributeSummary(attribute)).toBe(attributeStringExpected);
});