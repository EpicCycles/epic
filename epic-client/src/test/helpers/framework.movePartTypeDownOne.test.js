import React from 'react';
import {movePartTypeDownOne} from '../../helpers/framework';

describe('movePartTypeDownOne tests', () => {
    it('does not fail if a section id is not found', () => {
        const sections = [
            {
                id: 97,
                placing: 2,
                partTypes: [{id: 971, placing: 11}, {id: 972, placing: 111}, {id: 973, placing: 121},]
            },
            {id: 7, placing: 3, partTypes: [{id: 71, placing: 11}, {id: 72, placing: 111}, {id: 73, placing: 121},]},
        ];
        const newSections = movePartTypeDownOne(sections, 33, 971);
        expect(newSections).toBe(sections);
    });
    it('does not fail if the part type is not found in the section', () => {
        const sections = [
            {
                id: 33,
                placing: 2,
                partTypes: [{id: 971, placing: 11}, {id: 972, placing: 111}, {id: 973, placing: 121},]
            },
        ];
        const newSections = movePartTypeDownOne(sections, 33, 331);
        expect(newSections).toBe(sections);
    });
    it('moves found part type', () => {
        const sections = [
            {
                id: 97,
                placing: 2,
                partTypes: [{id: 971, placing: 11}, {id: 972, placing: 111}, {id: 973, placing: 121},]
            },
            {
                id: 33,
                placing: 2,
                partTypes: [{id: 331, placing: 11}, {id: 332, placing: 111}, {id: 333, placing: 111}, {
                    id: 334,
                    placing: 331
                }, {id: 335, placing: 331},]
            },
            {id: 7, placing: 3, partTypes: [{id: 71, placing: 11}, {id: 72, placing: 111}, {id: 73, placing: 121},]},
        ];
        const sectionsExpected = [
            {
                id: 97,
                placing: 2,
                partTypes: [{id: 971, placing: 11}, {id: 972, placing: 111}, {id: 973, placing: 121},]
            },
            {
                id: 33,
                placing: 2,
                partTypes: [
                    {id: 331, placing: 10},
                    {id: 333, placing: 20},
                    {id: 332, placing: 30},
                    {id: 334, placing: 40},
                    {id: 335, placing: 50},
                ]
            },
            {id: 7, placing: 3, partTypes: [{id: 71, placing: 11}, {id: 72, placing: 111}, {id: 73, placing: 121},]},
        ];
        const newSections = movePartTypeDownOne(sections, 33, 332);
        expect(newSections).toEqual(sectionsExpected);
    });

});
