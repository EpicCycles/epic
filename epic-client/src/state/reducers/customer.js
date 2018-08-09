import {
    CUSTOMER,
    CUSTOMER_LIST,
    CUSTOMER_LIST_ERROR,
    CUSTOMER_LIST_REQUESTED,
    CUSTOMER_ERROR,
    CUSTOMER_REQUESTED, CUSTOMER_REMOVE_ERROR, CUSTOMER_ACCEPT_CHANGES
} from "../actions/customer";
import {updateCustomerBasic} from "../../helpers/customer";


const initialState = {
    count: 0,
    isLoading: false,
    customers: [],
    searchFirstName: "",
    searchLastName: "",
    page: 1,
    perPage: 20
};

// this seemd to be the bit that is in reducers in loyalty code
const customer = (state = initialState, action) => {
    switch (action.type) {
        case CUSTOMER_ACCEPT_CHANGES:
            return {
                ...state,
                error: "",
                customer: updateCustomerBasic(state.customer, action.payload)
            };
        case CUSTOMER_REMOVE_ERROR:
            return {
                ...state,
                error: ""
            };
        case CUSTOMER_LIST_REQUESTED:
            return {
                ...state,
                error: "",
                isLoading: true,
                customers: [],
                totalPages: 0
            };
        case CUSTOMER_REQUESTED:
            return {
                ...state,
                error: "",
                customer: {},
                isLoading: true,
            };

        case CUSTOMER_LIST_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false,
                customers: [],
                totalPages: 0
            };

        case CUSTOMER_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false,
                customer: {},
                totalPages: 0
            };
        case CUSTOMER_LIST:
            return {
                ...state,
                customers: action.payload,
                error: "",
                isLoading: !state.isLoading,
                page: 1,
                totalPages: Math.floor(action.payload.length / state.perPage) + 1
            };
        case CUSTOMER:
            return {
                ...state,
                error: "",
                isLoading: !state.isLoading,
                customer: action.payload
            };

        default:
            return state;
    }
};


export default customer;