import {call, put, select, takeLatest} from "redux-saga/effects";
import * as selectors from "../selectors/user";
import part from "./apis/part";
import history from "../../history";
import {
    deletePartError,
    deletePartOK,
    listPartsError,
    listPartsOK,
    PART_DELETE_REQUESTED,
    PART_LIST_REQUESTED,
    PART_SAVE_REQUESTED,
    PART_UPLOAD_REQUESTED,
    savePartError,
    savePartOK,
    uploadPartsError,
    uploadPartsOK
} from "../actions/part";


export function* savePart(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = Object.assign(action.payload, { token });
            const response = yield call(part.savePart, completePayload);
            yield put(savePartOK(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        console.error(error);
        yield put(savePartError("Save Part failed"));
    }
}

export function* watchForSavePart() {
    yield takeLatest(PART_SAVE_REQUESTED, savePart);
}


export function* deletePart(action) {
    try {
        const token = yield select(selectors.token);
        const listCriteria = action.payload.listCriteria;

        if (token) {
            const completePayload = Object.assign(action.payload, { token });
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
        yield put(deletePartError("Delete Part failed"));
    }
}

export function* watchForDeletePart() {
    yield takeLatest(PART_DELETE_REQUESTED, deletePart);
}


export function* uploadParts(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = Object.assign(action.payload, { token });
            const response = yield call(part.uploadParts, completePayload);
            yield put(uploadPartsOK(response.data));
            yield call(history.push, "/product-review");
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        console.log(error)
        yield put(uploadPartsError("Save Parts failed"));
    }
}

export function* watchForUploadParts() {
    yield takeLatest(PART_UPLOAD_REQUESTED, uploadParts);
}

export function* getParts(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = Object.assign(action.payload, { token });
            const response = yield call(part.getParts, completePayload);
            yield put(listPartsOK(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        yield put(listPartsError("Get Parts failed"));
    }
}

export function* watchForGetParts() {
    yield takeLatest(PART_LIST_REQUESTED, getParts);
}