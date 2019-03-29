import {getCustomerName} from "../customer";

const customers = [
    { id: 23, first_name: 'a', last_name: 'b' }
];
const undefinedString = 'Unknown customer';
const customerName = 'a b';
describe('getCustomerName', () => {
    it('should return undefined when no customer id passed', () => {
        expect(getCustomerName(undefined, customers)).toBe(undefinedString);
    });
    it('should return undefined when no customers passed', () => {
        expect(getCustomerName(23, undefined)).toBe(undefinedString);
    });
    it('should return undefined when no customers in list passed', () => {
        expect(getCustomerName(23, [])).toBe(undefinedString);
    });
    it('should return undefined when passed customer is not in the list', () => {
        expect(getCustomerName(234, customers)).toBe(undefinedString);
    });
    it('should return name when passed customer is  in the list', () => {
        expect(getCustomerName(23, customers)).toBe(customerName);
    });
    it('should return name when passed customer as string is  in the list', () => {
        expect(getCustomerName('23', customers)).toBe(customerName);
    });
});