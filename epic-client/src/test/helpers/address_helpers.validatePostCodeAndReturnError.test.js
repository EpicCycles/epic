import {validatePostcodeAndReturnError} from "../../helpers/address_helpers";

test('a country that has a postcode map returns an error if the postcode is not found', () => {
    const result = validatePostcodeAndReturnError('', 'GB');
    expect(result).not.toBe(undefined);
    expect(result.endsWith('CCNN NCC')).toBeTruthy();
});
test('an invalid GB postcode returns an error', () => {
    const result = validatePostcodeAndReturnError('SY EE', 'GB');
    expect(result).not.toBe(undefined);
    expect(result.endsWith('CCNN NCC')).toBeTruthy();
});
test('a valid GB postcode returns no error', () => {
    const result1 = validatePostcodeAndReturnError('SY8 1EE', 'GB');
    expect(result1).toBe(undefined);
    const result2 = validatePostcodeAndReturnError('SW1A 1AA', 'GB');
    expect(result2).toBe(undefined);
});
test('a missing postcode for a country with no rules does not return an error', () => {
    const result = validatePostcodeAndReturnError('', 'YE');
    expect(result).toBe(undefined);
});
test('a postcode for a country with no rules does not return an error', () => {
    const result = validatePostcodeAndReturnError('no idea what it should be', 'YE');
    expect(result).toBe(undefined);
});
