import { call, put, select, takeLatest } from 'redux-saga/effects';
import * as selectors from '../selectors/user';
import part from './apis/part';
import history from '../../history';
import {
  deletePartError,
  deletePartOK,
  deleteSupplierProductError,
  deleteSupplierProductOK,
  listPartsError,
  listPartsOK,
  PART_AND_PRODUCT_MULTI_SAVE,
  PART_DELETE,
  PART_LIST,
  PART_SAVE,
  PART_UPLOAD,
  savePartError,
  savePartOK,
  savePartsAndProductsOK,
  saveSupplierProductError,
  saveSupplierProductOK,
  SUPPLIER_PRODUCT_DELETE,
  SUPPLIER_PRODUCT_SAVE,
  uploadPartsError,
  uploadPartsOK,
} from '../actions/part';
import { logError } from '../../helpers/api_error';
import { updateObject, updateObjectWithApiErrors } from '../../helpers/utils';
import { getModelKey } from '../../components/app/model/helpers/model';

export function* savePart(action) {
  const partToSave = action.payload.part;
  try {
    const token = yield select(selectors.token);
    if (token) {
      const completePayload = updateObject(action.payload, { token });
      let response;
      if (partToSave.id) {
        response = yield call(part.savePart, completePayload);
      } else {
        response = yield call(part.createPart, completePayload);
      }
      yield put(savePartOK(response.data, getModelKey(part)));
    } else {
      yield call(history.push, '/login');
    }
  } catch (apiError) {
    const error = 'Part save failed';
    let error_detail;
    logError(apiError);
    if (apiError.response) {
      error_detail = apiError.response.data;
    }
    yield put(savePartError({ partToSave, error, error_detail }));
  }
}

export function* watchForSavePart() {
  yield takeLatest(`${PART_SAVE}_REQUESTED`, savePart);
}

export function* deletePart(action) {
  try {
    const token = yield select(selectors.token);
    const listCriteria = action.payload.listCriteria;

    if (token) {
      const completePayload = updateObject(action.payload, { token });
      yield call(part.deletePart, completePayload);
      yield put(deletePartOK(action.payload.partId));
      if (listCriteria) {
        const searchPayload = { listCriteria, token };
        const response = yield call(part.getParts, searchPayload);
        yield put(listPartsOK(response.data));
      }
    } else {
      yield call(history.push, '/login');
    }
  } catch (error) {
    logError(error);
    yield put(deletePartError('Delete Part failed'));
  }
}

export function* watchForDeletePart() {
  yield takeLatest(`${PART_DELETE}_REQUESTED`, deletePart);
}

export function* uploadParts(action) {
  try {
    const token = yield select(selectors.token);
    if (token) {
      const completePayload = updateObject(action.payload, { token });
      const response = yield call(part.uploadParts, completePayload);
      yield put(uploadPartsOK(response.data));
      yield call(history.push, '/product-review');
    } else {
      yield call(history.push, '/login');
    }
  } catch (error) {
    logError(error);
    yield put(uploadPartsError('Save Parts failed'));
  }
}

export function* watchForUploadParts() {
  yield takeLatest(`${PART_UPLOAD}_REQUESTED`, uploadParts);
}

export function* getParts(action) {
  try {
    const token = yield select(selectors.token);
    if (token) {
      const completePayload = updateObject(action.payload, { token });
      const response = yield call(part.getParts, completePayload);
      yield put(listPartsOK(response.data));
    } else {
      yield call(history.push, '/login');
    }
  } catch (error) {
    logError(error);
    yield put(listPartsError('Get Parts failed'));
  }
}

export function* watchForGetParts() {
  yield takeLatest(`${PART_LIST}_REQUESTED`, getParts);
}
export function* saveSupplierProduct(action) {
  const supplierProduct = action.payload.supplierProduct;
  try {
    const token = yield select(selectors.token);
    if (token) {
      const completePayload = updateObject(action.payload, { token });
      let response;
      if (supplierProduct.id) {
        response = yield call(part.saveSupplierProduct, completePayload);
      } else {
        response = yield call(part.createSupplierProduct, completePayload);
      }
      yield put(saveSupplierProductOK(response.data, getModelKey(supplierProduct)));
    } else {
      yield call(history.push, '/login');
    }
  } catch (apiError) {
    const error = 'Supplier product save failed';
    let error_detail;
    logError(apiError);
    if (apiError.response) {
      error_detail = apiError.response.data;
    }
    yield put(saveSupplierProductError({ supplierProduct, error, error_detail }));
  }
}

export function* watchForSaveSupplierProduct() {
  yield takeLatest(`${SUPPLIER_PRODUCT_SAVE}_REQUESTED`, saveSupplierProduct);
}

export function* deleteSupplierProduct(action) {
  try {
    const token = yield select(selectors.token);

    if (token) {
      const completePayload = updateObject(action.payload, { token });
      yield call(part.deleteSupplierProduct, completePayload);
      yield put(deleteSupplierProductOK(action.payload.supplierProductId));
    } else {
      yield call(history.push, '/login');
    }
  } catch (error) {
    logError(error);
    yield put(deleteSupplierProductError('Delete SupplierProduct failed'));
  }
}

export function* watchForDeleteSupplierProduct() {
  yield takeLatest(`${SUPPLIER_PRODUCT_DELETE}_REQUESTED`, deleteSupplierProduct);
}

export function* savePartsAndSupplierProducts(action) {
  const { parts, supplierProducts } = action.payload;
  let updatedParts = [];
  let partKeysToRemove = [];
  let updatedSupplierProducts = [];
  let supplierProductKeysToRemove = [];
  const token = yield select(selectors.token);
  if (token) {
    for (let i = 0; i < parts.length; i++) {
      const partToSave = parts[i];
      try {
        let response;
        if (partToSave.deleted) {
          if (partToSave.id) {
            yield call(part.deletePart, { partId: partToSave.id, token });
          }
          partKeysToRemove.push(getModelKey(partToSave));
        } else {
          const completePayload = { part: partToSave, token };
          if (partToSave.id) {
            response = yield call(part.savePart, completePayload);
          } else {
            partKeysToRemove.push(partToSave.dummyKey);
            response = yield call(part.createPart, completePayload);
          }
          updatedParts.push(response.data);
        }
      } catch (apiError) {
        const error = 'Part save failed';
        let error_detail;
        logError(apiError);
        if (apiError.response) {
          error_detail = apiError.response.data;
        }
        const partWithErrors = updateObjectWithApiErrors(partToSave, { error, error_detail });
        updatedParts.push(partWithErrors);
      }
    }
    for (let i = 0; i < supplierProducts.length; i++) {
      const supplierProductToSave = supplierProducts[i];
      try {
        let response;
        if (supplierProductToSave.deleted) {
          if (supplierProductToSave.id) {
            yield call(part.deleteSupplierProduct, {
              supplierProductId: supplierProductToSave.id,
              token,
            });
          }
          supplierProductKeysToRemove.push(getModelKey(supplierProductToSave));
        } else {
          const completePayload = { supplierProduct: supplierProductToSave, token };
          if (supplierProductToSave.id) {
            response = yield call(part.saveSupplierProduct, completePayload);
          } else {
            supplierProductKeysToRemove.push(supplierProductToSave.dummyKey);
            response = yield call(part.createSupplierProduct, completePayload);
          }
          updatedSupplierProducts.push(response.data);
        }
      } catch (apiError) {
        const error = 'Save failed';
        let error_detail;
        logError(apiError);
        if (apiError.response) {
          error_detail = apiError.response.data;
        }
        const supplierProductWithErrors = updateObjectWithApiErrors(supplierProductToSave, {
          error,
          error_detail,
        });
        updatedSupplierProducts.push(supplierProductWithErrors);
      }
    }
    yield put(
      savePartsAndProductsOK({
        parts: updatedParts,
        supplierProducts: updatedSupplierProducts,
        oldPartKeys: partKeysToRemove,
        oldSupplierProductKeys: supplierProductKeysToRemove,
      }),
    );
  } else {
    yield call(history.push, '/login');
  }
}
export function* watchForSavePartsAndSupplierProducts() {
  yield takeLatest(`${PART_AND_PRODUCT_MULTI_SAVE}_REQUESTED`, savePartsAndSupplierProducts);
}
