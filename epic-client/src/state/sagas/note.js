import {call, put, select, takeLatest} from 'redux-saga/effects';
import {
    createNoteFailure,
    createNoteSuccess,
    deleteNoteFailure,
    deleteNoteSuccess,
    getNoteListFailure,
    getNoteListSuccess,
    NOTE_CREATE_REQUESTED,
    NOTE_DELETE_REQUESTED,
    NOTE_LIST_REQUESTED,
    NOTE_SAVE_REQUESTED,
    saveNoteFailure,
    saveNoteSuccess
} from "../actions/note";

import api from './api';
import * as selectors from "../selectors/user";
import history from "../../history";
import {updateObject} from "../../helpers/utils";

export function* getNoteList(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const response = yield call(api.getNoteList, completePayload);
            yield put(getNoteListSuccess(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        yield put(getNoteListFailure(error));
    }
}

export function* watchForGetNoteList() {
    yield takeLatest(NOTE_LIST_REQUESTED, getNoteList);
}

export function* createNote(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const response = yield call(api.createNote, completePayload);
            yield put(createNoteSuccess(response.data));
        } else {
            yield call(history.push, "/login");
        }

    } catch (error) {
        yield put(createNoteFailure("Create Note failed"));
        // yield put(history.push("/note"));
    }
}

export function* watchForCreateNote() {
    yield takeLatest(NOTE_CREATE_REQUESTED, createNote);
}

export function* saveNote(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const response = yield call(api.saveNote, completePayload);
            yield put(saveNoteSuccess(response.data));
        } else {
            yield call(history.push, "/login");
        }

    } catch (error) {
        yield put(saveNoteFailure("Note save failed"));
    }
}

export function* watchForSaveNote() {
    yield takeLatest(NOTE_SAVE_REQUESTED, saveNote);
}

export function* deleteNote(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = updateObject(action.payload, { token });
            const response = yield call(api.deleteNote, completePayload);
            yield put(deleteNoteSuccess(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        yield put(deleteNoteFailure("Note delete failed"));
    }
}

export function* watchForDeleteNote() {
    yield takeLatest(NOTE_DELETE_REQUESTED, deleteNote);
}