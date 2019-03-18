// builds a string for the customer
export const buildCustomerString = (customer) => {
   let displayArray = [];
   if (customer.first_name) displayArray.push(customer.first_name);
   if (customer.last_name) displayArray.push(customer.last_name);
   if (customer.email) displayArray.push(`(${customer.email})`);
   return displayArray.join(' ');
};