import {CHANGE_PASSWORD, CHANGE_USER_DATA, GET_USERS, USER_LOGIN, USER_LOGOUT} from "../actions/user";
import {GET_LOCAL_STATE} from "../actions/application";
import {COOKIE_TOKEN, COOKIE_USER} from "../../helpers/constants";
import {createCookie} from "../helpers/cookies";

const initialState = {
    username: "",
    token: "",
    isLoading: false,
    isAuthenticated: false
};

const user = (state = initialState, action) => {
    switch (action.type) {

        case USER_LOGOUT:
        case `${USER_LOGOUT}_ERROR`:
        case `${GET_USERS}_FAILURE`:
            return initialState;
        case `${GET_USERS}_SUCCESS`:
            return {
                ...state,
                isLoading: false,
                users: action.payload.users,
            };
        case `${USER_LOGOUT}_REQUESTED`:
        case `${CHANGE_PASSWORD}_REQUESTED`:
        case `${CHANGE_USER_DATA}_REQUESTED`:
        case `${GET_USERS}_REQUESTED`:
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
        case `${CHANGE_PASSWORD}_FAILURE`:
        case `${CHANGE_USER_DATA}_FAILURE`:
        case `${CHANGE_PASSWORD}_SUCCESS`:
            return {
                ...state,
                isLoading: false,
            };
        case USER_LOGIN:
        case GET_LOCAL_STATE:
            createCookie(COOKIE_USER, action.payload.user);
            createCookie(COOKIE_TOKEN, action.payload.token);
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