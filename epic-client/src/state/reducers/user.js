import {
    CHANGE_PASSWORD_FAILURE,
    CHANGE_PASSWORD_REQUESTED, CHANGE_PASSWORD_SUCCESS, CHANGE_USER_DATA_FAILURE, CHANGE_USER_DATA_REQUESTED,
    CHANGE_USER_DATA_SUCCESS,
    USER_LOGIN,
    USER_LOGIN_ERROR,
    USER_LOGIN_REQUESTED, USER_LOGOUT, USER_LOGOUT_ERROR,
    USER_LOGOUT_REQUESTED
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
        case USER_LOGOUT_REQUESTED:
        case CHANGE_PASSWORD_REQUESTED:
        case CHANGE_USER_DATA_REQUESTED:
            return {
                ...state,
                isLoading: true,
            };
        case USER_LOGIN_REQUESTED:
            return {
                ...state,
                username: action.payload.username,
                token: "",
                isLoading: true,
                isAuthenticated: false,
            };
        case USER_LOGIN_ERROR:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
            };
        case USER_LOGOUT_ERROR:
        case CHANGE_PASSWORD_FAILURE:
        case CHANGE_USER_DATA_FAILURE:
        case CHANGE_PASSWORD_SUCCESS:
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
        case CHANGE_USER_DATA_SUCCESS:
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