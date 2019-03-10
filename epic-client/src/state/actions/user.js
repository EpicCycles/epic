export const USER_LOGIN = 'user/USER_LOGIN';
export const USER_LOGOUT = 'user/USER_LOGOUT';
export const USER_NOT_VALIDATED = 'user/USER_NOT_VALIDATED';
export const CHANGE_PASSWORD = 'user/CHANGE_PASSWORD';
export const CHANGE_USER_DATA = "user/CHANGE_USER_DATA";

export const loginUser = (username, password) => ({
    type: `${USER_LOGIN}_REQUESTED`,
    payload: { username, password }
});

export const loginUserSuccess = (token, user) => ({
    type: USER_LOGIN,
    payload: { token, user }
});

export const loginUserFailure = error => ({
    type: `${USER_LOGIN}_ERROR`,
    payload: error
});
export const logoutUser = () => ({
    type: `${USER_LOGOUT}_REQUESTED`,
});

export const logoutUserSuccess = () => ({
    type: USER_LOGOUT,
});

export const logoutUserFailure = error => ({
    type: `${USER_LOGOUT}_ERROR`,
    payload: error
});

export const cancelActionForLogin = () => ({
    type: USER_NOT_VALIDATED
});

export const changePassword = (passwordData) => ({
    type: `${CHANGE_PASSWORD}_REQUESTED`,
    payload: { passwordData }
});
export const changePasswordOK = () => ({
    type: `${CHANGE_PASSWORD}_SUCCESS`,
});
export const changePasswordError = (error) => ({
    type: `${CHANGE_PASSWORD}_FAILURE`,
    payload: error
});

export const changeUserData = (user) => ({
    type: `${CHANGE_USER_DATA}_REQUESTED`,
    payload: { user }
});
export const changeUserDataOK = (user) => ({
    type: `${CHANGE_USER_DATA}_SUCCESS`,
    payload: { user }
});
export const changeUserDataError = (error) => ({
    type: `${CHANGE_USER_DATA}_FAILURE`,
    payload: error
});