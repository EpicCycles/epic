import {CLEAR_ALL_STATE} from "../actions/application";
import {
    BRANDS_AND_SUPPLIERS_ERROR,
    BRANDS_AND_SUPPLIERS_OK,
    BRANDS_AND_SUPPLIERS_REQUESTED,
    BRANDS_ERROR,
    BRANDS_OK,
    BRANDS_REQUESTED,
    BRANDS_SAVE_ERROR,
    BRANDS_SAVE_OK,
    BRANDS_SAVE_REQUESTED,
    BRANDS_UPDATE,
    SUPPLIER_DELETE_ERROR,
    SUPPLIER_DELETE_OK,
    SUPPLIER_DELETE_REQUESTED,
    SUPPLIER_SAVE_ERROR,
    SUPPLIER_SAVE_OK,
    SUPPLIER_SAVE_REQUESTED
} from "../actions/core";
import {USER_LOGIN_REQUESTED, USER_LOGOUT} from "../actions/user";

const initialState = {
    isLoading: false,
};
// this seemd to be the bit that is in reducers in loyalty code
const core = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_ALL_STATE:
        case USER_LOGIN_REQUESTED:
        case USER_LOGOUT:
            return initialState;
        case SUPPLIER_SAVE_REQUESTED:
        case SUPPLIER_DELETE_REQUESTED:
            return {
                ...state,
                isLoading: true,
            };
        case BRANDS_AND_SUPPLIERS_REQUESTED:
            return {
                ...state,
                isLoading: true,
                brands: [],
                suppliers: [],
            };
        case BRANDS_REQUESTED:
            return {
                ...state,
                isLoading: true,
                brands: [],
            };
        case BRANDS_SAVE_REQUESTED:
            return {
                ...state,
                isLoading: true,
            };

        case BRANDS_AND_SUPPLIERS_ERROR:
        case BRANDS_ERROR:
        case BRANDS_SAVE_ERROR:
        case SUPPLIER_SAVE_ERROR:
        case SUPPLIER_DELETE_ERROR:
            return {
                ...state,
                isLoading: false,
            };

        case BRANDS_SAVE_OK:
        case BRANDS_UPDATE:
            return {
                ...state,
                brands: action.payload,
                isLoading: false,
            };

        case BRANDS_AND_SUPPLIERS_OK:
            return {
                ...state,
                brands: action.payload.brands,
                suppliers: action.payload.suppliers,
                isLoading: false,
            };
        case BRANDS_OK:
            return {
                ...state,
                brands: action.payload.brands,
                isLoading: false,
            };
        case SUPPLIER_SAVE_OK:
        case SUPPLIER_DELETE_OK:
            return {
                ...state,
                suppliers: action.payload,
                isLoading: false,
            };
        default:
            return state;
    }
};


export default core;