export const REMOVE_MESSAGE = 'application/REMOVE_MESSAGE';
export const ADD_MESSAGE = 'application/ADD_MESSAGE';
export const removeMessage = () => ({
    type: REMOVE_MESSAGE
});
export const addMessage = (messageText, messageType) => ({
    type: ADD_MESSAGE    ,
    payload: { messageText, messageType }
});