import {validatePostcodeAndReturnError} from "../../helpers/address_helpers";

test('a country that has a postcode map returns an error if the postcode is not found', () => {
    const result = validatePostcodeAndReturnError('', {country: 'GB'});
    expect(result).not.toBe(undefined);
    expect(result.endsWith('CCNN NCC')).toBeTruthy();
});
test('an invalid GB postcode returns an error', () => {
    const result = validatePostcodeAndReturnError('SY EE', {country: 'GB'});
    expect(result).not.toBe(undefined);
    expect(result.endsWith('CCNN NCC')).toBeTruthy();
});
test('a valid GB postcode returns no error', () => {
    const result1 = validatePostcodeAndReturnError('SY8 1EE', {country: 'GB'});
    expect(result1).toBe(undefined);
    const result2 = validatePostcodeAndReturnError('SW1A 1AA', {country: 'GB'});
    expect(result2).toBe(undefined);
});
test('a missing postcode for a country with no rules does not return an error', () => {
    const result = validatePostcodeAndReturnError('',{country: 'YE'});
    expect(result).toBe(undefined);
});
test('a postcode for a country with no rules does not return an error', () => {
    const result = validatePostcodeAndReturnError('no idea what it should be', {country: 'YE'});
    expect(result).toBe(undefined);
});
test('a postcode when the model has no country does not return an error', () => {
    const result = validatePostcodeAndReturnError('no idea what it should be', {address1: "my address 1"});
    expect(result).toBe(undefined);
});
test('a postcode when there is no model does not return an error', () => {
    const result = validatePostcodeAndReturnError('no idea what it should be');
    expect(result).toBe(undefined);
});
