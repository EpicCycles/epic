import {customerAddressFields} from "../helpers/fields";
import {displayModelErrorSummary} from "../helpers/model";

test('if no error or error_detail undefined returned', () => {
    const model = {
        id: 123,
        address1: "line one",
        address2: "line Ywo",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6
    };
    const result = displayModelErrorSummary(model, customerAddressFields);
    expect(result).toBe(undefined);
});
test('if just error no error_detail error returned', () => {
    const model = {
        id: 123,
        address1: "line one",
        address2: "line Ywo",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6,
        error: "Model level error"
    };
    const result = displayModelErrorSummary(model, customerAddressFields);
    expect(result).toBe("Model level error");
});
test('if no error with error_detail error_details formatted returned', () => {
    const model = {
        id: 123,
        address1: "line one",
        address2: "line Ywo",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6,
        error_detail: {
            "address1": ["A valid address is required.", "SHow me the address is required."],
            "postcode": ["This field may not be blank."]
        },
    };
    const expectedText = "Address: A valid address is required. SHow me the address is required.<br>Postcode: This field may not be blank.";
    const result = displayModelErrorSummary(model, customerAddressFields);
    expect(result).toBe(expectedText);
});
test('if error and error_detail formatted returned', () => {
    const model = {
        id: 123,
        address1: "line one",
        address2: "line Ywo",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6,
        error: "Model level error",
        error_detail: {
            "address1": ["A valid address is required.", "SHow me the address is required."],
            "postcode": ["This field may not be blank."]
        },
    };
    const expectedText = "Model level error<br>Address: A valid address is required. SHow me the address is required.<br>Postcode: This field may not be blank.";
    const result = displayModelErrorSummary(model, customerAddressFields);
    expect(result).toBe(expectedText);
});