import {USER_LOGOUT} from "../actions/user";

const initialState = {};

const quote = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGOUT:
            return initialState;
                   default:
            return state;
    }
};

export default quote;
