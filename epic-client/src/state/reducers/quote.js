import {USER_LOGOUT} from "../actions/user";
import {CLEAR_QUOTE_DATA, COPY_QUOTE, CREATE_QUOTE, FIND_QUOTES, GET_QUOTE} from "../actions/quote";
import {CLEAR_ALL_STATE} from "../actions/application";

const initialState = {};

const quote = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGOUT:
        case CLEAR_ALL_STATE:
        case CLEAR_QUOTE_DATA:
            return initialState;
        case `${CREATE_QUOTE}_OK`:
        case `${COPY_QUOTE}_OK`:
        case `${GET_QUOTE}_OK`:
            return {
                ...state,
                quoteId: action.payload.quoteId,
                quotes: action.payload.quotes,
                quoteParts: action.payload.quoteParts,
                isLoading:false,
            };
        case `${FIND_QUOTES}_OK`:
            return {
                ...state,
                quotes: action.payload.quotes,
                isLoading:false,
            };
        case  `${CREATE_QUOTE}_REQUESTED`:
        case  `${COPY_QUOTE}_REQUESTED`:
        case  `${FIND_QUOTES}_REQUESTED`:
        case  `${GET_QUOTE}_REQUESTED`:
            return {
                ...state,
                isLoading: true
            };
        case  `${CREATE_QUOTE}_ERROR`:
        case  `${COPY_QUOTE}_ERROR`:
        case  `${FIND_QUOTES}_ERROR`:
        case  `${GET_QUOTE}_ERROR`:
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default quote;
