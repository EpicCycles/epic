import {getDataList} from "../partList";

describe('getDataList', () => {
    const brands = [
        {id: 1, brand_name: 'Brand 1'},
        {id: 2, brand_name: 'Brand 2'},
        {id: 3, brand_name: 'Brand 3'},
        {id: 4, brand_name: 'Brand 4'},
    ];
    const parts = [
        {id:21, brand:1, partType:16, part_name: 'Part 21'},
        {id:22, brand:2, partType:16, part_name: 'Part 22'},
        {id:23, brand:2, partType:26, part_name: 'Part 23'},
        {id:24, brand:4, partType:26, part_name: 'Part 24'},
        {id:25, brand:4, partType:26, part_name: 'Part 25'},
    ];

    it('should return an empty array when no parts for part type', () => {
        expect(getDataList(parts, brands, 6)).toEqual([]);
    })
    it('should return an empty array when no parts for part type and brand', () => {
        expect(getDataList(parts, brands, 26, 1)).toEqual([]);
    })
    it('should return matched parts when there are parts for part type and brand', () => {
        const expectedArray = [
           {id:23, dataValue: 'Brand 2 Part 23'},
        ];
        expect(getDataList(parts, brands, 26, 2)).toEqual(expectedArray);
    });
    it('should return matched parts when there are parts for part type', () => {
        const expectedArray = [
           {id:23, dataValue: 'Brand 2 Part 23'},
           {id:24, dataValue: 'Brand 4 Part 24'},
           {id:25, dataValue: 'Brand 4 Part 25'},
        ];
        expect(getDataList(parts, brands, 26)).toEqual(expectedArray);
    });
});