import {CLEAR_ALL_STATE} from "../actions/application";
import {
    BRANDS,
    BRANDS_AND_SUPPLIERS, BRANDS_SAVE,
    BRANDS_UPDATE, SUPPLIER_DELETE, SUPPLIER_SAVE,
} from "../actions/core";
import {USER_LOGIN, USER_LOGOUT} from "../actions/user";

const initialState = {
    isLoading: false,
};
// this seemd to be the bit that is in reducers in loyalty code
const core = (state = initialState, action) => {
    switch (action.type) {
        case `${USER_LOGIN}_REQUESTED`:
        case USER_LOGOUT:
            return initialState;
        case `${SUPPLIER_SAVE}_REQUESTED`:
        case `${SUPPLIER_DELETE}_REQUESTED`:
            return {
                ...state,
                isLoading: true,
            };
        case `${BRANDS_AND_SUPPLIERS}_REQUESTED`:
            return {
                ...state,
                isLoading: true,
                brands: [],
                suppliers: [],
            };
        case `${BRANDS}_REQUESTED`:
            return {
                ...state,
                isLoading: true,
                brands: [],
            };
        case `${BRANDS_SAVE}_REQUESTED`:
            return {
                ...state,
                isLoading: true,
            };

        case `${BRANDS_AND_SUPPLIERS}_ERROR`:
        case `${BRANDS}_ERROR`:
        case `${BRANDS_SAVE}_ERROR`:
        case `${SUPPLIER_SAVE}_ERROR`:
        case `${SUPPLIER_DELETE}_ERROR`:
            return {
                ...state,
                isLoading: false,
            };

        case `${BRANDS_SAVE}_OK`:
        case BRANDS_UPDATE:
            return {
                ...state,
                brands: action.payload,
                isLoading: false,
            };

        case `${BRANDS_AND_SUPPLIERS}_OK`:
            return {
                ...state,
                brands: action.payload.brands,
                suppliers: action.payload.suppliers,
                isLoading: false,
            };
        case `${BRANDS}_OK`:
            return {
                ...state,
                brands: action.payload.brands,
                isLoading: false,
            };
        case `${SUPPLIER_SAVE}_OK`:
        case `${SUPPLIER_DELETE}_OK`:
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