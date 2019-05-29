import {sortObjectsByAttribute} from "../../helpers/utils";

const testArray = [
    { idAttribute: 1, alphaAttribute: 'zaphod', numberAttribute: 23, decimalAttribute: 23.99 },
    { idAttribute: 1, alphaAttribute: 'Canute', numberAttribute: 13, decimalAttribute: 123.99 },
    { idAttribute: 1, alphaAttribute: 'Ziggy', numberAttribute: 45, decimalAttribute: 23.09 },
    { idAttribute: 1, alphaAttribute: 'Max', numberAttribute: 2, decimalAttribute: 3.99 },
];
test('should cope when an empty array is passed', () => {
    expect(sortObjectsByAttribute([], 'NyAttribute')).toEqual([]);
});
test('should sort array when an alphanumeric attribute is used', () => {
    const expectedResult = [
        { idAttribute: 1, alphaAttribute: 'Canute', numberAttribute: 13, decimalAttribute: 123.99 },
        { idAttribute: 1, alphaAttribute: 'Max', numberAttribute: 2, decimalAttribute: 3.99 },
        { idAttribute: 1, alphaAttribute: 'zaphod', numberAttribute: 23, decimalAttribute: 23.99 },
        { idAttribute: 1, alphaAttribute: 'Ziggy', numberAttribute: 45, decimalAttribute: 23.09 },
    ];
    expect(sortObjectsByAttribute(testArray, 'alphaAttribute')).toEqual(expectedResult);
});
test('should sort array when an numeric attribute is used', () => {
    const expectedResult = [
        { idAttribute: 1, alphaAttribute: 'Max', numberAttribute: 2, decimalAttribute: 3.99 },
        { idAttribute: 1, alphaAttribute: 'Canute', numberAttribute: 13, decimalAttribute: 123.99 },
        { idAttribute: 1, alphaAttribute: 'zaphod', numberAttribute: 23, decimalAttribute: 23.99 },
        { idAttribute: 1, alphaAttribute: 'Ziggy', numberAttribute: 45, decimalAttribute: 23.09 },
    ];
    expect(sortObjectsByAttribute(testArray, 'numberAttribute')).toEqual(expectedResult);
});
test('should sort array when an decimal attribute is used', () => {
    const expectedResult = [
        { idAttribute: 1, alphaAttribute: 'Max', numberAttribute: 2, decimalAttribute: 3.99 },
        { idAttribute: 1, alphaAttribute: 'Ziggy', numberAttribute: 45, decimalAttribute: 23.09 },
        { idAttribute: 1, alphaAttribute: 'zaphod', numberAttribute: 23, decimalAttribute: 23.99 },
        { idAttribute: 1, alphaAttribute: 'Canute', numberAttribute: 13, decimalAttribute: 123.99 },
    ];
    expect(sortObjectsByAttribute(testArray, 'decimalAttribute')).toEqual(expectedResult);
});

test('should sort array by default id when no attribute is supplier', () => {
    const testArraywithId = [
        { id: 11, alphaAttribute: 'zaphod', numberAttribute: 23, decimalAttribute: 23.99 },
        { id: 1, alphaAttribute: 'Canute', numberAttribute: 13, decimalAttribute: 123.99 },
        { id: 21, alphaAttribute: 'Ziggy', numberAttribute: 45, decimalAttribute: 23.09 },
        { id: 233, alphaAttribute: 'Max', numberAttribute: 2, decimalAttribute: 3.99 },
    ];
    const expectedResult = [
        { id: 1, alphaAttribute: 'Canute', numberAttribute: 13, decimalAttribute: 123.99 },
        { id: 11, alphaAttribute: 'zaphod', numberAttribute: 23, decimalAttribute: 23.99 },
        { id: 21, alphaAttribute: 'Ziggy', numberAttribute: 45, decimalAttribute: 23.09 },
        { id: 233, alphaAttribute: 'Max', numberAttribute: 2, decimalAttribute: 3.99 },
    ];
    expect(sortObjectsByAttribute(testArraywithId)).toEqual(expectedResult);
});