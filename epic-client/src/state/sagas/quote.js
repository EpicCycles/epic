import history from "../../history";
import {updateObject} from "../../helpers/utils";
import * as selectors from "../selectors/user";
import quote from "./apis/quote";
import {CREATE_QUOTE, createQuoteError, createQuoteOK} from "../actions/quote";
import {call, put, select, takeLatest} from "redux-saga/effects";


export function* createQuote(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const response = yield call(quote.createQuote, completePayload);
            yield put(createQuoteOK(response.data));
        } else {
            yield call(history.push, "/login");
        }

    } catch (error) {
        yield put(createQuoteError("Create Quote failed"));
    }
}

export function* watchForCreateQuote() {
    yield takeLatest(`${CREATE_QUOTE}_REQUESTED`, createQuote);
}