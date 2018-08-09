import {all} from 'redux-saga/effects';
import {watchForGetCustomer, watchForGetCustomerList} from "./customer";
import {watchForCreateNote, watchForDeleteNote, watchForGetNoteList, watchForSaveNote} from "./note";

export default function* rootSaga() {
    yield all([
        watchForGetCustomerList(),
        watchForGetCustomer(),
        watchForCreateNote(),
        watchForDeleteNote(),
        watchForSaveNote(),
        watchForGetNoteList()
    ]);
}
