import {validateModelAndSetErrors} from "../../../../components/app/model/helpers/model";
import {customerAddressFields} from "../../../../components/app/model/helpers/fields";
import {ADDRESS_MISSING, COUNTRY_MISSING} from "../../../../components/app/model/helpers/error";

describe('validateModelAndSetErrors', () => {
    it('should return an empty object when there are no errors', () => {
        const model = {
            id: 123,
            address1: "line one",
            address2: "line Ywo",
            address3: "line Three",
            address4: "line Four",
            postcode: "SY8 1EE",
            country: 'GB',
            customer: 6
        };
        expect(validateModelAndSetErrors(model, customerAddressFields)).toEqual({});
    });
    it('should return all errors when there are errors', () => {
        const model = {
            id: 123,
            address2: "line Ywo",
            address3: "line Three",
            address4: "line Four",
            postcode: "aaabbb",
            customer: 6
        };
        const expectedErrors = { address1: ADDRESS_MISSING, country: COUNTRY_MISSING };
        expect(validateModelAndSetErrors(model, customerAddressFields)).toEqual(expectedErrors);
    });

})