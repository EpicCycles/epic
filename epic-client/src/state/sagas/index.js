import {all} from 'redux-saga/effects';
import {watchForLoginUser} from "./user";
import {
    watchForGetCustomer,
    watchForGetCustomerList,
    watchForCreateCustomer,
    watchForDeleteCustomer,
    watchForSaveCustomer,
    watchForGetCustomerListPage, watchForSaveCustomerPhone, watchForDeleteCustomerPhone
} from "./customer";
import {watchForCreateNote, watchForDeleteNote, watchForGetNoteList, watchForSaveNote} from "./note";

export default function* rootSaga() {
    yield all([
        watchForLoginUser(),
        watchForGetCustomerList(),
        watchForGetCustomerListPage(),
        watchForGetCustomer(),
        watchForCreateCustomer(),
        watchForDeleteCustomer(),
        watchForSaveCustomer(),
        watchForDeleteCustomerPhone(),
        watchForSaveCustomerPhone(),
        watchForCreateNote(),
        watchForDeleteNote(),
        watchForSaveNote(),
        watchForGetNoteList()
    ]);
}
