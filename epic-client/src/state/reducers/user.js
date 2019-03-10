import {
    CHANGE_PASSWORD, CHANGE_USER_DATA,
    USER_LOGIN,
    USER_LOGOUT
} from "../actions/user";

const initialState = {
    username: "",
    token: "",
    isLoading: false,
    isAuthenticated: false
};

const user = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGOUT:
            return initialState;
        case `${USER_LOGOUT}_REQUESTED`:
        case `${CHANGE_PASSWORD}_REQUESTED`:
        case `${CHANGE_USER_DATA}_REQUESTED`:
            return {
                ...state,
                isLoading: true,
            };
        case `${USER_LOGIN}_REQUESTED`:
            return {
                ...state,
                username: action.payload.username,
                token: "",
                isLoading: true,
                isAuthenticated: false,
            };
        case `${USER_LOGIN}_ERROR`:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
            };
        case `${USER_LOGOUT}_ERROR`:
        case `${CHANGE_PASSWORD}_FAILURE`:
        case `${CHANGE_USER_DATA}_FAILURE`:
        case `${CHANGE_PASSWORD}_SUCCESS`:
            return {
                ...state,
                isLoading: false,
            };
        case USER_LOGIN:
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
                isLoading: false,
                isAuthenticated: true,
            };
        case `${CHANGE_USER_DATA}_SUCCESS`:
            return {
                ...state,
                user: action.payload.user,
                isLoading: false,
            };

        default:
            return state;
    }
};

export default user;