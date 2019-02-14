import {CLEAR_ALL_STATE} from "../actions/application";
import {
    PART_CLEAR,
    PART_DELETE_ERROR,
    PART_DELETE_OK,
    PART_DELETE_REQUESTED,
    PART_LIST_ERROR,
    PART_LIST_OK,
    PART_LIST_REQUESTED,
    PART_SAVE_ERROR,
    PART_SAVE_OK,
    PART_SAVE_REQUESTED,
    PART_UPLOAD_ERROR,
    PART_UPLOAD_OK,
    PART_UPLOAD_REQUESTED,
    UPDATE_PARTS,
    UPDATE_SUPPLIER_PRODUCTS
} from "../actions/part";
import {USER_LOGOUT} from "../actions/user";
import {BIKE_ADD_PART_OK, BIKE_PART_DELETE_OK, BIKE_PART_SAVE_OK, FRAME_LIST_OK} from "../actions/bike";
import {addItemsToArray} from "../../helpers/utils";

const initialState = {
    isLoading: false
};
const part = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_ALL_STATE:
        case PART_CLEAR:
        case USER_LOGOUT:
            return initialState;
        case PART_SAVE_REQUESTED:
        case PART_DELETE_REQUESTED:
        case PART_UPLOAD_REQUESTED:
        case PART_LIST_REQUESTED:
            return {
                ...state,
                isLoading: true,
            };
        case PART_DELETE_ERROR:
        case PART_UPLOAD_ERROR:
        case PART_SAVE_ERROR:
        case PART_LIST_ERROR:
            return {
                ...state,
                isLoading: false,
            };
        case PART_UPLOAD_OK:
        case PART_LIST_OK:
            return {
                ...state,
                isLoading: false,
                parts: action.payload.parts,
                supplierProducts: action.payload.supplierProducts,
            };
        case FRAME_LIST_OK:
        case BIKE_PART_SAVE_OK:
        case BIKE_PART_DELETE_OK:
        case BIKE_ADD_PART_OK:
            return {
                ...state,
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
        case PART_SAVE_OK:
            return {
                ...state,
                isLoading: false,
                part: action.payload.part,
            };
        case PART_DELETE_OK:
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