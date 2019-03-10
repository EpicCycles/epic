import {
    FRAMEWORK,
     FRAMEWORK_SAVE,
     FRAMEWORK_UPDATE
} from "../actions/framework";
import {CLEAR_ALL_STATE} from "../actions/application";
import {USER_LOGIN, USER_LOGOUT} from "../actions/user";

const initialState = {
    isLoading: false,
};

// this seemd to be the bit that is in reducers in loyalty code
const framework = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_ALL_STATE:
        case `${USER_LOGIN}_REQUESTED`:
        case USER_LOGOUT:
            return initialState;
        case `${FRAMEWORK}_REQUESTED`:
            return {
                ...state,
                isLoading: true,
                sections: [],
            };
        case `${FRAMEWORK_SAVE}_REQUESTED`:
            return {
                ...state,
                sections: action.payload.sections,
                isLoading: true,
            };

        case `${FRAMEWORK}_ERROR`:
        case `${FRAMEWORK_SAVE}_ERROR`:
            return {
                ...state,
                isLoading: false,
            };

        case FRAMEWORK:
        case FRAMEWORK_SAVE:
        case FRAMEWORK_UPDATE:
            return {
                ...state,
                sections: action.payload,
                isLoading: false,
            };
        default:
            return state;
    }
};


export default framework;