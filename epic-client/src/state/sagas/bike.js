import {call, put, select, takeLatest} from "redux-saga/effects";
import * as selectors from "../selectors/user";
import bike from "./apis/bike";
import history from "../../history";
import {
    archiveFramesError,
    archiveFramesSuccess,
    FRAME_ARCHIVE_REQUESTED,
    FRAME_LIST_REQUESTED,
    FRAME_SAVE_REQUESTED,
    FRAME_UPLOAD_REQUESTED,
    getFrameListError,
    getFrameListOK,
    saveFrameError,
    saveFrameSuccess,
    uploadFrameError,
    uploadFrameSuccess,
} from "../actions/bike";

export function* archiveFrames(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const frameIdsToArchive = action.payload.frameArchiveList;
            const searchCriteria = action.payload.searchCriteria;

            yield frameIdsToArchive.forEach(frameId => {
                const frame = { id: frameId, archived: true };
                return bike.saveFrame({ frame, token });
            });
            if (searchCriteria && searchCriteria.brand) {
                const searchPayload = Object.assign(searchCriteria, { token });
                const searchResponse = yield call(bike.getFrames, searchPayload);
                yield put(getFrameListOK(searchResponse.data));
            } else {
                yield put(archiveFramesSuccess());
            }
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        yield put(archiveFramesError("Archive Frames failed"));
    }
}

export function* watchForArchiveFrames() {
    yield takeLatest(FRAME_ARCHIVE_REQUESTED, archiveFrames);
}

export function* saveFrame(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = Object.assign(action.payload, { token });
            const response = yield call(bike.saveFrame, completePayload);
            if (completePayload.searchCriteria) {
                const searchPayload = Object.assign(completePayload.searchCriteria, { token });
                const searchResponse = yield call(bike.getFrames, searchPayload);
                yield put(getFrameListOK(searchResponse.data));
            } else {
                yield put(saveFrameSuccess(response.data));
            }
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        yield put(saveFrameError("Save Frame failed"));
    }
}

export function* watchForSaveFrame() {
    yield takeLatest(FRAME_SAVE_REQUESTED, saveFrame);
}

export function* uploadFrame(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = Object.assign(action.payload, { token });
            const response = yield call(bike.uploadFrame, completePayload);
            yield put(uploadFrameSuccess(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        yield put(uploadFrameError("Save Frame failed"));
    }
}

export function* watchForUploadFrame() {
    yield takeLatest(FRAME_UPLOAD_REQUESTED, uploadFrame);
}

export function* getFrames(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = Object.assign(action.payload, { token });
            const response = yield call(bike.getFrames, completePayload);
            yield put(getFrameListOK(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        yield put(getFrameListError("Get Frames failed"));
    }
}

export function* watchForGetFrames() {
    yield takeLatest(FRAME_LIST_REQUESTED, getFrames);
}
