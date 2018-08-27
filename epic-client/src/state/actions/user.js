export const USER_LOGIN_REQUESTED = 'user/USER_LOGIN_REQUESTED';
export const USER_LOGIN_ERROR = 'user/USER_LOGIN_ERROR';
export const USER_LOGIN = 'user/USER_LOGIN';
export const USER_NOT_VALIDATED = 'user/USER_NOT_VALIDATED';

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

export const cancelActionForLogin = () => ({
    type: USER_NOT_VALIDATED
});
