import {
    FRAMEWORK,
    FRAMEWORK_ERROR,
    FRAMEWORK_REQUESTED,
    FRAMEWORK_SAVE,
    FRAMEWORK_SAVE_ERROR,
    FRAMEWORK_SAVE_REQUESTED, FRAMEWORK_UPDATE
} from "../actions/framework";
import {CLEAR_ALL_STATE} from "../actions/application";

// const initialState = {
//     isLoading: false,
//     sections: [],
// };
const initialState = {
    isLoading: false,
};

// this seemd to be the bit that is in reducers in loyalty code
const framework = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_ALL_STATE:
            return initialState;
        case FRAMEWORK_REQUESTED:
            return {
                ...state,
                isLoading: true,
                sections: [],
            };
        case FRAMEWORK_SAVE_REQUESTED:
            return {
                ...state,
                sections: action.payload.sections,
                isLoading: true,
            };

        case FRAMEWORK_ERROR:
        case FRAMEWORK_SAVE_ERROR:
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