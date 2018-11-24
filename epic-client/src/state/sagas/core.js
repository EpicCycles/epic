import history from "../../history";
import * as selectors from "../selectors/user";
import brand from "./apis/brand";
import supplier from "./apis/supplier";
import {
    BRANDS_AND_SUPPLIERS_REQUESTED,
    getBrandsAndSuppliersFailure,
    getBrandsAndSuppliersSuccess
} from "../actions/core";
import {sampleBrands, sampleSuppliers} from "../../helpers/sampleData";
import {call, put, select, takeLatest} from "redux-saga/effects";

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
        yield put(getBrandsAndSuppliersSuccess(sampleBrands, sampleSuppliers));

        // yield put(getBrandsAndSuppliersFailure("Get Brands and Suppliers Failed"));
    }
}


export function* watchForGetBrandsAndSuppliers() {
    yield takeLatest(BRANDS_AND_SUPPLIERS_REQUESTED, getBrandsAndSuppliers);
}