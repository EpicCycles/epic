import {call, put, takeLatest} from 'redux-saga/effects';
import history from '../../history.js'
import {
    CUSTOMER_LIST_REQUESTED,
    CUSTOMER_REQUESTED,
    getCustomerFailure,
    getCustomerListFailure,
    getCustomerListSuccess,
    getCustomerSuccess
} from "../actions/customer";

import api from './api';

export function* getCustomerList(action) {
    try {
        const response = yield call(api.getCustomerList, action.payload);
        yield put(getCustomerListSuccess(response.data));
    } catch (error) {
        yield put(getCustomerListFailure(error));
    }
}

export function* watchForGetCustomerList() {
    yield takeLatest(CUSTOMER_LIST_REQUESTED, getCustomerList);
}

export function* getCustomer(action) {
    try {
        const response = yield call(api.getCustomer, action.payload);
        yield put(getCustomerSuccess(response.data));
        yield call(history.push, "/customer");

    } catch (error) {
        yield put(getCustomerFailure("Get Customer failed"));
        // yield put(history.push("/customer"));
    }
}

export function* watchForGetCustomer() {
    yield takeLatest(CUSTOMER_REQUESTED, getCustomer);
}