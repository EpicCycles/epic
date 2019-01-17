import {ADDRESS_MISSING} from "../helpers/error";
import {isModelValid} from "../helpers/model";

test('no error or error detail is valid', () => {
    const model = {
        id: 123,
        address1: "line one",
        address2: "line two corrected",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6,
        changed: true,
    };
    expect(isModelValid(model)).toBeTruthy();
})
test('no error empty error detail is valid', () => {
    const model = {
        id: 123,
        address1: "line one",
        address2: "line two corrected",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6,
        changed: true,
        error_detail: {}
    };
    expect(isModelValid(model)).toBeTruthy();
})
test('empty error no error detail is valid', () => {
    const model = {
        id: 123,
        address1: "line one",
        address2: "line two corrected",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6,
        changed: true,
        error: "",
    };
    expect(isModelValid(model)).toBeTruthy();
})
test('error no error detail is not valid', () => {
    const model = {
        id: 123,
        address1: "line one",
        address2: "line two corrected",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6,
        changed: true,
        error: "IS not valid",
        error_detail: {}
    };
    expect(isModelValid(model)).toBeFalsy();
})
test('empty error with error detail is not valid', () => {
    const model = {
        id: 123,
        address1: "line one",
        address2: "line two corrected",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6,
        changed: true,
        error: "",
        error_detail: {address1: ADDRESS_MISSING}
    };
    expect(isModelValid(model)).toBeFalsy();
})
test('error and error detail is not valid', () => {
    const model = {
        id: 123,
        address1: "line one",
        address2: "line two corrected",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6,
        changed: true,
        error: "Invalid data",
        error_detail: {address1: ADDRESS_MISSING}
    };
    expect(isModelValid(model)).toBeFalsy();
})