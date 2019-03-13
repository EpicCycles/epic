import {
    CUSTOMER,
    CUSTOMER_CREATE,
    CUSTOMER_DELETE,
    CUSTOMER_LIST,
    CUSTOMER_SAVE,
    CUSTOMER_CLEAR_STATE,
    CUSTOMER_PAGE,
    CUSTOMER_PHONE_DELETE, CUSTOMER_PHONE_SAVE,
    CUSTOMER_ADDRESS_DELETE, CUSTOMER_ADDRESS_SAVE,
} from "../actions/customer";
import {CLEAR_ALL_STATE} from "../actions/application";
import {USER_LOGOUT, USER_NOT_VALIDATED} from "../actions/user";
import {addItemsToArray, removeItemFromArray, updateObjectInArray} from "../../helpers/utils";

const initialState = {
    isLoading: false,
    customers: [],
    count: 0,
    previous: '',
    next: '',
    searchParams: {
        firstName: "",
        lastName: "",
        email: ""
    },
};

// this seemd to be the bit that is in reducers in loyalty code
const customer = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_ALL_STATE:
        case CUSTOMER_CLEAR_STATE:
        case USER_LOGOUT:
            return initialState;

        case CUSTOMER_PAGE:
        case `${CUSTOMER_DELETE}_REQUESTED`:
        case `${CUSTOMER_ADDRESS_DELETE}_REQUEST`:
        case `${CUSTOMER_PHONE_DELETE}_REQUEST`:
        case `${CUSTOMER_PHONE_SAVE}_REQUEST`:
        case `${CUSTOMER_ADDRESS_SAVE}_REQUEST`:
            return {
                ...state,
                isLoading: true,
            };
        case `${CUSTOMER_LIST}_REQUESTED`:
            return {
                ...state,
                searchParams: {
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    email: action.payload.email
                },
                isLoading: true,
                customers: [],
                count: 0,
                previous: '',
                next: '',
            };
        case `${CUSTOMER_CREATE}_REQUESTED`:
            return {
                ...state,
                isLoading: true,
            };
        case `${CUSTOMER_SAVE}_REQUESTED`:
            return {
                ...state,
                isLoading: true,
            };
        case `${CUSTOMER}_REQUESTED`:
            return {
                ...state,
                customerId: action.payload.customerId,
                isLoading: true,
            };

        case `${CUSTOMER_LIST}_ERROR`:
            return {
                ...state,
                isLoading: false,
                customers: [],
                count: 0,
                previous: '',
                next: '',
            };

        case `${CUSTOMER}_ERROR`:
            return {
                ...state,
                isLoading: false,
                customer: {},
                totalPages: 0
            };
        case `${CUSTOMER_SAVE}_ERROR`:
        case `${CUSTOMER_CREATE}_ERROR`:
        case `${CUSTOMER_DELETE}_ERROR`:
        case `${CUSTOMER_PHONE_DELETE}_ERROR`:
        case `${CUSTOMER_ADDRESS_DELETE}_ERROR`:
        case USER_NOT_VALIDATED:
            return {
                ...state,
                isLoading: false
            };
        case `${CUSTOMER_ADDRESS_SAVE}_ERROR`:
            return {
                ...state,
                isLoading: false,
                addresses: updateObjectInArray(state.addresses, action.payload.customerAddress)
            };
        case `${CUSTOMER_PHONE_SAVE}_ERROR`:
            return {
                ...state,
                isLoading: false,
                phones: updateObjectInArray(state.phones,action.payload.customerPhone)
            };
        case CUSTOMER_LIST:
            return {
                ...state,
                customers: action.payload.customers,
                count: action.payload.count,
                previous: action.payload.previous,
                next: action.payload.next,
                isLoading: !state.isLoading,
            };
        case CUSTOMER:
            return {
                ...state,
                isLoading: false,
                customerId: action.payload.customer.id,
                customers: addItemsToArray(state.customers, [action.payload.customer]),
                addresses: action.payload.addresses,
                phones: action.payload.phones,
            };
        case CUSTOMER_CREATE:
        case CUSTOMER_SAVE:
            return {
                ...state,
                isLoading: false,
                customerId: action.payload.customer.id,
                customers: addItemsToArray(state.customers, [action.payload.customer])
            };
        case CUSTOMER_DELETE:
            return {
                ...state,
                isLoading: false,
                customers: removeItemFromArray(state.customers, action.payload.customerId),
                customerId: undefined,
            };
        case CUSTOMER_PHONE_DELETE:
        case CUSTOMER_PHONE_SAVE:
            return {
                ...state,
                isLoading: false,
                phones: action.payload
            };

        case CUSTOMER_ADDRESS_DELETE:
        case CUSTOMER_ADDRESS_SAVE:
            return {
                ...state,
                isLoading: false,
                addresses: action.payload
            };
        default:
            return state;
    }
};


export default customer;