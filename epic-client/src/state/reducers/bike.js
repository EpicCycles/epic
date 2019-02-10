import {CLEAR_ALL_STATE} from "../actions/application";
import {
    BIKE_ADD_PART_ERROR,
    BIKE_ADD_PART_OK,
    BIKE_ADD_PART_REQUESTED,
    BIKE_DELETE_ERROR, BIKE_DELETE_PROCESSED,
    BIKE_PART_DELETE_ERROR,
    BIKE_PART_DELETE_OK,
    BIKE_PART_DELETE_REQUESTED,
    BIKE_PART_SAVE_ERROR,
    BIKE_PART_SAVE_OK,
    BIKE_PART_SAVE_REQUESTED,
    BIKE_REVIEW_BIKE,
    BIKE_REVIEW_REQUESTED,
    BIKE_SAVE_ERROR,
    BIKE_SAVE_OK,
    BIKE_SAVE_REQUESTED,
    CLEAR_FRAME,
    FRAME_ARCHIVE_ERROR,
    FRAME_DELETE_ERROR,
    FRAME_LIST_ERROR,
    FRAME_LIST_OK,
    FRAME_LIST_REQUESTED,
    FRAME_SAVE_ERROR,
    FRAME_SAVE_OK,
    FRAME_SAVE_REQUESTED,
    FRAME_UPLOAD_ERROR,
    FRAME_UPLOAD_OK,
    FRAME_UPLOAD_REQUESTED
} from "../actions/bike";
import {USER_LOGOUT} from "../actions/user";
import {updateObjectInArray} from "../../helpers/utils";
import {findNextBikeToReview, removeIdFromReviewList} from "../helpers/bike";

const initialState = {
    isLoading: false
};

const bike = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_ALL_STATE:
        case CLEAR_FRAME:
        case USER_LOGOUT:
            return initialState;
        case BIKE_DELETE_PROCESSED:
            return {
                ...state,
                bikes: state.bikes.filter(bike => bike.id !== bikeId),
                bikeParts: state.bikeParts.filter(bikePart => bikePart.bike !== bikeId),
                bikeId: findNextBikeToReview(state.bikeReviewList, bikeId),
                bikeReviewList: removeIdFromReviewList(state.bikeReviewList, bikeId),
            };
        case BIKE_SAVE_REQUESTED:
        case BIKE_PART_DELETE_REQUESTED:
        case BIKE_PART_SAVE_REQUESTED:
        case BIKE_ADD_PART_REQUESTED:
            return {
                ...state,
                isLoading: true
            };
        case BIKE_SAVE_OK:
            return {
                ...state,
                bikes: updateObjectInArray(state.bikes, action.payload.bike, action.payload.bikeId),
                isLoading: false
            };
        case BIKE_PART_SAVE_OK:
        case BIKE_PART_DELETE_OK:
        case BIKE_ADD_PART_OK:
            return {
                ...state,
                parts: action.payload.parts,
                isLoading: false
            };
        case BIKE_REVIEW_REQUESTED:
            // state should just be the list of bikes
            return {
                ...state,
                bikeReviewList: action.payload.bikeReviewList,
            };
        case BIKE_REVIEW_BIKE:
            return {
                ...state,
                bikeId: action.payload.bikeId,
                // bike: {},
                // parts: [],
                // isLoading: true
            };
        case FRAME_SAVE_REQUESTED:
        case FRAME_UPLOAD_REQUESTED:
            return {
                ...state,
                frame: action.payload.frame,
                isLoading: true,
            };
        case FRAME_SAVE_OK:
            return {
                ...state,
                frame: action.payload,
                isLoading: false,
            };
        case FRAME_UPLOAD_OK:
            return {
                ...state,
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
                frames: action.payload.frames,
                bikes: action.payload.bikes,
                bikeParts: action.payload.bikeParts,
                isLoading: false,
            };
        case BIKE_DELETE_ERROR:
        case BIKE_SAVE_ERROR:
        case BIKE_ADD_PART_ERROR:
        case BIKE_PART_SAVE_ERROR:
        case BIKE_PART_DELETE_ERROR:
        case FRAME_SAVE_ERROR:
        case FRAME_UPLOAD_ERROR:
        case FRAME_LIST_ERROR:
        case FRAME_ARCHIVE_ERROR:
        case FRAME_DELETE_ERROR:
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default bike;