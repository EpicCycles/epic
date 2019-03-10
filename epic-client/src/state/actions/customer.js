export const CUSTOMER_LIST = 'customer/CUSTOMER_LIST';
export const CUSTOMER_PAGE = 'customer/CUSTOMER_PAGE';
export const CUSTOMER = 'customer/CUSTOMER';
export const CUSTOMER_CREATE = 'customer/CUSTOMER_CREATE';
export const CUSTOMER_SAVE = 'customer/CUSTOMER_SAVE';
export const CUSTOMER_REMOVE = 'customer/CUSTOMER_REMOVE';
export const CUSTOMER_DELETE = 'customer/CUSTOMER_DELETE';
export const CUSTOMER_CLEAR_STATE = 'customer/CUSTOMER_CLEAR_STATE';
export const CUSTOMER_PHONE_SAVE = 'customer/CUSTOMER_PHONE_SAVE';
export const CUSTOMER_PHONE_DELETE = 'customer/CUSTOMER_PHONE_DELETE';
export const CUSTOMER_ADDRESS_SAVE = 'customer/CUSTOMER_ADDRESS_SAVE';
export const CUSTOMER_ADDRESS_DELETE = 'customer/CUSTOMER_ADDRESS_DELETE';

export const removeCustomer = () => ({
    type: CUSTOMER_REMOVE
});
export const clearCustomerState = () => ({
    type: CUSTOMER_CLEAR_STATE
});
export const getCustomerListPage = page => ({
    type: CUSTOMER_PAGE,
    payload: { page }
});

export const getCustomerList =  (firstName, lastName, email)  => ({
    type: `${CUSTOMER_LIST}_REQUESTED`,
    payload: { firstName, lastName, email }
});

export const getCustomerListSuccess = customers => ({
    type: CUSTOMER_LIST,
    payload: customers
});

export const getCustomerListFailure = error => ({
    type: `${CUSTOMER_LIST}_ERROR`,
    payload: error
});

export const getCustomer =  customerId  => ({
    type: `${CUSTOMER}_REQUESTED`,
    payload: { customerId }
});

export const getCustomerSuccess = responseData => ({
    type: CUSTOMER,
    payload: responseData
});

export const getCustomerFailure = error => ({
    type: `${CUSTOMER}_ERROR`,
    payload: error
});
export const createCustomer =  customer  => ({
    type: `${CUSTOMER_CREATE}_REQUESTED`,
    payload: { customer }
});

export const createCustomerSuccess = customer => ({
    type: CUSTOMER_CREATE,
    payload: { customer }
});

export const createCustomerFailure = error => ({
    type: `${CUSTOMER_CREATE}_ERROR`,
    payload: error
});

export const saveCustomer =  customer  => ({
    type: `${CUSTOMER_SAVE}_REQUESTED`,
    payload: { customer }
});

export const saveCustomerSuccess = customer => ({
    type: CUSTOMER_SAVE,
    payload: { customer }
});

export const saveCustomerFailure = error => ({
    type: `${CUSTOMER_SAVE}_ERROR`,
    payload: error
});

export const deleteCustomer =  customerId  => ({
    type: `${CUSTOMER_DELETE}_REQUESTED`,
    payload: {customerId: customerId}
});

export const deleteCustomerSuccess = () => ({
    type: CUSTOMER_DELETE
});

export const deleteCustomerFailure = error => ({
    type: `${CUSTOMER_DELETE}_ERROR`,
    payload: error
});

export const saveCustomerPhone = customerPhone => ({
    type: `${CUSTOMER_PHONE_SAVE}_REQUEST`,
    payload: {customerPhone}
});
export const saveCustomerPhoneSuccess = customerPhoneList => ({
    type: CUSTOMER_PHONE_SAVE,
    payload: customerPhoneList
});
export const saveCustomerPhoneFailure = payload => ({
    type: `${CUSTOMER_PHONE_SAVE}_ERROR`,
    payload
});
export const deleteCustomerPhone = customerPhoneId => ({
    type: `${CUSTOMER_PHONE_DELETE}_REQUEST`,
    payload: {customerPhoneId}
});
export const deleteCustomerPhoneSuccess = customerPhoneList => ({
    type: CUSTOMER_PHONE_DELETE,
    payload: customerPhoneList
});
export const deleteCustomerPhoneFailure = error => ({
    type: `${CUSTOMER_PHONE_DELETE}_ERROR`,
    payload: error
});
export const saveCustomerAddress = customerAddress => ({
    type: `${CUSTOMER_ADDRESS_SAVE}_REQUEST`,
    payload: {customerAddress}
});
export const saveCustomerAddressSuccess = customerAddressList => ({
    type: CUSTOMER_ADDRESS_SAVE,
    payload: customerAddressList
});
export const saveCustomerAddressFailure = error => ({
    type: `${CUSTOMER_ADDRESS_SAVE}_ERROR`,
    payload: error
});
export const deleteCustomerAddress = customerAddressId => ({
    type: `${CUSTOMER_ADDRESS_DELETE}_REQUEST`,
    payload: {customerAddressId}
});
export const deleteCustomerAddressSuccess = customerAddressList => ({
    type: CUSTOMER_ADDRESS_DELETE,
    payload: customerAddressList
});
export const deleteCustomerAddressFailure = error => ({
    type: `${CUSTOMER_ADDRESS_DELETE}_ERROR`,
    payload: error
});
