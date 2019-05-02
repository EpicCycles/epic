import {getCountryName} from "../helpers/address";

test('no country code no name', () => {
    expect(getCountryName()).not.toBeDefined();
});
test('no country matching code use code', () => {
    expect(getCountryName("ZZZ")).toBe("ZZZ");
});
test('no country code no name', () => {
    expect(getCountryName("GB")).toBe("United Kingdom");
});