import {addToUniqueArray} from "../utils";

test("does not add if passed is not array", () => {
    expect(addToUniqueArray("fred","b")).toBe("fred");
});
test("adds to empty array", () => {
    expect(addToUniqueArray([],"b")).toEqual(["b"]);
});
test("adds to undefined array", () => {
    expect(addToUniqueArray(null,"b")).toEqual(["b"]);
});
test("adds to existing array", () => {
    expect(addToUniqueArray(["a", "c"],"b")).toEqual(["a","c","b"]);
});
test("does not add to existing array if already present", () => {
    expect(addToUniqueArray(["a","b"],"b")).toEqual(["a","b"]);
});
