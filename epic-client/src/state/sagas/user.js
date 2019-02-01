import {call, put, select, takeLatest} from 'redux-saga/effects';
import history from '../../history.js'
import user from "./apis/user";

import {
    cancelActionForLogin,
    CHANGE_PASSWORD_REQUESTED,
    CHANGE_USER_DATA_REQUESTED,
    changePasswordError,
    changePasswordOK,
    changeUserDataError,
    changeUserDataOK,
    loginUserFailure,
    loginUserSuccess,
    logoutUserFailure,
    logoutUserSuccess,
    USER_LOGIN_REQUESTED,
    USER_LOGOUT_REQUESTED
} from "../actions/user";
import {updateObject} from "../../helpers/utils";
import {errorAsMessage, logError} from "../../helpers/api_error";
import * as selectors from "../selectors/user";
import {clearAllState} from "../actions/application";

export function* loginUser(action) {
    try {
        yield put(cancelActionForLogin());
        const loginResponse = yield call(user.loginUser, action.payload);
        const token = loginResponse.data.key;

        const getUserPayload = updateObject(action.payload, { token });
        const getUserResponse = yield call(user.getUser, getUserPayload);

        yield put(loginUserSuccess(token, getUserResponse.data));
        yield call(history.goBack)

    } catch (error) {
        yield put(loginUserFailure(errorAsMessage(error, "Login was not successful")));
    }
}

export function* watchForLoginUser() {
    yield takeLatest(USER_LOGIN_REQUESTED, loginUser);
}

export function* logoutUser(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            yield call(user.logoutUser, completePayload);
            yield put(logoutUserSuccess());
            yield put(clearAllState());
        }
        yield call(history.push, "/login");
    } catch (error) {
        yield put(logoutUserFailure(errorAsMessage(error, "Logout was not successful")));
    }
}

export function* watchForLogoutUser() {
    yield takeLatest(USER_LOGOUT_REQUESTED, logoutUser);
}

export function* changePassword(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            yield call(user.changePassword, completePayload);
            yield put(changePasswordOK());
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        yield put(changePasswordError(errorAsMessage(error, "Password change was not successful")));
    }
}

export function* watchForChangePassword() {
    yield takeLatest(CHANGE_PASSWORD_REQUESTED, changePassword);
}

export function* changeUserData(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const changeUserResponse =  yield call(user.changeUserData, completePayload);
            yield put(changeUserDataOK(changeUserResponse.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        logError(error);
        yield put(changeUserDataError("Data change was not successful"));
    }
}

export function* watchForChangeUserData() {
    yield takeLatest(CHANGE_USER_DATA_REQUESTED, changeUserData);
}
