import {
    NOTE_CREATE,
    NOTE_CREATE_ERROR,
    NOTE_CREATE_REQUESTED,
    NOTE_DELETE,
    NOTE_DELETE_ERROR,
    NOTE_DELETE_REQUESTED,
    NOTE_LIST,
    NOTE_LIST_ERROR,
    NOTE_LIST_REQUESTED,
    NOTE_REMOVE,
    NOTE_SAVE,
    NOTE_SAVE_ERROR,
    NOTE_SAVE_REQUESTED
} from "../actions/note";
import {USER_NOT_VALIDATED} from "../actions/user";
import {CLEAR_ALL_STATE} from "../actions/application";

const initialState = {
    count: 0,
    isLoading: false,
    note: {},
    notes: [],
    searchCustomerId: "",
    searchQuoteId: "",
    searchCustomerVisible: false,
    page: 1,
    perPage: 20
};

// this seemd to be the bit that is in reducers in loyalty code
const note = (state = initialState, action) => {
    switch (action.type) {
         case CLEAR_ALL_STATE:
             return initialState;
       case USER_NOT_VALIDATED:
            return {
                ...state,
                isLoading: false
            };
        case NOTE_REMOVE:
            return {
                ...state,
                note: {}
            };
        case NOTE_LIST_REQUESTED:
            return {
                ...state,
                isLoading: true,
                notes: [],
                totalPages: 0
            };
        case NOTE_CREATE_REQUESTED:
            return {
                ...state,
                note: action.payload.note,
                isLoading: true,
            };
        case NOTE_SAVE_REQUESTED:
            return {
                ...state,
                note: action.payload.note,
                isLoading: true,
            };
        case NOTE_DELETE_REQUESTED:
            return {
                ...state,
                note: action.payload.note,
                isLoading: true,
            };

        case NOTE_LIST_ERROR:
            return {
                ...state,
                isLoading: false,
                notes: [],
                totalPages: 0
            };
        case NOTE_SAVE_ERROR:
            return {
                ...state,
                isLoading: false
            };

        case NOTE_CREATE_ERROR:
            return {
                ...state,
                isLoading: false
            };
        case NOTE_DELETE_ERROR:
            return {
                ...state,
                isLoading: false
            };
        case NOTE_LIST:
            return {
                ...state,
                notes: action.payload,
                isLoading: !state.isLoading,
                page: 1,
                totalPages: Math.floor(action.payload.length / state.perPage) + 1
            };
        case NOTE_CREATE:
            return {
                ...state,
                isLoading: !state.isLoading,
                note: action.payload,
                page: 1,
                totalPages: Math.floor(action.payload.length / state.perPage) + 1
            };
        case NOTE_SAVE:
            return {
                ...state,
                isLoading: false,
                note: action.payload
            };
        case NOTE_DELETE:
            return {
                ...state,
                isLoading: false,
                note: {}
            };

        default:
            return state;
    }
};


export default note;