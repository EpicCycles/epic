import {CLEAR_ALL_STATE} from "../actions/application";
import {
    PART_CLEAR, PART_DELETE, PART_LIST, PART_SAVE, PART_UPLOAD,
    UPDATE_PARTS,
    UPDATE_SUPPLIER_PRODUCTS
} from "../actions/part";
import {USER_LOGOUT} from "../actions/user";
import {
    BIKE_ADD_PART,
    BIKE_PART_DELETE,
    BIKE_PART_SAVE,
    GET_BIKE_PARTS
} from "../actions/bike";
import {addItemsToArray} from "../../helpers/utils";
import {CREATE_QUOTE} from "../actions/quote";

const initialState = {
    isLoading: false
};
const part = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_ALL_STATE:
        case PART_CLEAR:
        case USER_LOGOUT:
            return initialState;
        case `${PART_SAVE}_REQUESTED`:
        case `${PART_DELETE}_REQUESTED`:
        case `${PART_UPLOAD}_REQUESTED`:
        case `${PART_LIST}_REQUESTED`:
            return {
                ...state,
                isLoading: true,
            };
        case `${PART_DELETE}_ERROR`:
        case `${PART_UPLOAD}_ERROR`:
        case `${PART_SAVE}_ERROR`:
        case `${PART_LIST}_ERROR`:
            return {
                ...state,
                isLoading: false,
            };
        case `${PART_UPLOAD}_OK`:
            return {
                ...state,
                isLoading: false,
                parts: action.payload.parts,
                supplierProducts: action.payload.supplierProducts,
            };
        case `${PART_LIST}_OK`:
        case `${BIKE_PART_SAVE}_OK`:
        case `${BIKE_PART_DELETE}_OK`:
        case `${BIKE_ADD_PART}_OK`:
        case  `${GET_BIKE_PARTS}_OK`:
        case `${CREATE_QUOTE}_OK`:
            return {
                ...state,
                isLoading: false,
                parts: addItemsToArray(state.parts, action.payload.parts),
                supplierProducts: addItemsToArray(state.supplierProducts, action.payload.supplierProducts)
            };
        case UPDATE_PARTS:
            return {
                ...state,
                parts: action.payload,
            };
        case UPDATE_SUPPLIER_PRODUCTS:
            return {
                ...state,
                supplierProducts: action.payload,
            };
        case `${PART_SAVE}_OK`:
            return {
                ...state,
                isLoading: false,
                part: action.payload.part,
            };
        case `${PART_DELETE}_OK`:
            return {
                ...state,
                isLoading: false,
                part: undefined,
            };
        default:
            return state;
    }
};
export default part;