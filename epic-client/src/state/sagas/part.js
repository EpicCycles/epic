import {call, put, select, takeLatest} from "redux-saga/effects";
import * as selectors from "../selectors/user";
import part from "./apis/part";
import history from "../../history";
import {
    deletePartError,
    deletePartOK,
    listPartsError,
    listPartsOK,
    PART_DELETE,
    PART_LIST,
    PART_SAVE,
    PART_UPLOAD,
    savePartError,
    savePartOK,
    uploadPartsError,
    uploadPartsOK
} from "../actions/part";
import {logError} from "../../helpers/api_error";
import {updateObject} from "../../helpers/utils";


export function* savePart(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const response = yield call(part.savePart, completePayload);
            yield put(savePartOK(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        logError(error);
        yield put(savePartError("Save Part failed"));
    }
}

export function* watchForSavePart() {
    yield takeLatest(`${PART_SAVE}_REQUESTED`, savePart);
}


export function* deletePart(action) {
    try {
        const token = yield select(selectors.token);
        const listCriteria = action.payload.listCriteria;

        if (token) {
            const completePayload = updateObject(action.payload, { token });
            yield call(part.deletePart, completePayload);
            if (listCriteria) {
                const searchPayload = { listCriteria, token };
                const response = yield call(part.getParts, searchPayload);
                yield put(listPartsOK(response.data));
            } else {
                yield put(deletePartOK());
            }
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        logError(error);
        yield put(deletePartError("Delete Part failed"));
    }
}

export function* watchForDeletePart() {
    yield takeLatest(`${PART_DELETE}_REQUESTED`, deletePart);
}


export function* uploadParts(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const response = yield call(part.uploadParts, completePayload);
            yield put(uploadPartsOK(response.data));
            yield call(history.push, "/product-review");
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        logError(error);
        yield put(uploadPartsError("Save Parts failed"));
    }
}

export function* watchForUploadParts() {
    yield takeLatest(`${PART_UPLOAD}_REQUESTED`, uploadParts);
}

export function* getParts(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const response = yield call(part.getParts, completePayload);
            yield put(listPartsOK(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        logError(error);
        yield put(listPartsError("Get Parts failed"));
    }
}

export function* watchForGetParts() {
    yield takeLatest(`${PART_LIST}_REQUESTED`, getParts);
}