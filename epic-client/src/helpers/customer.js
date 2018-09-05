export const updateCustomerBasic = (customer, updatedValues) => {
    let updatedCustomer = customer ? Object.assign({}, customer) : {};
    updatedCustomer = Object.assign(updatedCustomer, updatedValues);

    return updatedCustomer;
};

export const updateCustomerPhoneList = (customer, phones) => {
    let updatedCustomer = customer ? Object.assign({}, customer) : {};
    updatedCustomer.phones = phones;
    return updatedCustomer;
};
