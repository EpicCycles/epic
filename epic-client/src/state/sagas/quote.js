import history from "../../history";
import {updateObject} from "../../helpers/utils";
import * as selectors from "../selectors/user";
import quote from "./apis/quote";
import {
    COPY_QUOTE,
    copyQuoteError,
    copyQuoteOK,
    CREATE_QUOTE,
    createQuoteError,
    createQuoteOK,
    FIND_QUOTES,
    GET_QUOTE,
    getQuoteError,
    getQuoteListError,
    getQuoteListOK,
    getQuoteOK
} from "../actions/quote";
import {call, put, select, takeLatest} from "redux-saga/effects";
import {errorAsMessage} from "../../helpers/api_error";
import {getCustomer} from "../actions/customer";


export function* copyQuote(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const response = yield call(quote.copyQuote, completePayload);
            yield put(copyQuoteOK(response.data));
        } else {
            yield call(history.push, "/login");
        }

    } catch (error) {
        yield put(copyQuoteError(errorAsMessage(error, "Copy Quote failed")));
    }
}

export function* watchForCopyQuote() {
    yield takeLatest(`${COPY_QUOTE}_REQUESTED`, copyQuote);
}

export function* getQuote(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const response = yield call(quote.getQuote, completePayload);
            yield put(getQuoteOK(response.data));
            yield put(getCustomer(response.data.customerId));
            yield call(history.push, "/quote");
        } else {
            yield call(history.push, "/login");
        }

    } catch (error) {
        yield put(getQuoteError(errorAsMessage(error, "Failed to get quote")));
    }
}

export function* watchForGetQuote() {
    yield takeLatest(`${GET_QUOTE}_REQUESTED`, getQuote);
}

export function* getQuoteList(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const response = yield call(quote.getQuoteList, completePayload);
            yield put(getQuoteListOK(response.data));
        } else {
            yield call(history.push, "/login");
        }

    } catch (error) {
        yield put(getQuoteListError(errorAsMessage(error, "Failed to get quotes")));
    }
}

export function* watchForGetQuoteList() {
    yield takeLatest(`${FIND_QUOTES}_REQUESTED`, getQuoteList);
}

export function* createQuote(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const response = yield call(quote.createQuote, completePayload);
            yield put(createQuoteOK(response.data));
            yield put(getCustomer(response.data.customerId));
            yield call(history.push, "/quote");
        } else {
            yield call(history.push, "/login");
        }

    } catch (error) {
        yield put(createQuoteError(errorAsMessage(error, "Create Quote failed")));
    }
}

export function* watchForCreateQuote() {
    yield takeLatest(`${CREATE_QUOTE}_REQUESTED`, createQuote);
}
