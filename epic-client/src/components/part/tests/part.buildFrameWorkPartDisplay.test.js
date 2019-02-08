import {buildFrameWorkPartDisplay} from "../helpers/part";

const sections = [
    {
        id: 1,
        name: 'section 1 name',
        partTypes: [
            {
                id: 1,
            },
            {
                id: 3,
            },
        ]
    },
    {
        id: 2,
        name: 'Groupset',
        partTypes: [
            {
                id: 9,
            },
            {
                id: 12,
            },
            {
                id: 14,
            },
        ]
    },
    {
        id: 3,
        name: 'section 3 name',
        partTypes: [
            {
                id: 171,
            },
        ]
    },
];


test('should return all sections and matching parts when every part type has a part', () => {
    const parts = [
        { id: 11, partType: 1 },
        { id: 13, partType: 3 },
        { id: 214, partType: 14 },
        { id: 212, partType: 12 },
        { id: 29, partType: 9 },
        { id: 3171, partType: 171 },
    ];
    const expectedSections = [
        { id: 1, name: 'section 1 name', parts: [parts[0], parts[1]] },
        { id: 2, name: 'Groupset', parts: [parts[4], parts[3], parts[2]] },
        { id: 3, name: 'section 3 name', parts: [parts[5]] },
    ];
    expect(buildFrameWorkPartDisplay(sections, parts, true)).toEqual(expectedSections);
    expect(buildFrameWorkPartDisplay(sections, parts,)).toEqual(expectedSections);
});
test('should return sections including empty sections and matching parts when not partType has a part', () => {
    const parts = [
        { id: 11, partType: 1 },
        { id: 13, partType: 3 },
        { id: 214, partType: 14 },
        { id: 29, partType: 9 },
    ];
    const expectedSectionsIncludingEmpty = [
        { id: 1, name: 'section 1 name', parts: [parts[0], parts[1]] },
        { id: 2, name: 'Groupset', parts: [parts[3], parts[2]] },
        { id: 3, name: 'section 3 name', parts: [] },
    ];
    const expectedSectionsExcludingEmpty = [
        { id: 1, name: 'section 1 name', parts: [parts[0], parts[1]] },
        { id: 2, name: 'Groupset', parts: [parts[3], parts[2]] },
    ];
    expect(buildFrameWorkPartDisplay(sections, parts, true)).toEqual(expectedSectionsIncludingEmpty);
    expect(buildFrameWorkPartDisplay(sections, parts,)).toEqual(expectedSectionsExcludingEmpty);
});
test('should return sections including empty sections and matching parts including multipleswhen not partType has a part', () => {
    const parts = [
        { id: 11, partType: 1 },
        { id: 13, partType: 3 },
        { id: 214, partType: 14 },
        { id: 29, partType: 9 },
        { id: 2142, partType: 14 },
    ];
    const expectedSectionsIncludingEmpty = [
        { id: 1, name: 'section 1 name', parts: [parts[0], parts[1]] },
        { id: 2, name: 'Groupset', parts: [parts[3], parts[2], parts[4]] },
        { id: 3, name: 'section 3 name', parts: [] },
    ];
    const expectedSectionsExcludingEmpty = [
        { id: 1, name: 'section 1 name', parts: [parts[0], parts[1]] },
        { id: 2, name: 'Groupset', parts: [parts[3], parts[2], parts[4]] },
    ];
    expect(buildFrameWorkPartDisplay(sections, parts, true)).toEqual(expectedSectionsIncludingEmpty);
    expect(buildFrameWorkPartDisplay(sections, parts,)).toEqual(expectedSectionsExcludingEmpty);
});