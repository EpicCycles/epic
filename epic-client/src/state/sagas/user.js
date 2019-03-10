import {call, put, select, takeLatest} from 'redux-saga/effects';
import history from '../../history.js'
import * as userApis from "./apis/user";

import {
    cancelActionForLogin,
    CHANGE_PASSWORD,
    CHANGE_USER_DATA,
    changePasswordError,
    changePasswordOK,
    changeUserDataError,
    changeUserDataOK,
    loginUserFailure,
    loginUserSuccess,
    logoutUserFailure,
    logoutUserSuccess,
    USER_LOGIN,
    USER_LOGOUT,
} from "../actions/user";
import {updateObject} from "../../helpers/utils";
import {errorAsMessage, logError} from "../../helpers/api_error";
import * as selectors from "../selectors/user";
import {clearAllState} from "../actions/application";
import {getBrandsAndSuppliers} from "../actions/core";
import {getFramework} from "../actions/framework";

export function* loginUser(action) {
    try {
        yield put(cancelActionForLogin());
        const loginResponse = yield call(userApis.loginUser, action.payload);
        const token = loginResponse.data.token;
        const user = loginResponse.data.user;
        yield put(loginUserSuccess(token, user));
        yield call(history.goBack);

        // start fetch of basic data
        yield put(getBrandsAndSuppliers());
        yield put(getFramework());
    } catch (error) {
        logError(error);
        yield put(loginUserFailure(errorAsMessage(error, "Login was not successful")));
    }
}

export function* watchForLoginUser() {
    yield takeLatest(`${USER_LOGIN}_REQUESTED`, loginUser);
}

export function* logoutUser(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            yield call(userApis.logoutUser, completePayload);
            yield put(logoutUserSuccess());
            yield put(clearAllState());
        }
        yield call(history.push, "/login");
    } catch (error) {
        yield put(logoutUserFailure(errorAsMessage(error, "Logout was not successful")));
    }
}

export function* watchForLogoutUser() {
    yield takeLatest(`${USER_LOGOUT}_REQUESTED`, logoutUser);
}

export function* changePassword(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            yield call(userApis.changePassword, completePayload);
            yield put(changePasswordOK());
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        yield put(changePasswordError(errorAsMessage(error, "Password change was not successful")));
    }
}

export function* watchForChangePassword() {
    yield takeLatest(`${CHANGE_PASSWORD}_REQUESTED`, changePassword);
}

export function* changeUserData(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const changeUserResponse = yield call(userApis.changeUserData, completePayload);
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
    yield takeLatest(`${CHANGE_USER_DATA}_REQUESTED`, changeUserData);
}
