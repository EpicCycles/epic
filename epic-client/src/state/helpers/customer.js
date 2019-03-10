import {
    addItemsToArray,
    findIndexOfObjectWithId,
    findObjectWithId,
    generateRandomCode,
    updateObject
} from "../../helpers/utils";

export const updateCustomerBasic = (customer = {}, updatedValues) => {
    return updateObject(customer, updatedValues);
};

export const updateCustomerPhoneList = (customers, customerId, phones) => {
    const customer = findObjectWithId(customers, customerId);
    if (!customer) return customers;

    let updatedCustomer = updateObject(customer, { phones });
    if (customer.phones && (customer.phones.length < phones.length)) updatedCustomer.newPhone = { "dummyKey": generateRandomCode() };
    return addItemsToArray(customers, [updatedCustomer]);
};

export const updateCustomerAddressList = (customers, customerId, addresses) => {
    const customer = findObjectWithId(customers, customerId);
    let updatedCustomer = updateObject(customer, { addresses });
    if (customer.addresses && (customer.addresses.length < addresses.length)) updatedCustomer.newAddress = { "dummyKey": generateRandomCode() };
    return updatedCustomer;
};

export const customerAddErrorForAddress = (customers, customerId, customerAddress) => {
    const customer = findObjectWithId(customers, customerId);
    let updatedCustomer = updateObject(customer);

    const addressId = customerAddress.id;
    if (addressId && updatedCustomer.addresses) {
        const indexOfAddress = findIndexOfObjectWithId(updatedCustomer.addresses, addressId);
        updatedCustomer.addresses[indexOfAddress].error = true;
    } else {
        updatedCustomer.newAddress = customerAddress;
        updatedCustomer.newAddress.error = true;
    }
    return updatedCustomer;
};

export const customerAddErrorForPhone = (customers, customerId, customerPhone) => {
    const customer = findObjectWithId(customers, customerId);
    let updatedCustomer = updateObject(customer);

    const phoneId = customerPhone.id;
    if (phoneId && updatedCustomer.phones) {
        const indexOfPhone = findIndexOfObjectWithId(updatedCustomer.phones, phoneId);
        updatedCustomer.phones[indexOfPhone].error = true;
    } else {
        updatedCustomer.newPhone = customerPhone;
        updatedCustomer.newPhone.error = true;
    }
    return updatedCustomer;
};

