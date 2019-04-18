export const REMOVE_MESSAGE = 'application/REMOVE_MESSAGE';
export const ADD_MESSAGE = 'application/ADD_MESSAGE';
export const CLEAR_ALL_STATE = 'application/CLEAR_ALL_STATE';
export const SAVE_STATE_LOCALLY = 'application/SAVE_STATE_LOCALLY';
export const GET_LOCAL_STATE = 'application/GET_LOCAL_STATE';
export const removeMessage = () => ({
    type: REMOVE_MESSAGE
});
export const addMessage = (messageText, messageType) => ({
    type: ADD_MESSAGE,
    payload: { messageText, messageType }
});
export const clearAllState = () => ({
    type: CLEAR_ALL_STATE
});
export const saveStateToLocalStorage = () => ({
    type: SAVE_STATE_LOCALLY
});
export const setStateFromLocalStorage = (user, token) => ({
    type: GET_LOCAL_STATE,
    payload: {user, token}
});