import {customerAddressFields} from "../fields";
import {createEmptyModelWithDefaultFields, modelIsAlreadyInArray} from "../model";

describe.only('model.modelIsAlreadyInArray', () => {
    it('returns false when the model does not match', () => {
        const arrayToCheck = [];
        const addressToCheck = createEmptyModelWithDefaultFields(customerAddressFields);
        expect(modelIsAlreadyInArray(arrayToCheck, addressToCheck, customerAddressFields)).toBeFalsy();
    });
    it('returns true when the addrss to check matched except for readonly fields', () => {
        const arrayToCheck = [
            {
                id: 19,
                address1: '1 Mill Lane',
                address2: '',
                address3: '',
                address4: '',
                postcode: 'SY8 1EE',
                country: 'GB',
                add_date: '2019-03-12T14:11:24.900467Z',
                upd_date: '2019-03-12T14:11:24.901461Z',
                customer: 28
            }
        ];
        const addressToCheck = {
            address1: '1 Mill Lane',
            postcode: 'SY8 1EE',
            country: 'GB',
            add_date: '2019-01-12T14:11:24.900467Z',
            upd_date: '2019-01-12T14:11:24.901461Z',
            customer: 28
        };
        expect(modelIsAlreadyInArray(arrayToCheck, addressToCheck, customerAddressFields)).toBeTruthy();
    })
})

