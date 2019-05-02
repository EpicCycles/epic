import {ADDRESS1, ADDRESS1_FIELD, customerAddressFields} from "../fields";
import {getAttribute} from "../model";

test('if a field is found it is returned', () => {
   const field = getAttribute(customerAddressFields, "address1_1234_23");
   expect(field).toBe(ADDRESS1);
});
test('if a field is not found nothing is returned', () => {
   const field = getAttribute(customerAddressFields, "street_234_32_address1_12");
   expect(field).toBe(undefined);
});