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
    NOTE_REMOVE_ERROR,
    NOTE_SAVE,
    NOTE_SAVE_ERROR,
    NOTE_SAVE_REQUESTED
} from "../actions/note";

const initialState = {
    count: 0,
    isLoading: false,
    note: {},
    notes: [],
    searchCustomerId: "",
    searchQuoteId: "",
    searchCustomerVisible: false,
    page: 1,
    perPage: 20,
    error: ""
};

// this seemd to be the bit that is in reducers in loyalty code
const note = (state = initialState, action) => {
    switch (action.type) {
        case NOTE_REMOVE_ERROR:
            return {
                ...state,
                error: "Error removing note"
            };
        case NOTE_REMOVE:
            return {
                ...state,
                note: {},
                error: ""
            };
        case NOTE_LIST_REQUESTED:
            return {
                ...state,
                error: "",
                isLoading: true,
                notes: [],
                totalPages: 0
            };
        case NOTE_CREATE_REQUESTED:
            return {
                ...state,
                error: "",
                note: action.payload,
                isLoading: true,
            };
        case NOTE_SAVE_REQUESTED:
            return {
                ...state,
                error: "",
                note: action.payload,
                isLoading: true,
            };
        case NOTE_DELETE_REQUESTED:
            return {
                ...state,
                error: "",
                note: action.payload,
                isLoading: true,
            };

        case NOTE_LIST_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false,
                notes: [],
                totalPages: 0
            };
        case NOTE_SAVE_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };

        case NOTE_CREATE_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };
        case NOTE_DELETE_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };
        case NOTE_LIST:
            return {
                ...state,
                notes: action.payload,
                error: "",
                isLoading: !state.isLoading,
                page: 1,
                totalPages: Math.floor(action.payload.length / state.perPage) + 1
            };
        case NOTE_CREATE:
            return {
                ...state,
                error: "",
                isLoading: !state.isLoading,
                note: action.payload,
                page: 1,
                totalPages: Math.floor(action.payload.length / state.perPage) + 1
            };
        case NOTE_SAVE:
            return {
                ...state,
                error: "",
                isLoading: false,
                note: action.payload
            };
        case NOTE_DELETE:
            return {
                ...state,
                error: "",
                isLoading: false,
                note: {}
            };

        default:
            return state;
    }
};


export default note;