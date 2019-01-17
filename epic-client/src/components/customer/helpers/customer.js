import {findIndexOfObjectWithId, generateRandomCode, updateObject} from "../../../helpers/utils";

export const updateCustomerBasic = (customer = {}, updatedValues) => {
    return updateObject(customer, updatedValues);
};

export const updateCustomerPhoneList = (customer = {}, phones) => {
    let updatedCustomer = updateObject(customer);
    updatedCustomer.phones = phones;
    if (customer.phones.length < phones.length) updatedCustomer.newPhone = {"dummyKey": generateRandomCode()};
    return updatedCustomer;
};

export const updateCustomerAddressList = (customer = {}, addresses) => {
    let updatedCustomer = updateObject(customer);
    updatedCustomer.addresses = addresses;
    if (customer.addresses && (customer.addresses.length < addresses.length)) updatedCustomer.newAddress = {"dummyKey": generateRandomCode()};
    return updatedCustomer;
};

export const customerAddErrorForAddress = (customer = {}, customerAddress) => {

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

export const customerAddErrorForPhone = (customer = {}, customerPhone) => {
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

