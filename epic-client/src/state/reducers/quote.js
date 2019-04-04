import {USER_LOGOUT} from "../actions/user";
import {
    ARCHIVE_QUOTE,
    CHANGE_QUOTE,
    CLEAR_QUOTE_DATA,
    COPY_QUOTE,
    CREATE_QUOTE,
    FIND_QUOTES,
    GET_QUOTE,
    UNARCHIVE_QUOTE,
    UPDATE_QUOTE
} from "../actions/quote";
import {CLEAR_ALL_STATE} from "../actions/application";
import {CUSTOMER} from "../actions/customer";
import {updateObjectInArray, updateObjectWithApiErrors} from "../../helpers/utils";

const initialState = {};

const quote = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGOUT:
        case CLEAR_ALL_STATE:
        case CLEAR_QUOTE_DATA:
            return initialState;
        case CHANGE_QUOTE:
            return {
                ...state,
                quoteId: action.payload.quoteId,
            };
        case `${CREATE_QUOTE}_OK`:
        case `${COPY_QUOTE}_OK`:
        case `${GET_QUOTE}_OK`:
        case `${UPDATE_QUOTE}_OK`:
        case `${FIND_QUOTES}_OK`:
            return {
                ...state,
                quoteId: action.payload.quoteId,
                quotes: action.payload.quotes,
                quoteParts: action.payload.quoteParts,
                isLoading: false,
            };
        case `${ARCHIVE_QUOTE}_OK`:
        case `${UNARCHIVE_QUOTE}_OK`:
            return {
                ...state,
                quotes: updateObjectInArray(state.quotes, action.payload),
                isLoading: false,
            };
        case CUSTOMER:
            return {
                ...state,
                quotes: action.payload.quotes,
                isLoading: false,
            };
        case  `${CREATE_QUOTE}_REQUESTED`:
        case  `${COPY_QUOTE}_REQUESTED`:
        case  `${FIND_QUOTES}_REQUESTED`:
        case  `${GET_QUOTE}_REQUESTED`:
        case  `${UPDATE_QUOTE}_REQUESTED`:
        case  `${ARCHIVE_QUOTE}_REQUESTED`:
        case  `${UNARCHIVE_QUOTE}_REQUESTED`:
            return {
                ...state,
                isLoading: true
            };
        case  `${CREATE_QUOTE}_ERROR`:
        case  `${COPY_QUOTE}_ERROR`:
        case  `${FIND_QUOTES}_ERROR`:
        case  `${GET_QUOTE}_ERROR`:
        case  `${ARCHIVE_QUOTE}_ERROR`:
        case  `${UNARCHIVE_QUOTE}_ERROR`:
            return {
                ...state,
                isLoading: false,
            };
        case  `${UPDATE_QUOTE}_ERROR`:
            const quoteWithError = updateObjectWithApiErrors(action.payload.quote, action.payload);
            return {
                ...state,
                isLoading: false,
                quotes: updateObjectInArray(state.quotes, quoteWithError)
            };
        default:
            return state;
    }
};

export default quote;
