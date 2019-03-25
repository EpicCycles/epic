import {USER_LOGOUT} from "../actions/user";
import {addItemsToArray} from "../../helpers/utils";
import {CREATE_QUOTE} from "../actions/quote";

const initialState = {};

const quote = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGOUT:
            return initialState;
        case `${CREATE_QUOTE}_OK`:
            return {
                ...state,
                quotes: addItemsToArray(state.quotes, action.payload.quotes),
                quoteParts: addItemsToArray(state.quoteParts, action.payload.quoteParts),
            };
        case  `${CREATE_QUOTE}_REQUESTED`:
            return {
                ...state,
                isLoading: true
            };
        case  `${CREATE_QUOTE}_ERROR`:
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default quote;
