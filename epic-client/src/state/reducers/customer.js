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
    CUSTOMER_CLEAR_STATE, CUSTOMER_PAGE
} from "../actions/customer";
import {updateCustomerBasic} from "../../helpers/customer";
import {USER_NOT_VALIDATED} from "../actions/user";
import {CLEAR_ALL_STATE} from "../actions/application";


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
        case USER_NOT_VALIDATED:
            return {
                ...state,
                isLoading: false
            };
        case CUSTOMER_REMOVE:
            return {
                ...state,
                customer: {}
            };
        case CUSTOMER_PAGE:
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
        case CUSTOMER_DELETE_REQUESTED:
            return {
                ...state,
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
                error: action.payload,
                isLoading: false,
                customers: [],
                count: 0,
                previous: '',
                next: '',
            };

        case CUSTOMER_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false,
                customer: {},
                totalPages: 0
            };
        case CUSTOMER_SAVE_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };

        case CUSTOMER_CREATE_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };
        case CUSTOMER_DELETE_ERROR:
            return {
                ...state,
                isLoading: false
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
                isLoading: !state.isLoading,
                customer: action.payload
            };
        case CUSTOMER_CREATE:
            return {
                ...state,
                isLoading: !state.isLoading,
                customer: action.payload
            };
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
        default:
            return state;
    }
};


export default customer;