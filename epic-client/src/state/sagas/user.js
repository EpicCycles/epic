import {call, put, takeLatest} from 'redux-saga/effects';
import api from './api';
import {loginUserFailure, loginUserSuccess, USER_LOGIN_REQUESTED} from "../actions/user";

export function* loginUser(action) {
    try {
        const response = yield call(api.loginUser, action.payload);
        yield put(loginUserSuccess(response.data));
    } catch(error) {
        yield put(loginUserFailure("Login was not successful"));
    }
}
export function* watchForLoginUser() {
    yield takeLatest(USER_LOGIN_REQUESTED, loginUser);
}
