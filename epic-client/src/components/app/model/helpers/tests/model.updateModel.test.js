import {customerAddressFields} from "../fields";
import {updateModel} from "../model";
import {ADDRESS_MISSING} from "../error";

describe('model.updateModel', () => {
    it('should update a field on the model', () => {
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
    it('should not add a field when it is not a model field', () => {
        const model = {
            id: 123,
            address1: "line one",
            address2: "line Ywo",
            address3: "line Three",
            address4: "line Four",
            country: "GB",
            postcode: "SY81EE",
            customer: 6
        };

        const result = updateModel(model, customerAddressFields, "brand_componentKet", "line two corrected");
        expect(result).toEqual(model);
    });

    describe('error related tests', () => {
        it('should remove error field and replace error detail', () => {
            const model = {
                id: 123,
                address1: "line one",
                address2: "line Ywo",
                address3: "line Three",
                address4: "line Four",
                postcode: "xxxyyy",
                customer: 6,
                error: 'remove me',
                error_detail: { randomKey: 'remove this' },
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
        })
        it('should populate error_detail when required', () => {
            const model = {
                id: 123,
                error: 'remove me',
                error_detail: { randomKey: 'remove this' },
            };
            const updatedModel = {
                id: 123,
                address2: "line two corrected",
                changed: true,
                error_detail: { address1: ADDRESS_MISSING, "country": "A country must be selected" }
            };
            const result = updateModel(model, customerAddressFields, "address2_componentKet", "line two corrected");
            expect(result).toEqual(updatedModel);
        })
    })
});
