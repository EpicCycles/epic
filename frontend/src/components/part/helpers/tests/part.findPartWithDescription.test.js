import {findPartWithDescription} from "../part";

describe('findPartWithDescription', () => {
    const brands = [
        { id: 1, brand_name: 'AAA' },
        { id: 2, brand_name: 'B' },
        { id: 3, brand_name: 'CDE' },
    ];
    const parts = [
        { id: 11, partType: 1, brand: 1, part_name: 'Part 1' }
    ];
    it('should return a match on description when found', () => {
        const expectedPart = { id: 11, partType: 1, brand: 1, part_name: 'Part 1' };
        expect(findPartWithDescription('Part 1', 1, parts, brands)).toEqual(expectedPart);
    });

    it('should return a match when the description includes the brand', () => {
        const expectedPart = { id: 11, partType: 1, brand: 1, part_name: 'Part 1' };
        expect(findPartWithDescription('AAA Part 1', 1, parts, brands)).toEqual(expectedPart);
    });

    it('should return a new product when the description includes a different brand', () => {
        const expectedPart = { partType: 1, brand: 2, part_name: 'Part 1' };
        expect(findPartWithDescription('B Part 1', 1, parts, brands)).toEqual(expectedPart);
    });

    it('should return a new product when the description includes a brand', () => {
        const expectedPart = { partType: 1, brand: 3, part_name: 'new part' };
        expect(findPartWithDescription('cde new part', 1, parts, brands)).toEqual(expectedPart);
    });
})