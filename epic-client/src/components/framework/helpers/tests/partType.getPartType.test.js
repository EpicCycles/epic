import {getPartType} from "../partType";

describe('getPartType', () => {
    const sections = [
        {
            id:1,
        partTypes: [
            {id:11, name: 'name 11'},
            {id:12, name: 'name 12'},
        ]
        },
        {
            id:2,
        partTypes: [
            {id:21, name: 'name 21'},
            {id:22, name: 'name 22'},
        ]
        },
    ];
    it('should return a parttype when part type id passed is in the sections', () => {
        expect(getPartType(21, sections)).toEqual({id:21, name: 'name 21'});
    })
    it('should return undefined when part type id passed is not found', () => {
        expect(getPartType(23, sections)).not.toBeDefined();
    })
});