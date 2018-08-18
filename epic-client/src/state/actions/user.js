export const USER_LOGIN_REQUESTED = 'user/USER_LOGIN_REQUESTED';
export const USER_LOGIN_ERROR = 'user/USER_LOGIN_ERROR';
export const USER_LOGIN = 'user/USER_LOGIN';
export const USER_REMOVE_ERROR = 'user/USER_REMOVE_ERROR';

export const loginUser = (username, password) => ({
    type: USER_LOGIN_REQUESTED,
    payload: {username, password}
});

export const loginUserSuccess = user => ({
    type: USER_LOGIN,
    payload: user
});

export const loginUserFailure = error => ({
    type: USER_LOGIN_ERROR,
    payload: error
});
export const removeUserError = () => ({
    type: USER_REMOVE_ERROR
});

