import {all} from 'redux-saga/effects';
import {watchForLoginUser} from "./user";
import {
    watchForGetCustomer,
    watchForGetCustomerList,
    watchForCreateCustomer,
    watchForDeleteCustomer,
    watchForSaveCustomer,
    watchForGetCustomerListPage,
    watchForSaveCustomerPhone, watchForDeleteCustomerPhone,
    watchForSaveCustomerAddress, watchForDeleteCustomerAddress
} from "./customer";
import {watchForCreateNote, watchForDeleteNote, watchForGetNoteList, watchForSaveNote} from "./note";
import {
    watchForGetFramework,
    watchForSaveFramework
} from "./framework";
import {
    watchForGetBrandsAndSuppliers,
    watchForGetBrands, watchForSaveBrands,
    watchForDeleteSupplier,
    watchForSaveSupplier
} from "./core";
import {
    watchForSaveFrame,
    watchForGetFrames,
    watchForUploadFrame,
    watchForArchiveFrames,
    watchForDeleteFrames,
    watchForDeleteBikes,
    watchForReviewBikeStart, watchForReviewBike
} from "./bike";

export default function* rootSaga() {
    yield all([
        watchForLoginUser(),
        watchForGetFramework(),
        watchForSaveFramework(),
        watchForGetCustomerList(),
        watchForGetCustomerListPage(),
        watchForGetCustomer(),
        watchForCreateCustomer(),
        watchForDeleteCustomer(),
        watchForSaveCustomer(),
        watchForDeleteCustomerAddress(),
        watchForSaveCustomerAddress(),
        watchForDeleteCustomerPhone(),
        watchForSaveCustomerPhone(),
        watchForCreateNote(),
        watchForDeleteNote(),
        watchForSaveNote(),
        watchForGetNoteList(),
        watchForGetBrandsAndSuppliers(),
        watchForGetBrands(),
        watchForSaveBrands(),
        watchForSaveSupplier(),
        watchForDeleteSupplier(),
        watchForArchiveFrames(),
        watchForSaveFrame(),
        watchForUploadFrame(),
        watchForGetFrames(),
        watchForDeleteFrames(),
        watchForDeleteBikes(),
        watchForReviewBikeStart(),
        watchForReviewBike()
    ]);
}
