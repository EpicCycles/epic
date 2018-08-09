export const NOTE_LIST_REQUESTED = 'note/NOTE_LIST_REQUESTED';
export const NOTE_LIST_ERROR = 'note/NOTE_LIST_ERROR';
export const NOTE_LIST = 'note/NOTE_LIST';
export const NOTE_CREATE_REQUESTED = 'note/NOTE_CREATE_REQUESTED';
export const NOTE_CREATE_ERROR = 'note/NOTE_CREATE_ERROR';
export const NOTE_CREATE = 'note/NOTE_CREATE';
export const NOTE_REMOVE_ERROR = 'note/NOTE_REMOVE_ERROR';
export const NOTE_SAVE_REQUESTED = 'note/NOTE_SAVE_REQUESTED';
export const NOTE_SAVE_ERROR = 'note/NOTE_SAVE_ERROR';
export const NOTE_SAVE = 'note/NOTE_SAVE';
export const NOTE_REMOVE = 'note/NOTE_REMOVE';
export const NOTE_DELETE_REQUESTED = 'note/NOTE_DELETE_REQUESTED';
export const NOTE_DELETE_ERROR = 'note/NOTE_DELETE_ERROR';
export const NOTE_DELETE = 'note/NOTE_DELETE';

export const removeNoteError = () => ({
    type: NOTE_REMOVE_ERROR
});
export const removeNote = () => ({
    type: NOTE_REMOVE
});
export const getNoteList =  (customerId, customerVisible, quoteId)  => ({
    type: NOTE_LIST_REQUESTED,
    payload: {customerId, customerVisible, quoteId}
});

export const getNoteListSuccess = notes => ({
    type: NOTE_LIST,
    payload: notes
});

export const getNoteListFailure = error => ({
    type: NOTE_LIST_ERROR,
    payload: error
});

export const createNote =  note  => ({
    type: NOTE_CREATE_REQUESTED,
    payload: note
});

export const createNoteSuccess = notes => ({
    type: NOTE_CREATE,
    payload: notes
});

export const createNoteFailure = error => ({
    type: NOTE_CREATE_ERROR,
    payload: error
});

export const saveNote =  note  => ({
    type: NOTE_SAVE_REQUESTED,
    payload: note
});

export const saveNoteSuccess = note => ({
    type: NOTE_SAVE,
    payload: note
});

export const saveNoteFailure = error => ({
    type: NOTE_SAVE_ERROR,
    payload: error
});

export const deleteNote =  note  => ({
    type: NOTE_DELETE_REQUESTED,
    payload: note.id
});

export const deleteNoteSuccess = () => ({
    type: NOTE_DELETE
});

export const deleteNoteFailure = error => ({
    type: NOTE_DELETE_ERROR,
    payload: error
});
