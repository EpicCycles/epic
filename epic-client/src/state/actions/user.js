export const USER_LOGIN_REQUESTED = 'user/USER_LOGIN_REQUESTED';
export const USER_LOGIN_ERROR = 'user/USER_LOGIN_ERROR';
export const USER_LOGIN = 'user/USER_LOGIN';
export const USER_LOGOUT_REQUESTED = 'user/USER_LOGOUT_REQUESTED';
export const USER_LOGOUT_ERROR = 'user/USER_LOGOUT_ERROR';
export const USER_LOGOUT = 'user/USER_LOGOUT';
export const USER_NOT_VALIDATED = 'user/USER_NOT_VALIDATED';
export const CHANGE_PASSWORD_REQUESTED = 'user/CHANGE_PASSWORD_REQUESTED';
export const CHANGE_PASSWORD_SUCCESS = 'user/CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAILURE = 'user/CHANGE_PASSWORD_FAILURE';
export const CHANGE_USER_DATA_REQUESTED = "user/CHANGE_USER_DATA_REQUESTED";
export const CHANGE_USER_DATA_SUCCESS = "user/CHANGE_USER_DATA_SUCCESS";
export const CHANGE_USER_DATA_FAILURE = "user/CHANGE_USER_DATA_FAILURE";

export const loginUser = (username, password) => ({
    type: USER_LOGIN_REQUESTED,
    payload: { username, password }
});

export const loginUserSuccess = (token, user) => ({
    type: USER_LOGIN,
    payload: { token, user }
});

export const loginUserFailure = error => ({
    type: USER_LOGIN_ERROR,
    payload: error
});
export const logoutUser = () => ({
    type: USER_LOGOUT_REQUESTED,
});

export const logoutUserSuccess = () => ({
    type: USER_LOGOUT,
});

export const logoutUserFailure = error => ({
    type: USER_LOGOUT_ERROR,
    payload: error
});

export const cancelActionForLogin = () => ({
    type: USER_NOT_VALIDATED
});

export const changePassword = (passwordData) => ({
    type: CHANGE_PASSWORD_REQUESTED,
    payload: { passwordData }
});
export const changePasswordOK = () => ({
    type: CHANGE_PASSWORD_SUCCESS,
});
export const changePasswordError = (error) => ({
    type: CHANGE_PASSWORD_FAILURE,
    payload: error
});

export const changeUserData = (user) => ({
    type: CHANGE_USER_DATA_REQUESTED,
    payload: { user }
});
export const changeUserDataOK = (user) => ({
    type: CHANGE_USER_DATA_SUCCESS,
    payload: { user }
});
export const changeUserDataError = (error) => ({
    type: CHANGE_USER_DATA_FAILURE,
    payload: error
});