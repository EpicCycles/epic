import React from 'react';
import {moveSectionToTop} from '../../helpers/framework';

describe('moveSectionToTop tests', () => {
    it('does not fail if an id is not found', () => {
        const sections = [
            {id: 97, placing: 2},
            {id: 7, placing: 3},
        ];
        const newSections = moveSectionToTop(sections, 33);
        expect(newSections).toEqual(sections);
    });
    it('does not fail if this is only item in array', () => {
        const sections = [
            {id: 33, placing: 2},
        ];
        const newSections = moveSectionToTop(sections, 33);
        expect(newSections).toEqual(sections);
    });
    it('does not fail if first item in array', () => {
        const sections = [
            {id: 33, placing: 2},
            {id: 7, placing: 3},
        ];
        const newSections = moveSectionToTop(sections, 33);
        expect(newSections).toEqual(sections);
    });
    it('can move item into 1st place', () => {
        const sections = [
            {id: 97, placing: 2},
            {id: 33, placing: 2},
            {id: 7, placing: 3},
            {id: 37, placing: 3},
        ];
        const newSections = moveSectionToTop(sections, 33);
        expect(newSections.length).toBe(sections.length);
        expect(newSections[0].id).toBe(33);
        expect(newSections[0].placing).toBe(10);
        expect(newSections[1].id).toBe(97);
        expect(newSections[1].placing).toBe(20);
        expect(newSections[2].id).toBe(7);
        expect(newSections[2].placing).toBe(30);
        expect(newSections[3].id).toBe(37);
        expect(newSections[3].placing).toBe(40);
    });
    it('can move an item from last place', () => {
        const sections = [
            {id: 97, placing: 2},
            {id: 7, placing: 3},
            {id: 37, placing: 3},
            {id: 33, placing: 2},
        ];
        const newSections = moveSectionToTop(sections, 33);
        expect(newSections.length).toBe(sections.length);
        expect(newSections[0].id).toBe(33);
        expect(newSections[0].placing).toBe(10);
        expect(newSections[1].id).toBe(97);
        expect(newSections[1].placing).toBe(20);
        expect(newSections[2].id).toBe(7);
        expect(newSections[2].placing).toBe(30);
        expect(newSections[3].id).toBe(37);
        expect(newSections[3].placing).toBe(40);
    });
});
