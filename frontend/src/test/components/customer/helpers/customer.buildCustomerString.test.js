import {buildCustomerString} from "../../../../components/customer/helpers/customer";

describe('buildCustomerString', () => {
    it('should return an empty string when no display field present', () => {
        const customer = {};
        expect(buildCustomerString(customer)).toBe('');
    });
    it('should return first name only when customer only has that field', () => {
        const customer = {first_name: 'Fred'};
        expect(buildCustomerString(customer)).toBe('Fred');
    });
    it('should return full name when customer has first and last names', () => {
        const customer = {first_name: 'Fred', last_name: 'Jones'};
        expect(buildCustomerString(customer)).toBe('Fred Jones');
    });
    it('should return full details when customer has first and last names and email', () => {
        const customer = {first_name: 'Fred', last_name: 'Jones', email: 'f.jones@aol.com'};
        expect(buildCustomerString(customer)).toBe('Fred Jones (f.jones@aol.com)');
    });
});