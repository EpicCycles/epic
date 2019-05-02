import {definedOrZero} from "../utils";

test("undefined returns false", () => {
    expect(definedOrZero()).toBeFalsy();
});
test("empty string returns false", () => {
    expect(definedOrZero('')).toBeFalsy();
});
test("0 returns true", () => {
    expect(definedOrZero(0)).toBeTruthy();
});
test("undefined returns false", () => {
    expect(definedOrZero(12)).toBeTruthy();
});