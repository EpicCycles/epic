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

export const updateCustomerAddressList = (customer, addresses) => {
    let updatedCustomer = customer ? Object.assign({}, customer) : {};
    updatedCustomer.addresses = addresses;
    return updatedCustomer;
};
