import {
    PART_CLEAR,
    PART_DELETE,
    PART_LIST,
    PART_SAVE,
    PART_UPLOAD,
    UPDATE_PARTS,
    UPDATE_SUPPLIER_PRODUCTS
} from "../actions/part";
import {USER_LOGOUT} from "../actions/user";
import {BIKE_ADD_PART, BIKE_PART_DELETE, BIKE_PART_SAVE, GET_BIKE_PARTS} from "../actions/bike";
import {addItemsToArray, removeItemFromArray} from "../../helpers/utils";
import {COPY_QUOTE, CREATE_QUOTE, FIND_QUOTES, GET_QUOTE, UPDATE_QUOTE} from "../actions/quote";
import {STORAGE_PARTS, STORAGE_SUPPLIER_PRODUCTS} from "../../helpers/constants";
import {setLocalStorage} from "../helpers/localStorage";

const initialState = {
    isLoading: false
};
const part = (state = initialState, action) => {
    let parts, supplierProducts;
    switch (action.type) {
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
        case `${PART_LIST}_OK`:
        case `${BIKE_PART_SAVE}_OK`:
        case `${BIKE_PART_DELETE}_OK`:
        case `${BIKE_ADD_PART}_OK`:
        case  `${GET_BIKE_PARTS}_OK`:
        case `${CREATE_QUOTE}_OK`:
        case `${GET_QUOTE}_OK`:
        case `${COPY_QUOTE}_OK`:
        case `${UPDATE_QUOTE}_OK`:
        case `${FIND_QUOTES}_OK`:
            parts = addItemsToArray(state.parts, action.payload.parts);
            supplierProducts = addItemsToArray(state.supplierProducts, action.payload.supplierProducts);

            setLocalStorage(STORAGE_PARTS, parts);
            setLocalStorage(STORAGE_SUPPLIER_PRODUCTS, parts);

            return {
                ...state,
                isLoading: false,
                parts,
                supplierProducts
            };
        case UPDATE_PARTS:
            parts = addItemsToArray(state.parts, action.payload.parts);
            setLocalStorage(STORAGE_PARTS, parts);
            return {
                ...state,
                parts
            };
        case UPDATE_SUPPLIER_PRODUCTS:
            supplierProducts = addItemsToArray(state.supplierProducts, action.payload.supplierProducts);
            setLocalStorage(STORAGE_SUPPLIER_PRODUCTS, parts);
            return {
                ...state,
                supplierProducts
            };
        case `${PART_SAVE}_OK`:
            parts = addItemsToArray(state.parts, action.payload.parts);
            setLocalStorage(STORAGE_PARTS, parts);
            return {
                ...state,
                parts,
                part: action.payload.part,
            };
        case `${PART_DELETE}_OK`:
            parts = removeItemFromArray(state.parts, action.payload.partId);
            setLocalStorage(STORAGE_PARTS, parts);
            return {
                ...state,
                isLoading: false,
                part: undefined,
                parts
            };
        default:
            return state;
    }
};
export default part;