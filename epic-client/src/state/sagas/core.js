import history from "../../history";
import * as selectors from "../selectors/user";
import brand from "./apis/brand";
import supplier from "./apis/supplier";
import {
    BRANDS_AND_SUPPLIERS_REQUESTED,
    BRANDS_REQUESTED,
    BRANDS_SAVE_REQUESTED,
    getBrandsAndSuppliersFailure,
    getBrandsFailure,
    getBrandsAndSuppliersSuccess,
    getBrandsSuccess,
    saveBrandsFailure,
    saveBrandsSuccess,
    saveSupplierSuccess,
    saveSupplierFailure,
    SUPPLIER_SAVE_REQUESTED, SUPPLIER_DELETE_REQUESTED, deleteSupplierSuccess, deleteSupplierFailure
} from "../actions/core";
import {call, put, select, takeLatest} from "redux-saga/effects";
import {logError} from "../../helpers/api_error";

export function* getBrandsAndSuppliers(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = Object.assign(action.payload, { token });
            const brandsResponse = yield call(brand.getBrands, completePayload);
            const suppliersResponse = yield call(supplier.getSuppliers, completePayload);
            yield put(getBrandsAndSuppliersSuccess(brandsResponse.data, suppliersResponse.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        // yield put(getBrandsAndSuppliersSuccess(sampleBrands, sampleSuppliers));
        logError(error);
        yield put(getBrandsAndSuppliersFailure("Get Brands and Suppliers Failed"));
    }
}
export function* getBrands(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = Object.assign(action.payload, { token });
            const brandsResponse = yield call(brand.getBrands, completePayload);
            yield put(getBrandsSuccess(brandsResponse.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        // yield put(getBrandsAndSuppliersSuccess(sampleBrands, sampleSuppliers));
        logError(error);
        yield put(getBrandsFailure("Get Brands Failed"));
    }
}

export function* saveBrands(action) {
    try {
        const token = yield select(selectors.token);
        const brandsToSave = action.payload.filter(brand => (brand.delete || brand.changed));
        if (token && (brandsToSave.length > 0)) {
            const completePayload = Object.assign({ brands: brandsToSave }, { token });
            const saveBrandsResponse = yield call(brand.saveBrands, completePayload);
            yield put(saveBrandsSuccess(saveBrandsResponse.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        logError(error);
        yield put(saveBrandsFailure("Save Brands Failed"));
    }
}

export function* saveSupplier(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = Object.assign(action.payload, { token });
            let saveSupplierResponse;
            if (action.payload.supplier.id) {
                saveSupplierResponse = yield call(supplier.saveSupplier, completePayload);
            } else {
                saveSupplierResponse = yield call(supplier.createSupplier, completePayload);
            }
            yield put(saveSupplierSuccess(saveSupplierResponse.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        // yield put(getBrandsAndSuppliersSuccess(sampleBrands, sampleSuppliers));
        logError(error);
        yield put(saveSupplierFailure("Save Supplier Failed"));
    }
}

export function* deleteSupplier(action) {
    try {
        const token = yield select(selectors.token);
        if (token) {
            const completePayload = Object.assign(action.payload, { token });
            const response = yield call(supplier.deleteSupplier, completePayload);
            yield put(deleteSupplierSuccess(response.data));
        } else {
            yield call(history.push, "/login");
        }
    } catch (error) {
        // yield put(getBrandsAndSuppliersSuccess(sampleBrands, sampleSuppliers));
        logError(error);
        yield put(deleteSupplierFailure("Delete Supplier Failed"));
    }
}

export function* watchForGetBrandsAndSuppliers() {
    yield takeLatest(BRANDS_AND_SUPPLIERS_REQUESTED, getBrandsAndSuppliers);
}
export function* watchForGetBrands() {
    yield takeLatest(BRANDS_REQUESTED, getBrands);
}

export function* watchForSaveBrands() {
    yield takeLatest(BRANDS_SAVE_REQUESTED, saveBrands);
}

export function* watchForSaveSupplier() {
    yield takeLatest(SUPPLIER_SAVE_REQUESTED, saveSupplier);
}

export function* watchForDeleteSupplier() {
    yield takeLatest(SUPPLIER_DELETE_REQUESTED, deleteSupplier);
}
