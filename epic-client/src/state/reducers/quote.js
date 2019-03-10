import {USER_LOGOUT} from "../actions/user";
import {CUSTOMER} from "../actions/customer";
import {addItemsToArray} from "../../helpers/utils";

const initialState = {};

const quote = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGOUT:
            return initialState;
        default:
            return state;
        case CUSTOMER:
            return {
                ...state,
                quotes: addItemsToArray(state.quotes, action.payload.quotes),
            };
    }
};

export default quote;
