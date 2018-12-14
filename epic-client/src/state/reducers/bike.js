import {CLEAR_ALL_STATE} from "../actions/application";
import {
    CLEAR_FRAME, FRAME_ARCHIVE_ERROR,
    FRAME_LIST_ERROR,
    FRAME_LIST_OK,
    FRAME_LIST_REQUESTED,
    FRAME_SAVE_ERROR,
    FRAME_SAVE_OK,
    FRAME_SAVE_REQUESTED, FRAME_UPLOAD_ERROR, FRAME_UPLOAD_OK, FRAME_UPLOAD_REQUESTED
} from "../actions/bike";
import {removeKey} from "../../helpers/utils";

const initialState = {
    isLoading: false
};

const bike = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_ALL_STATE:
        case CLEAR_FRAME:
            return initialState;
        case FRAME_SAVE_REQUESTED:
        case FRAME_UPLOAD_REQUESTED:
            return {
                ...state,
                frame: action.payload.frame,
                isLoading: true,
            };
        case FRAME_SAVE_OK:
        case FRAME_UPLOAD_OK:
            return {
                ...state,
                frame: action.payload,
                isLoading: false,
            };
        case FRAME_LIST_REQUESTED:
            return {
                ...state,
                isLoading: true,
            };
        case FRAME_LIST_OK:
            return {
                ...state,
                frames: action.payload,
                isLoading: false,
            };
        case FRAME_SAVE_ERROR:
        case FRAME_UPLOAD_ERROR:
        case FRAME_LIST_ERROR:
        case FRAME_ARCHIVE_ERROR:
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default bike;