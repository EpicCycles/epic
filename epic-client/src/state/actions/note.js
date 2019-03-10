export const NOTE_LIST = 'note/NOTE_LIST';
export const NOTE_CREATE = 'note/NOTE_CREATE';
export const NOTE_SAVE = 'note/NOTE_SAVE';
export const NOTE_REMOVE = 'note/NOTE_REMOVE';
export const NOTE_DELETE = 'note/NOTE_DELETE';

export const removeNote = () => ({
    type: NOTE_REMOVE
});
export const getNoteList = (customerId, customerVisible, quoteId) => ({
    type: `${NOTE_LIST}_REQUESTED`,
    payload: { customerId, customerVisible, quoteId }
});

export const getNoteListSuccess = notes => ({
    type: NOTE_LIST,
    payload: notes
});

export const getNoteListFailure = error => ({
    type: `${NOTE_LIST}_ERROR`,
    payload: error
});

export const createNote = note => ({
    type: `${NOTE_CREATE}_REQUESTED`,
    payload: { note }
});

export const createNoteSuccess = notes => ({
    type: NOTE_CREATE,
    payload: notes
});

export const createNoteFailure = error => ({
    type: `${NOTE_CREATE}_ERROR`,
    payload: error
});

export const saveNote = note => ({
    type: `${NOTE_SAVE}_REQUESTED`,
    payload: { note }
});

export const saveNoteSuccess = note => ({
    type: NOTE_SAVE,
    payload: note
});

export const saveNoteFailure = error => ({
    type: `${NOTE_SAVE}_ERROR`,
    payload: error
});

export const deleteNote = note => ({
    type: `${NOTE_DELETE}_REQUESTED`,
    payload: { noteId: note.id }
});

export const deleteNoteSuccess = () => ({
    type: NOTE_DELETE
});

export const deleteNoteFailure = error => ({
    type: `${NOTE_DELETE}_ERROR`,
    payload: error
});
