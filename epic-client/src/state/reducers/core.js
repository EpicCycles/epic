import {CLEAR_ALL_STATE} from "../actions/application";
import {
    BRANDS_AND_SUPPLIERS_ERROR,
    BRANDS_AND_SUPPLIERS_OK,
    BRANDS_AND_SUPPLIERS_REQUESTED,
    BRANDS_SAVE_ERROR,
    BRANDS_SAVE_OK,
    BRANDS_SAVE_REQUESTED, BRANDS_UPDATE
} from "../actions/core";

const initialState = {
    isLoading: false,
};
// this seemd to be the bit that is in reducers in loyalty code
const core = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_ALL_STATE:
            return initialState;
        case BRANDS_AND_SUPPLIERS_REQUESTED:
            return {
                ...state,
                isLoading: true,
                brands: [],
                suppliers: [],
            };
        case BRANDS_SAVE_REQUESTED:
            return {
                ...state,
                brands: action.payload.brands,
                isLoading: true,
            };

        case BRANDS_AND_SUPPLIERS_ERROR:
        case BRANDS_SAVE_ERROR:
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
        default:
            return state;
    }
};


export default core;