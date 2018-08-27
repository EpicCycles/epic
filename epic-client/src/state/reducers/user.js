import {USER_LOGIN, USER_LOGIN_ERROR, USER_LOGIN_REQUESTED} from "../actions/user";

const initialState = {
    username: "",
    token: "",
    isLoading: false,
    isAuthenticated: false
};

const user = (state = initialState, action) => {
    switch (action.type) {
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
        case USER_LOGIN:
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
                isLoading: false,
                isAuthenticated: true,
            };

        default:
            return state;
    }
};

export default user;