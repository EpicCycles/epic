import {fixedDetailsClassname} from "../../../../components/app/model/helpers/display";

test('should return the fixed header class when it is required', () => {
    expect(fixedDetailsClassname(true)).toBe("grid-item--fixed-left")
})
test('should not return the fixed header class when it is not required', () => {
    expect(fixedDetailsClassname(false)).toBe("")
});