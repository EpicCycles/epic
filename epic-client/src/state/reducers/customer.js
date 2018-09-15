import {
    CUSTOMER,
    CUSTOMER_CREATE,
    CUSTOMER_CREATE_ERROR,
    CUSTOMER_CREATE_REQUESTED,
    CUSTOMER_DELETE,
    CUSTOMER_DELETE_ERROR,
    CUSTOMER_DELETE_REQUESTED,
    CUSTOMER_ERROR,
    CUSTOMER_LIST,
    CUSTOMER_LIST_ERROR,
    CUSTOMER_LIST_REQUESTED,
    CUSTOMER_REMOVE,
    CUSTOMER_REQUESTED,
    CUSTOMER_SAVE,
    CUSTOMER_SAVE_ERROR,
    CUSTOMER_SAVE_REQUESTED,
    CUSTOMER_CLEAR_STATE,
    CUSTOMER_PAGE,
    CUSTOMER_PHONE_DELETE_REQUEST,
    CUSTOMER_PHONE_SAVE_REQUEST,
    CUSTOMER_PHONE_DELETE, CUSTOMER_PHONE_SAVE, CUSTOMER_PHONE_SAVE_ERROR, CUSTOMER_PHONE_DELETE_ERROR,
    CUSTOMER_ADDRESS_DELETE_REQUEST,
    CUSTOMER_ADDRESS_SAVE_REQUEST,
    CUSTOMER_ADDRESS_DELETE, CUSTOMER_ADDRESS_SAVE, CUSTOMER_ADDRESS_SAVE_ERROR, CUSTOMER_ADDRESS_DELETE_ERROR
} from "../actions/customer";
import {
    updateCustomerBasic,
    updateCustomerPhoneList,
    updateCustomerAddressList,
    customerAddErrorForPhone, customerAddErrorForAddress
} from "../../helpers/customer";
import {CLEAR_ALL_STATE} from "../actions/application";
import {USER_NOT_VALIDATED} from "../actions/user";

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
            return initialState;
        case CUSTOMER_REMOVE:
            return {
                ...state,
                customer: {}
            };
        case CUSTOMER_PAGE:
        case CUSTOMER_DELETE_REQUESTED:
        case CUSTOMER_ADDRESS_DELETE_REQUEST:
        case CUSTOMER_PHONE_DELETE_REQUEST:
        case CUSTOMER_PHONE_SAVE_REQUEST:
        case CUSTOMER_ADDRESS_SAVE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case CUSTOMER_LIST_REQUESTED:
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
        case CUSTOMER_CREATE_REQUESTED:
            return {
                ...state,
                customer: updateCustomerBasic(state.customer, action.payload.customer),
                isLoading: true,
            };
        case CUSTOMER_SAVE_REQUESTED:
            return {
                ...state,
                customer: updateCustomerBasic(state.customer, action.payload.customer),
                isLoading: true,
            };
        case CUSTOMER_REQUESTED:
            return {
                ...state,
                customer: {},
                isLoading: true,
            };

        case CUSTOMER_LIST_ERROR:
            return {
                ...state,
                isLoading: false,
                customers: [],
                count: 0,
                previous: '',
                next: '',
            };

        case CUSTOMER_ERROR:
            return {
                ...state,
                isLoading: false,
                customer: {},
                totalPages: 0
            };
        case CUSTOMER_SAVE_ERROR:
        case CUSTOMER_CREATE_ERROR:
        case CUSTOMER_DELETE_ERROR:
        case CUSTOMER_PHONE_DELETE_ERROR:
        case CUSTOMER_ADDRESS_DELETE_ERROR:
        case USER_NOT_VALIDATED:
            return {
                ...state,
                isLoading: false
            };
        case CUSTOMER_ADDRESS_SAVE_ERROR:
            return {
                ...state,
                isLoading: false,
                customer: customerAddErrorForAddress(state.customer, action.payload.customerAddress)
            };
        case CUSTOMER_PHONE_SAVE_ERROR:
            return {
                ...state,
                isLoading: false,
                customer: customerAddErrorForPhone(state.customer, action.payload.customerPhone)
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
        case CUSTOMER_CREATE:
        case CUSTOMER_SAVE:
            return {
                ...state,
                isLoading: false,
                customer: action.payload
            };
        case CUSTOMER_DELETE:
            return {
                ...state,
                isLoading: false,
                customer: {}
            };
        case CUSTOMER_PHONE_DELETE:
        case CUSTOMER_PHONE_SAVE:
            return {
                ...state,
                isLoading: false,
                customer: updateCustomerPhoneList(state.customer, action.payload)
            };
        case CUSTOMER_ADDRESS_DELETE:
        case CUSTOMER_ADDRESS_SAVE:
            return {
                ...state,
                isLoading: false,
                customer: updateCustomerAddressList(state.customer, action.payload)
            };
        default:
            return state;
    }
};


export default customer;