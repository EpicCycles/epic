import {call, put, takeLatest} from 'redux-saga/effects';
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

export function* getNoteList(action) {
    try {
        const response = yield call(api.getNoteList, action.payload);
        yield put(getNoteListSuccess(response.data));
    } catch (error) {
        yield put(getNoteListFailure(error));
    }
}

export function* watchForGetNoteList() {
    yield takeLatest(NOTE_LIST_REQUESTED, getNoteList);
}

export function* createNote(action) {
    try {
        const response = yield call(api.createNote, action.payload);
        yield put(createNoteSuccess(response.data));

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
        const response = yield call(api.saveNote, action.payload);
        yield put(saveNoteSuccess(response.data));

    } catch (error) {
        yield put(saveNoteFailure("Note save failed"));
    }
}

export function* watchForSaveNote() {
    yield takeLatest(NOTE_SAVE_REQUESTED, saveNote);
}

export function* deleteNote(action) {
    try {
        const response = yield call(api.deleteNote, action.payload);
        yield put(deleteNoteSuccess(response.data));

    } catch (error) {
        yield put(deleteNoteFailure("Note delete failed"));
    }
}

export function* watchForDeleteNote() {
    yield takeLatest(NOTE_DELETE_REQUESTED, deleteNote);
}