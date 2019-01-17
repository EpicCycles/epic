import {customerAddressFields} from "../helpers/fields";
import {updateModel} from "../helpers/model";

test('field added to model', () => {
    const model = {
        id: 123,
        address1: "line one",
        address2: "line Ywo",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6
    };
    const updatedModel = {
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
    const result = updateModel(model, customerAddressFields, "address2_componentKet", "line two corrected");
    expect(result).toEqual(updatedModel);
});
test('unknown field not added to model', () => {
    const model = {
        id: 123,
        address1: "line one",
        address2: "line Ywo",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6
    };

    const result = updateModel(model, customerAddressFields, "brand_componentKet", "line two corrected");
    expect(result).toEqual(model);
});
