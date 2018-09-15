import {ADD_MESSAGE, CLEAR_ALL_STATE, REMOVE_MESSAGE} from "../actions/application";
import {
    CUSTOMER_ADDRESS_DELETE,
    CUSTOMER_ADDRESS_DELETE_ERROR,
    CUSTOMER_ADDRESS_DELETE_REQUEST, CUSTOMER_ADDRESS_SAVE_ERROR,
    CUSTOMER_ADDRESS_SAVE_REQUEST,
    CUSTOMER_CREATE_ERROR,
    CUSTOMER_CREATE_REQUESTED,
    CUSTOMER_DELETE,
    CUSTOMER_DELETE_ERROR,
    CUSTOMER_DELETE_REQUESTED,
    CUSTOMER_LIST_ERROR,
    CUSTOMER_LIST_REQUESTED,
    CUSTOMER_PHONE_DELETE,
    CUSTOMER_PHONE_DELETE_ERROR,
    CUSTOMER_PHONE_DELETE_REQUEST,
    CUSTOMER_PHONE_SAVE_ERROR,
    CUSTOMER_PHONE_SAVE_REQUEST,
    CUSTOMER_REQUESTED,
    CUSTOMER_SAVE_ERROR,
    CUSTOMER_SAVE_REQUESTED
} from "../actions/customer";
import {
    NOTE_CREATE_ERROR, NOTE_CREATE_REQUESTED,
    NOTE_DELETE_ERROR, NOTE_DELETE_REQUESTED,
    NOTE_LIST_ERROR, NOTE_LIST_REQUESTED,
    NOTE_SAVE_ERROR, NOTE_SAVE_REQUESTED, NOTE_REMOVE
} from "../actions/note";
import {USER_LOGIN_ERROR} from "../actions/user";

const initialState = {
    message: "",
    messageType: ""
};

const application = (state = initialState, action) => {
    switch (action.type) {
        case CUSTOMER_DELETE:
            return {
                ...state,
                message: "Customer deleted",
                messageType: "I"
            };
        case CUSTOMER_PHONE_DELETE:
            return {
                ...state,
                message: "Customer Phone deleted",
                messageType: "I"
            };
        case CUSTOMER_ADDRESS_DELETE:
            return {
                ...state,
                message: "Customer Address deleted",
                messageType: "I"
            };
        case ADD_MESSAGE:
            return {
                ...state,
                message: action.payload.messageText,
                messageType: action.payload.messageType
            };
        case CUSTOMER_CREATE_REQUESTED:
        case CUSTOMER_DELETE_REQUESTED:
        case CUSTOMER_LIST_REQUESTED:
        case CUSTOMER_REQUESTED:
        case CUSTOMER_SAVE_REQUESTED:
        case CUSTOMER_PHONE_DELETE_REQUEST:
        case CUSTOMER_PHONE_SAVE_REQUEST:
        case CUSTOMER_ADDRESS_DELETE_REQUEST:
        case CUSTOMER_ADDRESS_SAVE_REQUEST:
        case NOTE_CREATE_REQUESTED:
        case NOTE_SAVE_REQUESTED:
        case NOTE_DELETE_REQUESTED:
        case NOTE_LIST_REQUESTED:
        case NOTE_REMOVE:
        case REMOVE_MESSAGE:
        case CLEAR_ALL_STATE:
            return initialState;
        case CUSTOMER_LIST_ERROR:
        case CUSTOMER_CREATE_ERROR:
        case CUSTOMER_DELETE_ERROR:
        case CUSTOMER_SAVE_ERROR:
        case CUSTOMER_PHONE_DELETE_ERROR:
        case CUSTOMER_ADDRESS_SAVE_ERROR:
        case NOTE_LIST_ERROR:
        case NOTE_SAVE_ERROR:
        case NOTE_CREATE_ERROR:
        case NOTE_DELETE_ERROR:
        case USER_LOGIN_ERROR:
            return {
                ...state,
                message: action.payload,
                messageType: "E"
            };
        case CUSTOMER_ADDRESS_DELETE_ERROR:
        case CUSTOMER_PHONE_SAVE_ERROR:
            return {
                ...state,
                message: action.payload.error,
                messageType: "E"
            };
        default:
            return state;
    }
};

export default application;