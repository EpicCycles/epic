import {fixedHeaderClassname} from "../../../../components/app/model/helpers/display";

test('should return the fixed header class when it is required', () => {
    expect(fixedHeaderClassname(true)).toBe("grid-header--fixed-left")
})
test('should not return the fixed header class when it is not required', () => {
    expect(fixedHeaderClassname(false)).toBe("")
});