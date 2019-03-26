import {USER_LOGOUT} from "../actions/user";
import {COPY_QUOTE, CREATE_QUOTE} from "../actions/quote";

const initialState = {};

const quote = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGOUT:
            return initialState;
        case `${CREATE_QUOTE}_OK`:
        case `${COPY_QUOTE}_OK`:
            return {
                ...state,
                quoteId: action.payload.quoteId,
                quotes: action.payload.quotes,
                quoteParts: action.payload.quoteParts,
            };
        case  `${CREATE_QUOTE}_REQUESTED`:
        case  `${COPY_QUOTE}_REQUESTED`:
            return {
                ...state,
                isLoading: true
            };
        case  `${CREATE_QUOTE}_ERROR`:
        case  `${COPY_QUOTE}_ERROR`:
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default quote;
