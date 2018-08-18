export const CUSTOMER_LIST_REQUESTED = 'customer/CUSTOMER_LIST_REQUESTED';
export const CUSTOMER_LIST_ERROR = 'customer/CUSTOMER_LIST_ERROR';
export const CUSTOMER_LIST = 'customer/CUSTOMER_LIST';
export const CUSTOMER_PAGE = 'customer/CUSTOMER_PAGE';
export const CUSTOMER_REQUESTED = 'customer/CUSTOMER_REQUESTED';
export const CUSTOMER_ERROR = 'customer/CUSTOMER_ERROR';
export const CUSTOMER = 'customer/CUSTOMER';
export const CUSTOMER_REMOVE_ERROR = 'customer/CUSTOMER_REMOVE_ERROR';
export const CUSTOMER_ACCEPT_CHANGES = 'customer/CUSTOMER_ACCEPT_CHANGES'

export const acceptCustomerChanges = (first_name, last_name, email) => ({
    type: CUSTOMER_ACCEPT_CHANGES,
    payload: {first_name, last_name, email}
});
export const removeCustomerError = () => ({
    type: CUSTOMER_REMOVE_ERROR
});
export const getCustomerListPage = requestedPage => ({
    type: CUSTOMER_PAGE,
    payload: requestedPage
});

export const getCustomerList =  (firstName, lastName, email)  => ({
    type: CUSTOMER_LIST_REQUESTED,
    payload: {firstName, lastName, email}
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
    payload: customerId
});

export const getCustomerSuccess = customer => ({
    type: CUSTOMER,
    payload: customer
});

export const getCustomerFailure = error => ({
    type: CUSTOMER_ERROR,
    payload: error
});
