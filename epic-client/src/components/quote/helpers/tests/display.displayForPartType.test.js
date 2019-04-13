import {displayForPartType} from "../display";

describe('displayForPartType', () => {
    const quoteParts = [
        { id: 11, partType: 231, part:1, replacement_part: true },
        { id: 92, partType: 91 },
        { id: 9331, partType: 91 },
    ];
    const bikeParts = [
        { id: 11, partType: 231 },
        { id: 31, partType: 331 },
        { id: 131, partType: 631 },
    ];
    const parts = [
        { id: 1, partType: 231 },
        { id: 2, partType: 331 },
        { id: 331, partType: 331 },
        { id: 92, partType: 91 },
        { id: 9331, partType: 91 },
    ];
    it('should return all a replacement part', () => {
        const partTypeId = 231;
        const expectedResult = {
            bikePart: { id: 11, partType: 231 },
            quotePart:  { id: 11, partType: 231, part:1, replacement_part: true },
            replacementPart: { id: 1, partType: 231 },
            additionalParts: [],
        };
        expect(displayForPartType(partTypeId, quoteParts, bikeParts, parts)).toEqual(expectedResult);
    });
    it('should return no values if none are found', () => {
        const partTypeId = 23;
        const expectedResult = {
            bikePart: undefined,
            quotePart: undefined,
            replacementPart: undefined,
            additionalParts: [],
        };
        expect(displayForPartType(partTypeId, quoteParts, bikeParts, parts)).toEqual(expectedResult);
    });
    it('should return just a bike part when there are no matching quote parts', () => {
        const partTypeId = 631;
        const expectedResult = {
            bikePart: { id: 131, partType: 631 },
            quotePart: undefined,
            replacementPart: undefined,
            additionalParts: [],
        };
        expect(displayForPartType(partTypeId, quoteParts, bikeParts, parts)).toEqual(expectedResult);
    });
    it('should return just additional parts when there are no matching quote parts', () => {
        const partTypeId = 91;
        const expectedResult = {
            bikePart: undefined,
            quotePart: undefined,
            replacementPart: undefined,
            additionalParts: [
                { id: 92, partType: 91 },
                { id: 9331, partType: 91 },],
        };
        expect(displayForPartType(partTypeId, quoteParts, bikeParts, parts)).toEqual(expectedResult);
    });
});