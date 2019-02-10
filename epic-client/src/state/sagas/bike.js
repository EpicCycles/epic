import {call, put, select, takeLatest} from "redux-saga/effects";
import * as selectors from "../selectors/user";
import bike from "./apis/bike";
import history from "../../history";
import {
    archiveFramesError,
    archiveFramesSuccess,
    BIKE_DELETE_REQUESTED,
    BIKE_REVIEW_BIKE,
    BIKE_REVIEW_REQUESTED,
    bikeDeleted,
    deleteBikesError,
    deleteBikesSuccess,
    deleteFramesError,
    deleteFramesSuccess,
    FRAME_ARCHIVE_REQUESTED,
    FRAME_DELETE_REQUESTED,
    FRAME_LIST_REQUESTED,
    FRAME_SAVE_REQUESTED,
    FRAME_UPLOAD_REQUESTED,
    getFrameListError,
    getFrameListOK,
    saveFrameError,
    saveFrameSuccess,
    uploadFrameError,
    uploadFrameSuccess,
    reviewBike,
    reviewBikeError,
    reviewBikeOK,
    saveBikeError,
    saveBikeOK,
    BIKE_SAVE_REQUESTED,
    saveBikePartOK,
    saveBikePartError,
    BIKE_PART_SAVE_REQUESTED,
    deleteBikePartOK,
    BIKE_PART_DELETE_REQUESTED,
    addBikePartOK,
    addBikePartError,
    BIKE_ADD_PART_REQUESTED,
    deleteBikePartError, getFrameList,
} from "../actions/bike";
import {logError} from "../../helpers/api_error";
import {addMessage} from "../actions/application";
import {INFO_MESSAGE, UPLOAD_PARTIAL_SUCCESS, UPLOAD_SUCCESS, WARNING_MESSAGE} from "../../helpers/messages";
import {updateObject} from "../../helpers/utils";


export function* saveBike(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const response = yield call(bike.saveBike, completePayload);
            yield put(saveBikeOK(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        logError(error);
        yield put(saveBikeError("Save Bike failed"));
    }
}

export function* watchForSaveBike() {
    yield takeLatest(BIKE_SAVE_REQUESTED, saveBike);
}

export function* addBikePart(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            yield call(bike.addBikePart, completePayload);
            const response = yield call(bike.getBikeParts, completePayload);
            yield put(addBikePartOK(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        logError(error);
        yield put(addBikePartError("Add Bike Part failed"));
    }
}

export function* watchForAddBikePart() {
    yield takeLatest(BIKE_ADD_PART_REQUESTED, addBikePart);
}
export function* saveBikePart(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            yield call(bike.saveBikePart, completePayload);
            const response = yield call(bike.getBikeParts, completePayload);
            yield put(saveBikePartOK(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        logError(error);
        yield put(saveBikePartError("Save Bike Part failed"));
    }
}

export function* watchForSaveBikePart() {
    yield takeLatest(BIKE_PART_SAVE_REQUESTED, saveBikePart);
}

export function* deleteBikePart(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            yield call(bike.deleteBikePart, completePayload);
            const response = yield call(bike.getBikeParts, completePayload);
            yield put(deleteBikePartOK(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        logError(error);
        yield put(deleteBikePartError("Delete Bike Part failed"));
    }
}

export function* watchForDeleteBikePart() {
    yield takeLatest(BIKE_PART_DELETE_REQUESTED, deleteBikePart);
}

export function* deleteBikes(bikeIdsToDelete, token) {
    try {
        for (let i = 0; i < bikeIdsToDelete.length; i++) {
            yield call(bike.deleteBike, { bikeId: bikeIdsToDelete[i], token });
            yield put(bikeDeleted(bikeIdsToDelete[i]));
        }

    } catch (error) {
        logError(error);
        yield put(deleteBikesError("Delete Bikes failed"));
    }
}

export function* deleteBikesAndGetList(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const bikeIdsToDelete = action.payload.bikeDeleteList;
            const searchCriteria = action.payload.searchCriteria;

            if (bikeIdsToDelete && bikeIdsToDelete.length > 0) {
                yield* deleteBikes(bikeIdsToDelete, token);
            }

            if (searchCriteria && searchCriteria.brand) {
                const searchPayload = updateObject(searchCriteria, { token });
                const searchResponse = yield call(bike.getFrames, searchPayload);
                yield put(getFrameListOK(searchResponse.data));
            } else {
                yield put(deleteBikesSuccess());
            }
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        logError(error);
        yield put(deleteBikesError("Delete Bikes failed"));
    }
}

export function* watchForDeleteBikes() {
    yield takeLatest(BIKE_DELETE_REQUESTED, deleteBikesAndGetList);
}

export function* deleteFrames(frameIdsToDelete, token) {
    try {
        for (let i = 0; i < frameIdsToDelete.length; i++) {
            yield call(bike.deleteFrame, { frameId: frameIdsToDelete[i], token });
        }

    } catch (error) {
        logError(error);
        yield put(deleteFramesError("Delete Frames failed"));
    }
}

export function* deleteFramesAndGetList(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const frameIdsToDelete = action.payload.frameDeleteList;
            const searchCriteria = action.payload.searchCriteria;

            if (frameIdsToDelete && frameIdsToDelete.length > 0) {
                yield* deleteFrames(frameIdsToDelete, token);
            }

            if (searchCriteria && searchCriteria.brand) {
                const searchPayload = updateObject(searchCriteria, { token });
                const searchResponse = yield call(bike.getFrames, searchPayload);
                yield put(getFrameListOK(searchResponse.data));
            } else {
                yield put(deleteFramesSuccess());
            }
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        logError(error);
        yield put(deleteFramesError("Delete Frames failed"));
    }
}

export function* watchForDeleteFrames() {
    yield takeLatest(FRAME_DELETE_REQUESTED, deleteFramesAndGetList);
}
export function* archiveFrames(frameIdsToArchive, token) {
    try {
        for (let i = 0; i < frameIdsToArchive.length; i++) {
            const frame = { id: frameIdsToArchive[i], archived: true };
            yield call(bike.saveFrame, { frame, token });
        }

    } catch (error) {
        yield put(archiveFramesError("Archive Frames failed"));
    }
}

export function* archiveFramesAndGetList(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const frameIdsToArchive = action.payload.frameArchiveList;
            const searchCriteria = action.payload.searchCriteria;

            if (frameIdsToArchive && frameIdsToArchive.length > 0) {
                yield* archiveFrames(frameIdsToArchive, token);
            }

            if (searchCriteria && searchCriteria.brand) {
                const searchPayload = updateObject(searchCriteria, { token });
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
    yield takeLatest(FRAME_ARCHIVE_REQUESTED, archiveFramesAndGetList);
}

export function* saveFrame(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const response = yield call(bike.saveFrame, completePayload);
            if (completePayload.searchCriteria) {
                const searchPayload = updateObject(completePayload.searchCriteria, { token });
                const searchResponse = yield call(bike.getFrames, searchPayload);
                yield put(getFrameListOK(searchResponse.data));
            } else {
                yield put(saveFrameSuccess(response.data));
            }
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        logError(error);
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
            const completePayload = updateObject(action.payload, { token });
            const response = yield call(bike.uploadFrame, completePayload);
            console.log("response from save",response)
            console.log(response.data);
            console.log(response.status);
            console.log(response.statusText);
            console.log(response.headers);
            if (response.status === 201) {
                yield put(addMessage(UPLOAD_SUCCESS, INFO_MESSAGE));
            } else {
                yield put(addMessage(UPLOAD_PARTIAL_SUCCESS, WARNING_MESSAGE));
            }
            const searchCriteria = {brand:action.payload.frame.brand, frameName: action.payload.frame.frame_name, archived: false};
            yield put(uploadFrameSuccess());
            yield put(getFrameList(searchCriteria));
            yield call(history.push, "/bike-review");
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        logError(error);
        yield put(uploadFrameError("Upload Frame failed"));
    }
}

export function* watchForUploadFrame() {
    yield takeLatest(FRAME_UPLOAD_REQUESTED, uploadFrame);
}

export function* getFrames(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
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
