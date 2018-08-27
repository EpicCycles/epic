import {all} from 'redux-saga/effects';
import {watchForLoginUser} from "./user";
import {watchForGetCustomer, watchForGetCustomerList, watchForCreateCustomer, watchForDeleteCustomer, watchForSaveCustomer} from "./customer";
import {watchForCreateNote, watchForDeleteNote, watchForGetNoteList, watchForSaveNote} from "./note";

export default function* rootSaga() {
    yield all([
        watchForLoginUser(),
        watchForGetCustomerList(),
        watchForGetCustomer(),
        watchForCreateCustomer(),
        watchForDeleteCustomer(),
        watchForSaveCustomer(),
        watchForCreateNote(),
        watchForDeleteNote(),
        watchForSaveNote(),
        watchForGetNoteList()
    ]);
}
