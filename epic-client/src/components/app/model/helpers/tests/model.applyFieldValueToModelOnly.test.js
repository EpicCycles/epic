import {ADDRESS2_FIELD} from "../fields";
import {applyFieldValueToModelOnly} from "../model";

describe('model.applyFieldValueToModelOnly', () => {

    it('missing field not required or validated added to model', () => {
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
            address2: undefined,
            address3: "line Three",
            address4: "line Four",
            postcode: "xxxyyy",
            customer: 6,
            changed: true,
        };
        const result = applyFieldValueToModelOnly(model, ADDRESS2_FIELD);
        expect(result).toEqual(updatedModel);
    });
    it('field not required or validated added to model', () => {
        const model = {
            id: 123,
            address1: "line one",
            address2: "line Ywo",
            address3: "line Three",
            address4: "line Four",
            postcode: "xxxyyy",
            customer: 6,
            error_detail: { address2: "random error to be removed" },
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
            error_detail: { address2: "random error to be removed" },
        };
        const result = applyFieldValueToModelOnly(model, ADDRESS2_FIELD, "line two corrected");
        expect(result).toEqual(updatedModel);
    });
    it('empty field not required or validated added to model', () => {
        const model = {
            id: 123,
            address1: "line one",
            address2: "line Ywo",
            address3: "line Three",
            address4: "line Four",
                     country: "GB",
   postcode: "xxxyyy",
            customer: 6
        };
        const updatedModel = {
            id: 123,
            address1: "line one",
            address2: "",
            address3: "line Three",
            address4: "line Four",
            country: "GB",
            postcode: "xxxyyy",
            customer: 6,
            changed: true,
        };
        const result = applyFieldValueToModelOnly(model, ADDRESS2_FIELD, "");
        expect(result).toEqual(updatedModel);
    });
});