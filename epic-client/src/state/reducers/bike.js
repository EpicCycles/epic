import {USER_LOGOUT} from "../actions/user";
import {updateObjectInArray} from "../../helpers/utils";
import {findNextBikeToReview, removeIdFromReviewList, replaceBikeParts} from "../helpers/bike";
import {CLEAR_ALL_STATE} from "../actions/application";
import {
    BIKE_ADD_PART,
    BIKE_DELETE,
    BIKE_PART_DELETE,
    BIKE_PART_SAVE,
    BIKE_REVIEW_BIKE,
    BIKE_REVIEW_START,
    BIKE_SAVE,
    CLEAR_FRAME,
    FRAME_ARCHIVE,
    FRAME_DELETE,
    FRAME_LIST,
    FRAME_SAVE,
    FRAME_UPLOAD,
    GET_BIKE_PARTS,
} from "../actions/bike";
import {CREATE_QUOTE, FIND_QUOTES, GET_QUOTE, UPDATE_QUOTE, COPY_QUOTE} from "../actions/quote";
import {CUSTOMER} from "../actions/customer";

const initialState = {
    isLoading: false
};

const bike = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_ALL_STATE:
        case CLEAR_FRAME:
        case USER_LOGOUT:
            return initialState;
        case `${BIKE_DELETE}_OK`:
            return {
                ...state,
                bikes: state.bikes.filter(bike => bike.id !== state.bikeId),
                bikeParts: state.bikeParts.filter(bikePart => bikePart.bike !== state.bikeId),
                bikeId: findNextBikeToReview(state.bikeReviewList, state.bikeId),
                bikeReviewList: removeIdFromReviewList(state.bikeReviewList, state.bikeId),
            };
        case `${BIKE_SAVE}_REQUESTED`:
        case `${BIKE_PART_DELETE}_REQUESTED`:
        case `${BIKE_PART_SAVE}_REQUESTED`:
        case `${BIKE_ADD_PART}_REQUESTED`:
        case  `${GET_BIKE_PARTS}_REQUESTED`:
            return {
                ...state,
                isLoading: true
            };
        case `${BIKE_SAVE}_OK`:
            return {
                ...state,
                bikes: updateObjectInArray(state.bikes, action.payload.bike, action.payload.bikeId),
                isLoading: false
            };
        case `${BIKE_PART_SAVE}_OK`:
        case `${BIKE_PART_DELETE}_OK`:
        case `${BIKE_ADD_PART}_OK`:
        case  `${GET_BIKE_PARTS}_OK`:
            return {
                ...state,
                bikeParts: replaceBikeParts(state.bikeId, action.payload.bikeParts, state.bikeParts),
                isLoading: false
            };
        case BIKE_REVIEW_START:
            // state should just be the list of bikes
            return {
                ...state,
                bikeReviewList: action.payload.bikeReviewList,
                bikeId: action.payload.bikeReviewList.length && action.payload.bikeReviewList[0],
            };
        case BIKE_REVIEW_BIKE:
            return {
                ...state,
                bikeId: action.payload.bikeId,
                // bike: {},
                // parts: [],
                // isLoading: true
            };
        case `${FRAME_SAVE}_REQUESTED`:
        case `${FRAME_UPLOAD}_REQUESTED`:
            return {
                ...state,
                frame: action.payload.frame,
                isLoading: true,
            };
        case `${FRAME_SAVE}_OK`:
            return {
                ...state,
                frame: action.payload,
                isLoading: false,
            };
        case `${FRAME_UPLOAD}_OK`:
            return {
                ...state,
                isLoading: false,
            };
        case `${FRAME_LIST}_REQUESTED`:
            return {
                ...state,
                isLoading: true,
            };
        case `${FRAME_LIST}_OK`:
        case `${CREATE_QUOTE}_OK`:
        case `${GET_QUOTE}_OK`:
        case `${COPY_QUOTE}_OK`:
        case `${UPDATE_QUOTE}_OK`:
            return {
                ...state,
                frames: action.payload.frames,
                bikes: action.payload.bikes,
                bikeParts: action.payload.bikeParts,
                isLoading: false,
            };
        case `${FIND_QUOTES}_OK`:
        case CUSTOMER:
            return {
                ...state,
                frames: action.payload.frames,
                bikes: action.payload.bikes,
            };
        case `${BIKE_DELETE}_ERROR`:
        case `${BIKE_SAVE}_ERROR`:
        case `${BIKE_ADD_PART}_ERROR`:
        case `${BIKE_PART_SAVE}_ERROR`:
        case `${BIKE_PART_DELETE}_ERROR`:
        case `${FRAME_SAVE}_ERROR`:
        case `${FRAME_UPLOAD}_ERROR`:
        case `${FRAME_LIST}_ERROR`:
        case `${FRAME_ARCHIVE}_ERROR`:
        case `${FRAME_DELETE}_ERROR`:
        case  `${GET_BIKE_PARTS}_ERROR`:
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default bike;