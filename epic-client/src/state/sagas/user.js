import {call, put, takeLatest} from 'redux-saga/effects';
import api from './api';
import history from '../../history.js'

import {cancelActionForLogin, loginUserFailure, loginUserSuccess, USER_LOGIN_REQUESTED} from "../actions/user";

export function* loginUser(action) {
    try {
        yield put(cancelActionForLogin());
        const loginResponse = yield call(api.loginUser, action.payload);
        const token = loginResponse.data.key;

        const getUserPayload =  Object.assign(action.payload, { token });
        const getUserResponse = yield call(api.getUser, getUserPayload);

        yield put(loginUserSuccess(token, getUserResponse.data));
        yield call(history.goBack)

    } catch(error) {
        yield put(loginUserFailure("Login was not successful"));
    }
}
export function* watchForLoginUser() {
    yield takeLatest(USER_LOGIN_REQUESTED, loginUser);
}
