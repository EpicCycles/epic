import {all} from 'redux-saga/effects';
import {watchForChangePassword, watchForChangeUserData, watchForLoginUser, watchForLogoutUser} from "./user";
import {
    watchForCreateCustomer,
    watchForDeleteCustomer,
    watchForDeleteCustomerAddress,
    watchForDeleteCustomerPhone,
    watchForGetCustomer,
    watchForGetCustomerList,
    watchForGetCustomerListPage,
    watchForSaveCustomer,
    watchForSaveCustomerAddress,
    watchForSaveCustomerPhone
} from "./customer";
import {watchForCreateNote, watchForDeleteNote, watchForGetNoteList, watchForSaveNote} from "./note";
import {watchForGetFramework, watchForSaveFramework} from "./framework";
import {
    watchForDeleteSupplier,
    watchForGetBrands,
    watchForGetBrandsAndSuppliers,
    watchForSaveBrands,
    watchForSaveSupplier
} from "./core";
import {
    watchForAddBikePart,
    watchForArchiveFrames,
    watchForDeleteBikePart,
    watchForDeleteBikes,
    watchForDeleteFrames,
    watchForGetFrames,
    watchForSaveBike,
    watchForSaveBikePart,
    watchForSaveFrame,
    watchForUploadFrame
} from "./bike";
import {watchForDeletePart, watchForGetParts, watchForSavePart, watchForUploadParts} from "./part";

export default function* rootSaga() {
    yield all([
        watchForLoginUser(),
        watchForLogoutUser(),
        watchForChangePassword(),
        watchForChangeUserData(),
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
        watchForSaveBike(),
        watchForSaveBikePart(),
        watchForDeleteBikePart(),
        watchForAddBikePart(),
        watchForSavePart(),
        watchForDeletePart(),
        watchForUploadParts(),
        watchForGetParts(),
    ]);
}
