import {ADDRESS1, ADDRESS1_FIELD, customerAddressFields} from "../helpers/fields";
import {getField} from "../helpers/model";

test('if a field is found it is returned', () => {
   const field = getField(customerAddressFields, ADDRESS1);
   expect(field).toBe(ADDRESS1_FIELD);
});
test('if a field is not found nothing is returned', () => {
   const field = getField(customerAddressFields, "street");
   expect(field).toBe(undefined);
});