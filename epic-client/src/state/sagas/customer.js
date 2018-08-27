import {call, put, select, takeLatest} from 'redux-saga/effects';
import history from '../../history.js'
import {
    createCustomerFailure,
    createCustomerSuccess,
    CUSTOMER_CREATE_REQUESTED,
    CUSTOMER_DELETE_REQUESTED,
    CUSTOMER_LIST_REQUESTED,
    CUSTOMER_REQUESTED,
    CUSTOMER_SAVE_REQUESTED,
    deleteCustomerFailure,
    deleteCustomerSuccess,
    getCustomerFailure,
    getCustomerListFailure,
    getCustomerListSuccess,
    getCustomerSuccess,
    saveCustomerFailure,
    saveCustomerSuccess
} from "../actions/customer";

import api from './api';
import * as selectors from '../selectors/user.js';

export function* getCustomerList(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = Object.assign(action.payload, { token });
            const response = yield call(api.getCustomerList, completePayload);
            yield put(getCustomerListSuccess(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        yield put(getCustomerListFailure("Get Customer List failed"));
    }
}

export function* watchForGetCustomerList() {
    yield takeLatest(CUSTOMER_LIST_REQUESTED, getCustomerList);
}

export function* getCustomer(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = Object.assign(action.payload, { token });
            const response = yield call(api.getCustomer, completePayload);
            yield put(getCustomerSuccess(response.data));
            yield call(history.push, "/customer");
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        yield put(getCustomerFailure("Get Customer failed"));
        // yield put(history.push("/customer"));
    }
}

export function* watchForGetCustomer() {
    yield takeLatest(CUSTOMER_REQUESTED, getCustomer);
}

export function* createCustomer(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = Object.assign(action.payload, { token });
            console.log(completePayload)
            const response = yield call(api.createCustomer, completePayload);
            yield put(createCustomerSuccess(response.data));
        } else {
            yield call(history.push, "/login");
        }

    } catch (error) {
        yield put(createCustomerFailure("Create Customer failed"));
        // yield put(history.push("/customer"));
    }
}

export function* watchForCreateCustomer() {
    yield takeLatest(CUSTOMER_CREATE_REQUESTED, createCustomer);
}

export function* saveCustomer(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = Object.assign(action.payload, { token });
            const response = yield call(api.saveCustomer, completePayload);
            yield put(saveCustomerSuccess(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        yield put(saveCustomerFailure("Customer save failed"));
    }
}

export function* watchForSaveCustomer() {
    yield takeLatest(CUSTOMER_SAVE_REQUESTED, saveCustomer);
}

export function* deleteCustomer(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = Object.assign(action.payload, { token });
            const response = yield call(api.deleteCustomer, completePayload);
            yield put(deleteCustomerSuccess(response.data));
            yield call(history.push, "/");
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        yield put(deleteCustomerFailure("Customer delete failed"));
    }
}

export function* watchForDeleteCustomer() {
    yield takeLatest(CUSTOMER_DELETE_REQUESTED, deleteCustomer);
}