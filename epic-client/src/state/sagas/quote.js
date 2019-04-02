import history from "../../history";
import {updateObject} from "../../helpers/utils";
import * as selectors from "../selectors/user";
import quote from "./apis/quote";
import {
    ARCHIVE_QUOTE,
    archiveQuoteError,
    archiveQuoteOK,
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
    getQuoteOK,
    saveQuote,
    saveQuoteError,
    saveQuoteOK,
    UNARCHIVE_QUOTE,
    unarchiveQuoteError,
    unarchiveQuoteOK,
    UPDATE_QUOTE
} from "../actions/quote";
import {call, put, select, takeLatest} from "redux-saga/effects";
import {errorAsMessage, logError} from "../../helpers/api_error";
import {getCustomer} from "../actions/customer";

export function* saveQuoteProcess(action) {
    const quote = action.payload.quote;
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = { quote, token };
            const response = yield call(quote.saveQuote, completePayload);
            yield put(saveQuoteOK(response.data));
        } else {
            yield call(history.push, "/login");
        }

    } catch (apiError) {
        const error = 'Save Quote failed';
        let error_detail;
        logError(apiError);
        if (apiError.response) {
            error_detail = apiError.response.data;
        }
        yield put(saveQuoteError({quote, error, error_detail}));
    }
}
export function* watchForSaveQuote() {
    yield takeLatest(`${UPDATE_QUOTE}_REQUESTED`, saveQuoteProcess);
}

export function* archiveQuote(action) {
      try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const response = yield call(quote.archiveQuote, completePayload);
            yield put(archiveQuoteOK(response.data));
        } else {
            yield call(history.push, "/login");
        }

    } catch (error) {
        yield put(archiveQuoteError(errorAsMessage(error, "Archive Quote failed")));
    }
}
export function* watchForArchiveQuote() {
    yield takeLatest(`${ARCHIVE_QUOTE}_REQUESTED`, archiveQuote);
}

export function* unarchiveQuote(action) {
     try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const response = yield call(quote.unarchiveQuote, completePayload);
            yield put(unarchiveQuoteOK(response.data));
        } else {
            yield call(history.push, "/login");
        }

    } catch (error) {
        yield put(unarchiveQuoteError(errorAsMessage(error, "Quote restore failed")));
    }
}
export function* watchForUnarchiveQuote() {
    yield takeLatest(`${UNARCHIVE_QUOTE}_REQUESTED`, unarchiveQuote);
}

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
