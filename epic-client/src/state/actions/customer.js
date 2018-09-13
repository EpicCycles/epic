export const CUSTOMER_LIST_REQUESTED = 'customer/CUSTOMER_LIST_REQUESTED';
export const CUSTOMER_LIST_ERROR = 'customer/CUSTOMER_LIST_ERROR';
export const CUSTOMER_LIST = 'customer/CUSTOMER_LIST';
export const CUSTOMER_PAGE = 'customer/CUSTOMER_PAGE';
export const CUSTOMER_REQUESTED = 'customer/CUSTOMER_REQUESTED';
export const CUSTOMER_ERROR = 'customer/CUSTOMER_ERROR';
export const CUSTOMER = 'customer/CUSTOMER';
export const CUSTOMER_CREATE_REQUESTED = 'customer/CUSTOMER_CREATE_REQUESTED';
export const CUSTOMER_CREATE_ERROR = 'customer/CUSTOMER_CREATE_ERROR';
export const CUSTOMER_CREATE = 'customer/CUSTOMER_CREATE';
export const CUSTOMER_SAVE_REQUESTED = 'customer/CUSTOMER_SAVE_REQUESTED';
export const CUSTOMER_SAVE_ERROR = 'customer/CUSTOMER_SAVE_ERROR';
export const CUSTOMER_SAVE = 'customer/CUSTOMER_SAVE';
export const CUSTOMER_REMOVE = 'customer/CUSTOMER_REMOVE';
export const CUSTOMER_DELETE_REQUESTED = 'customer/CUSTOMER_DELETE_REQUESTED';
export const CUSTOMER_DELETE_ERROR = 'customer/CUSTOMER_DELETE_ERROR';
export const CUSTOMER_DELETE = 'customer/CUSTOMER_DELETE';
export const CUSTOMER_CLEAR_STATE = 'customer/CUSTOMER_CLEAR_STATE';
export const CUSTOMER_PHONE_SAVE_REQUEST = 'customer/CUSTOMER_PHONE_SAVE_REQUEST';
export const CUSTOMER_PHONE_SAVE = 'customer/CUSTOMER_PHONE_SAVE';
export const CUSTOMER_PHONE_SAVE_ERROR = 'customer/CUSTOMER_PHONE_SAVE_ERROR';
export const CUSTOMER_PHONE_DELETE_REQUEST = 'customer/CUSTOMER_PHONE_DELETE_REQUEST';
export const CUSTOMER_PHONE_DELETE = 'customer/CUSTOMER_PHONE_DELETE';
export const CUSTOMER_PHONE_DELETE_ERROR = 'customer/CUSTOMER_PHONE_DELETE_ERROR';
export const CUSTOMER_ADDRESS_SAVE_REQUEST = 'customer/CUSTOMER_ADDRESS_SAVE_REQUEST';
export const CUSTOMER_ADDRESS_SAVE = 'customer/CUSTOMER_ADDRESS_SAVE';
export const CUSTOMER_ADDRESS_SAVE_ERROR = 'customer/CUSTOMER_ADDRESS_SAVE_ERROR';
export const CUSTOMER_ADDRESS_DELETE_REQUEST = 'customer/CUSTOMER_ADDRESS_DELETE_REQUEST';
export const CUSTOMER_ADDRESS_DELETE = 'customer/CUSTOMER_ADDRESS_DELETE';
export const CUSTOMER_ADDRESS_DELETE_ERROR = 'customer/CUSTOMER_ADDRESS_DELETE_ERROR';

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
    type: CUSTOMER_LIST_REQUESTED,
    payload: { firstName, lastName, email }
});

export const getCustomerListSuccess = customers => ({
    type: CUSTOMER_LIST,
    payload: customers
});

export const getCustomerListFailure = error => ({
    type: CUSTOMER_LIST_ERROR,
    payload: error
});

export const getCustomer =  customerId  => ({
    type: CUSTOMER_REQUESTED,
    payload: { customerId }
});

export const getCustomerSuccess = customer => ({
    type: CUSTOMER,
    payload: customer
});

export const getCustomerFailure = error => ({
    type: CUSTOMER_ERROR,
    payload: error
});
export const createCustomer =  customer  => ({
    type: CUSTOMER_CREATE_REQUESTED,
    payload: { customer }
});

export const createCustomerSuccess = customers => ({
    type: CUSTOMER_CREATE,
    payload: customers
});

export const createCustomerFailure = error => ({
    type: CUSTOMER_CREATE_ERROR,
    payload: error
});

export const saveCustomer =  customer  => ({
    type: CUSTOMER_SAVE_REQUESTED,
    payload: { customer }
});

export const saveCustomerSuccess = customer => ({
    type: CUSTOMER_SAVE,
    payload: customer
});

export const saveCustomerFailure = error => ({
    type: CUSTOMER_SAVE_ERROR,
    payload: error
});

export const deleteCustomer =  customer  => ({
    type: CUSTOMER_DELETE_REQUESTED,
    payload: {customerId: customer.id}
});

export const deleteCustomerSuccess = () => ({
    type: CUSTOMER_DELETE
});

export const deleteCustomerFailure = error => ({
    type: CUSTOMER_DELETE_ERROR,
    payload: error
});

export const saveCustomerPhone = customerPhone => ({
    type: CUSTOMER_PHONE_SAVE_REQUEST,
    payload: {customerPhone}
});
export const saveCustomerPhoneSuccess = customerPhoneList => ({
    type: CUSTOMER_PHONE_SAVE,
    payload: customerPhoneList
});
export const saveCustomerPhoneFailure = error => ({
    type: CUSTOMER_PHONE_SAVE_ERROR,
    payload: error
});
export const deleteCustomerPhone = customerPhoneId => ({
    type: CUSTOMER_PHONE_DELETE_REQUEST,
    payload: {customerPhoneId}
});
export const deleteCustomerPhoneSuccess = customerPhoneList => ({
    type: CUSTOMER_PHONE_DELETE,
    payload: customerPhoneList
});
export const deleteCustomerPhoneFailure = error => ({
    type: CUSTOMER_PHONE_DELETE_ERROR,
    payload: error
});
export const saveCustomerAddress = customerAddress => ({
    type: CUSTOMER_ADDRESS_SAVE_REQUEST,
    payload: {customerAddress}
});
export const saveCustomerAddressSuccess = customerAddressList => ({
    type: CUSTOMER_ADDRESS_SAVE,
    payload: customerAddressList
});
export const saveCustomerAddressFailure = error => ({
    type: CUSTOMER_ADDRESS_SAVE_ERROR,
    payload: error
});
export const deleteCustomerAddress = customerAddressId => ({
    type: CUSTOMER_ADDRESS_DELETE_REQUEST,
    payload: {customerAddressId}
});
export const deleteCustomerAddressSuccess = customerAddressList => ({
    type: CUSTOMER_ADDRESS_DELETE,
    payload: customerAddressList
});
export const deleteCustomerAddressFailure = error => ({
    type: CUSTOMER_ADDRESS_DELETE_ERROR,
    payload: error
});
