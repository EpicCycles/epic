import history from '../../history';
import * as selectors from '../selectors/user';
import brand from './apis/brand';
import supplier from './apis/supplier';
import {
  getBrandsAndSuppliersFailure,
  getBrandsFailure,
  getBrandsAndSuppliersSuccess,
  getBrandsSuccess,
  saveBrandsFailure,
  saveBrandsSuccess,
  saveSupplierSuccess,
  saveSupplierFailure,
  deleteSupplierSuccess,
  deleteSupplierFailure,
  BRANDS,
  BRANDS_AND_SUPPLIERS,
  SUPPLIER_DELETE,
  SUPPLIER_SAVE,
  BRANDS_SAVE,
} from '../actions/core';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { errorAsMessage, logError } from '../../helpers/api_error';
import { sortObjectsByAttribute, updateObject, updateObjectInArray } from '../../helpers/utils';
import { archiveQuoteError } from '../actions/quote';

export function* getBrandsAndSuppliers(action) {
  try {
    const token = yield select(selectors.token);
    if (token) {
      const completePayload = updateObject(action.payload, { token });
      const brandsResponse = yield call(brand.getBrands, completePayload);
      const suppliersResponse = yield call(supplier.getSuppliers, completePayload);
      yield put(getBrandsAndSuppliersSuccess(brandsResponse.data, suppliersResponse.data));
    } else {
      yield call(history.push, '/login');
    }
  } catch (error) {
    // yield put(getBrandsAndSuppliersSuccess(sampleBrands, sampleSuppliers));
    logError(error);
    yield put(getBrandsAndSuppliersFailure('Get Brands and Suppliers Failed'));
  }
}
export function* getBrands(action) {
  try {
    const token = yield select(selectors.token);
    if (token) {
      const completePayload = updateObject(action.payload, { token });
      const brandsResponse = yield call(brand.getBrands, completePayload);
      yield put(getBrandsSuccess(brandsResponse.data));
    } else {
      yield call(history.push, '/login');
    }
  } catch (error) {
    // yield put(getBrandsAndSuppliersSuccess(sampleBrands, sampleSuppliers));
    logError(error);
    yield put(getBrandsFailure('Get Brands Failed'));
  }
}

export function* saveBrands(action) {
  try {
    const token = yield select(selectors.token);
    const brandsToSave = action.payload.filter(brand => brand.delete || brand.changed);
    let completeBrandsPostSave = action.payload.filter(brand => !brandsToSave.includes(brand));
    if (token) {
      if (brandsToSave.length > 0) {
        const completePayload = updateObject({ brands: brandsToSave }, { token });
        const saveBrandsResponse = yield call(brand.saveBrands, completePayload);
        saveBrandsResponse.data.forEach(
          returnedBrand =>
            (completeBrandsPostSave = updateObjectInArray(completeBrandsPostSave, returnedBrand)),
        );
      }
      completeBrandsPostSave = sortObjectsByAttribute(completeBrandsPostSave, 'brand_name');
      yield put(saveBrandsSuccess(completeBrandsPostSave));
    } else {
      yield call(history.push, '/login');
    }
  } catch (error) {
    logError(error);
    yield put(saveBrandsFailure('Save Brands Failed'));
  }
}

export function* saveSupplier(action) {
  try {
    const token = yield select(selectors.token);
    if (token) {
      const completePayload = updateObject(action.payload, { token });
      let saveSupplierResponse;
      if (action.payload.supplier.id) {
        saveSupplierResponse = yield call(supplier.saveSupplier, completePayload);
      } else {
        saveSupplierResponse = yield call(supplier.createSupplier, completePayload);
      }
      yield put(saveSupplierSuccess(saveSupplierResponse.data));
    } else {
      yield call(history.push, '/login');
    }
  } catch (error) {
    // yield put(getBrandsAndSuppliersSuccess(sampleBrands, sampleSuppliers));
    logError(error);
    yield put(saveSupplierFailure(errorAsMessage(error, 'Save Supplier Failed')));
  }
}

export function* deleteSupplier(action) {
  try {
    const token = yield select(selectors.token);
    if (token) {
      const completePayload = updateObject(action.payload, { token });
      const response = yield call(supplier.deleteSupplier, completePayload);
      yield put(deleteSupplierSuccess(response.data));
    } else {
      yield call(history.push, '/login');
    }
  } catch (error) {
    // yield put(getBrandsAndSuppliersSuccess(sampleBrands, sampleSuppliers));
    logError(error);
    yield put(deleteSupplierFailure('Delete Supplier Failed'));
  }
}

export function* watchForGetBrandsAndSuppliers() {
  yield takeLatest(`${BRANDS_AND_SUPPLIERS}_REQUESTED`, getBrandsAndSuppliers);
}
export function* watchForGetBrands() {
  yield takeLatest(`${BRANDS}_REQUESTED`, getBrands);
}

export function* watchForSaveBrands() {
  yield takeLatest(`${BRANDS_SAVE}_REQUESTED`, saveBrands);
}

export function* watchForSaveSupplier() {
  yield takeLatest(`${SUPPLIER_SAVE}_REQUESTED`, saveSupplier);
}

export function* watchForDeleteSupplier() {
  yield takeLatest(`${SUPPLIER_DELETE}_REQUESTED`, deleteSupplier);
}
