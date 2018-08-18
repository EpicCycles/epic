import {USER_LOGIN, USER_LOGIN_ERROR, USER_LOGIN_REQUESTED, USER_REMOVE_ERROR} from "../actions/user";

const initialState = {
    user: {},
    isLoading: false,
    isAuthenticated: false,
    error: ""
};

const user = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUESTED:
            return {
                ...state,
                error: "",
                user: {},
                isLoading: true,
                isAuthenticated: false,
            };
        case USER_LOGIN_ERROR:
            return {
                ...state,
                error: action.payload,
                user: {},
                isLoading: false,
                isAuthenticated: false,
            };
        case USER_LOGIN:
            return {
                ...state,
                error: "",
                user: action.payload,
                isLoading: false,
                isAuthenticated: true,
            };
        case USER_REMOVE_ERROR:
            return {
                ...state,
                error: ""
            };
        default:
            return state;
    }
};

export default user;