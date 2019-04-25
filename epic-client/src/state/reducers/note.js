import {NOTE_CREATE, NOTE_DELETE, NOTE_LIST, NOTE_SAVE,} from "../actions/note";
import {CLEAR_ALL_STATE} from "../actions/application";
import {USER_LOGOUT, USER_NOT_VALIDATED} from "../actions/user";
import {CUSTOMER} from "../actions/customer";
import {addItemsToArrayAtStart, removeItemFromArray} from "../../helpers/utils";
import {COPY_QUOTE, CREATE_QUOTE, FIND_QUOTES, GET_QUOTE, UPDATE_QUOTE} from "../actions/quote";

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
        case USER_LOGOUT:
            return initialState;
        case CUSTOMER:
            return {
                ...state,
                notes: action.payload.notes,
            };
        case `${NOTE_LIST}_REQUESTED`:
            return {
                ...state,
                isLoading: true,
                notes: [],
                totalPages: 0
            };
        case `${NOTE_CREATE}_REQUESTED`:
            return {
                ...state,
                isLoading: true,
            };
        case `${NOTE_SAVE}_REQUESTED`:
        case `${NOTE_DELETE}_REQUESTED`:
            return {
                ...state,
                isLoading: true,
                noteId: action.payload,
            };

        case `${NOTE_LIST}_ERROR`:
            return {
                ...state,
                isLoading: false,
                notes: [],
                totalPages: 0
            };
        case `${NOTE_SAVE}_ERROR`:
        case USER_NOT_VALIDATED:
        case `${NOTE_CREATE}_ERROR`:
        case `${NOTE_DELETE}_ERROR`:
            return {
                ...state,
                isLoading: false
            };
        case NOTE_LIST:
            return {
                ...state,
                notes: action.payload,
                isLoading: !state.isLoading,
            };
        case NOTE_CREATE:
        case NOTE_SAVE:
            return {
                ...state,
                isLoading: false,
                notes: addItemsToArrayAtStart(state.notes, action.payload),
                noteId: undefined,
            };
        case `${CREATE_QUOTE}_OK`:
        case `${GET_QUOTE}_OK`:
        case `${COPY_QUOTE}_OK`:
        case `${UPDATE_QUOTE}_OK`:
            return {
                ...state,
                isLoading: false,
                notes: addItemsToArrayAtStart(state.notes, action.payload.notes),
                noteId: undefined,
            };
        case NOTE_DELETE:
            return {
                ...state,
                isLoading: false,
                notes: removeItemFromArray(state.notes, state.noteId),
                noteId: undefined,
            };

        default:
            return state;
    }
};


export default note;