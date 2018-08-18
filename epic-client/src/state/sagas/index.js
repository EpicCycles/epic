import {all} from 'redux-saga/effects';
import {watchForLoginUser} from "./user";
import {watchForGetCustomer, watchForGetCustomerList} from "./customer";
import {watchForCreateNote, watchForDeleteNote, watchForGetNoteList, watchForSaveNote} from "./note";

export default function* rootSaga() {
    yield all([
        watchForLoginUser(),
        watchForGetCustomerList(),
        watchForGetCustomer(),
        watchForCreateNote(),
        watchForDeleteNote(),
        watchForSaveNote(),
        watchForGetNoteList()
    ]);
}
