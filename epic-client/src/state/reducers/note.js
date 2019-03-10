import {
    NOTE_CREATE,
     NOTE_DELETE,
    NOTE_LIST,
     NOTE_REMOVE,
    NOTE_SAVE,
 } from "../actions/note";
import {CLEAR_ALL_STATE} from "../actions/application";
import {USER_LOGOUT, USER_NOT_VALIDATED} from "../actions/user";
import {removeKey} from "../../helpers/utils";
import {CUSTOMER} from "../actions/customer";

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
        case CUSTOMER:
                return {
                ...state,
                notes: action.payload.notes,
            };
        case NOTE_REMOVE:
            return removeKey(state, 'note')
        case `${NOTE_LIST}_REQUESTED`:
            return {
                ...state,
                isLoading: true,
                notes: [],
                totalPages: 0
            };
        case `${NOTE_CREATE}_REQUESTED`:
        case `${NOTE_SAVE}_REQUESTED`:
        case `${NOTE_DELETE}_REQUESTED`:
            return {
                ...state,
                isLoading: true,
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
                page: 1,
                totalPages: Math.floor(action.payload.length / state.perPage) + 1
            };
        case NOTE_CREATE:
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