import {buildPartObject} from "../../../../components/part/helpers/part";

describe('buildPartObject', () => {
    const brandsLower = [
        { id: 21, brand_name: 'cde' },
        { id: 26, brand_name: 'cd' },
        { id: 20, brand_name: 'b' }
    ];

    it('should return a part with a found brand when the part is a known brand', () => {
        const partToFind = 'CDE part';
        const expectedPart = { partType: 1, brand: 21, part_name: 'part' };
        expect(buildPartObject(1, partToFind, brandsLower, 16)).toEqual(expectedPart);
    });

    it('should return a part with a found brand when the part is a known brand that start the same as another brand', () => {
        const partToFind = 'cd part';
        const expectedPart = { partType: 1, brand: 26, part_name: 'part' };
        expect(buildPartObject(1, partToFind, brandsLower, 16)).toEqual(expectedPart);
    });

    it('should return a part with the default brand when the part is a known brand that start the same as another brand', () => {
        const partToFind = 'ebcd part';
        const expectedPart = { partType: 1, brand: 16, part_name: 'ebcd part' };
        expect(buildPartObject(1, partToFind, brandsLower, 16)).toEqual(expectedPart);
    });
});