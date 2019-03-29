// builds a string for the customer
import {findObjectWithId} from "../../../helpers/utils";

export const buildCustomerString = (customer) => {
   let displayArray = [];
   if (customer.first_name) displayArray.push(customer.first_name);
   if (customer.last_name) displayArray.push(customer.last_name);
   if (customer.email) displayArray.push(`(${customer.email})`);
   return displayArray.join(' ');
};
export const getCustomerName = (customerId, customers) => {
   const customer = findObjectWithId(customers, customerId);
   if (customer) return buildCustomerString(customer);
   return 'Unknown customer';
};