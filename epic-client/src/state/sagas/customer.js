import {call, put, select, takeLatest} from 'redux-saga/effects';
import history from '../../history.js'
import {
    createCustomerFailure,
    createCustomerSuccess,
    CUSTOMER_PAGE,
    deleteCustomerFailure,
    deleteCustomerSuccess,
    getCustomerFailure,
    getCustomerListFailure,
    getCustomerListSuccess,
    getCustomerSuccess,
    saveCustomerFailure,
    saveCustomerSuccess,
    saveCustomerPhoneSuccess,
    saveCustomerPhoneFailure,
    deleteCustomerPhoneSuccess,
    deleteCustomerPhoneFailure,
    saveCustomerAddressSuccess,
    saveCustomerAddressFailure,
    deleteCustomerAddressSuccess,
    deleteCustomerAddressFailure,
    CUSTOMER_LIST,
    CUSTOMER_DELETE,
    CUSTOMER_CREATE,
    CUSTOMER_SAVE,
    CUSTOMER_PHONE_DELETE,
    CUSTOMER_PHONE_SAVE,
    CUSTOMER_ADDRESS_DELETE, CUSTOMER_ADDRESS_SAVE,
} from "../actions/customer";

import api from './api';
import * as selectors from '../selectors/user.js';
import * as customerSelectors from '../selectors/customer.js';
import {updateObject} from "../../helpers/utils";
import {CUSTOMER} from "../../components/app/model/helpers/fields";

export function* getCustomerList(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token, page: 1 });
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
    yield takeLatest(`${CUSTOMER_LIST}_REQUESTED`, getCustomerList);
}

export function* getCustomerListPage(action) {
    try {
        const token = yield select(selectors.token);
        const searchParams = yield select(customerSelectors.searchParams);
        if (token) {
            const completePayload2 = updateObject(action.payload, { token }, searchParams);
            const response = yield call(api.getCustomerList, completePayload2);
            yield put(getCustomerListSuccess(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        yield put(getCustomerListFailure("Get Customer List Page failed"));
    }
}

export function* watchForGetCustomerListPage() {
    yield takeLatest(CUSTOMER_PAGE, getCustomerListPage);
}

export function* getCustomer(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
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
    yield takeLatest(`${CUSTOMER}_REQUESTED`, getCustomer);
}

export function* createCustomer(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
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
    yield takeLatest(`${CUSTOMER_CREATE}_REQUESTED`, createCustomer);
}

export function* saveCustomer(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
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
    yield takeLatest(`${CUSTOMER_SAVE}_REQUESTED`, saveCustomer);
}

export function* deleteCustomer(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
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
    yield takeLatest(`${CUSTOMER_DELETE}_REQUESTED`, deleteCustomer);
}

export function* deleteCustomerPhone(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const response = yield call(api.deleteCustomerPhone, completePayload);
            yield put(deleteCustomerPhoneSuccess(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        yield put(deleteCustomerPhoneFailure("Customer Phone delete failed"));
    }
}

export function* watchForDeleteCustomerPhone() {
    yield takeLatest(`${CUSTOMER_PHONE_DELETE}_REQUEST`, deleteCustomerPhone);
}

export function* saveCustomerPhone(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            let response;
            if (action.payload.customerPhone.id) {
                response = yield call(api.saveCustomerPhone, completePayload);
            } else {
                response = yield call(api.createCustomerPhone, completePayload);
            }
            yield put(saveCustomerPhoneSuccess(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        yield put(saveCustomerPhoneFailure({customerPhone: action.payload.customerPhone, error:"Customer Phone save failed"}));
    }
}

export function* watchForSaveCustomerPhone() {
    yield takeLatest(`${CUSTOMER_PHONE_SAVE}_REQUEST`, saveCustomerPhone);
}


export function* deleteCustomerAddress(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const response = yield call(api.deleteCustomerAddress, completePayload);
            yield put(deleteCustomerAddressSuccess(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        yield put(deleteCustomerAddressFailure("Customer Address delete failed"));
    }
}

export function* watchForDeleteCustomerAddress() {
    yield takeLatest(`${CUSTOMER_ADDRESS_DELETE}_REQUEST`, deleteCustomerAddress);
}

export function* saveCustomerAddress(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            let response;
            if (action.payload.customerAddress.id) {
                response = yield call(api.saveCustomerAddress, completePayload);
            } else {
                response = yield call(api.createCustomerAddress, completePayload);
            }
            yield put(saveCustomerAddressSuccess(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        yield put(saveCustomerAddressFailure({customerAddress: action.payload.customerAddress, error:"Customer Address save failed"}));
    }
}

export function* watchForSaveCustomerAddress() {
    yield takeLatest(`${CUSTOMER_ADDRESS_SAVE}_REQUEST`, saveCustomerAddress);
}



