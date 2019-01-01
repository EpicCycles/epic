import {CLEAR_ALL_STATE} from "../actions/application";
import {
    PART_CLEAR,
    PART_DELETE_ERROR,
    PART_DELETE_REQUESTED,
    PART_LIST_ERROR,
    PART_LIST_OK,
    PART_LIST_REQUESTED,
    PART_SAVE_ERROR,
    PART_SAVE_OK,
    PART_SAVE_REQUESTED,
    PART_UPLOAD_ERROR,
    PART_UPLOAD_OK,
    PART_UPLOAD_REQUESTED
} from "../actions/part";

const initialState = {
    isLoading: false
};
const part = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_ALL_STATE:
        case PART_CLEAR:
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