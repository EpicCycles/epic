import {
  PART_AND_PRODUCT_MULTI_SAVE,
  PART_CLEAR,
  PART_DELETE,
  PART_LIST,
  PART_SAVE,
  PART_UPLOAD,
  SUPPLIER_PRODUCT_DELETE,
  SUPPLIER_PRODUCT_SAVE,
  UPDATE_PARTS,
  UPDATE_SUPPLIER_PRODUCTS,
} from '../actions/part';
import { USER_LOGOUT } from '../actions/user';
import { BIKE_ADD_PART, BIKE_PART_DELETE, BIKE_PART_SAVE, GET_BIKE_PARTS } from '../actions/bike';
import {
  addItemsToArray,
  removeItemFromArray,
  updateObjectInArray,
  updateObjectWithApiErrors,
} from '../../helpers/utils';
import { COPY_QUOTE, CREATE_QUOTE, FIND_QUOTES, GET_QUOTE, UPDATE_QUOTE } from '../actions/quote';
import { STORAGE_PARTS, STORAGE_SUPPLIER_PRODUCTS } from '../../helpers/constants';
import { setLocalStorage } from '../helpers/localStorage';

const initialState = {
  isLoading: false,
  parts: [],
  supplierProducts: [],
};
const part = (state = initialState, action) => {
  let parts, supplierProducts;
  switch (action.type) {
    case PART_CLEAR:
    case USER_LOGOUT:
      return initialState;
    case `${PART_SAVE}_REQUESTED`:
    case `${PART_DELETE}_REQUESTED`:
    case `${SUPPLIER_PRODUCT_SAVE}_REQUESTED`:
    case `${SUPPLIER_PRODUCT_DELETE}_REQUESTED`:
    case `${PART_UPLOAD}_REQUESTED`:
    case `${PART_LIST}_REQUESTED`:
    case `${PART_AND_PRODUCT_MULTI_SAVE}_REQUESTED`:
      return {
        ...state,
        isLoading: true,
      };
    case `${PART_SAVE}_ERROR`:
      const partWithErrors = updateObjectWithApiErrors(action.payload.part, action.payload);
      return {
        ...state,
        isLoading: false,
        parts: updateObjectInArray(state.parts, partWithErrors),
      };
    case `${SUPPLIER_PRODUCT_SAVE}_ERROR`:
      const supplierProductWithErrors = updateObjectWithApiErrors(
        action.payload.supplierProduct,
        action.payload,
      );
      return {
        ...state,
        isLoading: false,
        supplierProducts: updateObjectInArray(state.supplierProducts, supplierProductWithErrors),
      };
    case `${PART_DELETE}_ERROR`:
    case `${SUPPLIER_PRODUCT_DELETE}_ERROR`:
    case `${PART_UPLOAD}_ERROR`:
    case `${PART_LIST}_ERROR`:
      return {
        ...state,
        isLoading: false,
      };
    case `${PART_UPLOAD}_OK`:
    case `${PART_LIST}_OK`:
    case `${BIKE_PART_SAVE}_OK`:
    case `${BIKE_PART_DELETE}_OK`:
    case `${BIKE_ADD_PART}_OK`:
    case `${GET_BIKE_PARTS}_OK`:
    case `${CREATE_QUOTE}_OK`:
    case `${GET_QUOTE}_OK`:
    case `${COPY_QUOTE}_OK`:
    case `${UPDATE_QUOTE}_OK`:
    case `${FIND_QUOTES}_OK`:
      parts = addItemsToArray(state.parts, action.payload.parts);
      supplierProducts = addItemsToArray(state.supplierProducts, action.payload.supplierProducts);

      setLocalStorage(STORAGE_PARTS, parts);
      setLocalStorage(STORAGE_SUPPLIER_PRODUCTS, supplierProducts);

      return {
        ...state,
        isLoading: false,
        parts,
        supplierProducts,
      };
    case UPDATE_PARTS:
      parts = addItemsToArray(state.parts, action.payload.parts);
      setLocalStorage(STORAGE_PARTS, parts);
      return {
        ...state,
        parts,
      };
    case UPDATE_SUPPLIER_PRODUCTS:
      supplierProducts = addItemsToArray(state.supplierProducts, action.payload.supplierProducts);
      setLocalStorage(STORAGE_SUPPLIER_PRODUCTS, parts);
      return {
        ...state,
        supplierProducts,
      };
    case `${PART_SAVE}_OK`:
      parts = updateObjectInArray(state.parts, action.payload.part, action.payload.existingKey);
      setLocalStorage(STORAGE_PARTS, parts);
      return {
        ...state,
        parts,
        isLoading: false,
        part: action.payload.part,
      };
    case `${SUPPLIER_PRODUCT_SAVE}_OK`:
      supplierProducts = updateObjectInArray(
        state.supplierProducts,
        action.payload.supplierProduct,
        action.payload.existingKey,
      );
      setLocalStorage(STORAGE_SUPPLIER_PRODUCTS, supplierProducts);
      return {
        ...state,
        isLoading: false,
        supplierProducts,
      };
    case `${PART_DELETE}_OK`:
      parts = removeItemFromArray(state.parts, action.payload.partId);
      setLocalStorage(STORAGE_PARTS, parts);
      return {
        ...state,
        isLoading: false,
        part: undefined,
        parts,
      };
    case `${SUPPLIER_PRODUCT_DELETE}_OK`:
      supplierProducts = removeItemFromArray(
        state.supplierProducts,
        action.payload.supplierProductId,
      );
      setLocalStorage(STORAGE_SUPPLIER_PRODUCTS, supplierProducts);
      return {
        ...state,
        isLoading: false,
        supplierProducts,
      };
    case `${PART_AND_PRODUCT_MULTI_SAVE}_OK`:
      const {
        partsSaved,
        supplierProductsSaved,
        oldPartKeys,
        oldSupplierProductKeys,
      } = action.payload;
      parts = state.parts;
      supplierProducts = state.supplierProducts;
      oldPartKeys.forEach(partId => (parts = removeItemFromArray(parts, partId)));
      oldSupplierProductKeys.forEach(
        supplierProductId =>
          (supplierProducts = removeItemFromArray(supplierProducts, supplierProductId)),
      );
      parts = addItemsToArray(parts, partsSaved);
      supplierProducts = addItemsToArray(supplierProducts, supplierProductsSaved);
      setLocalStorage(STORAGE_PARTS, parts);
      setLocalStorage(STORAGE_SUPPLIER_PRODUCTS, supplierProducts);
      return {
        ...state,
        isLoading: false,
        parts,
        supplierProducts,
      };
    default:
      return state;
  }
};
export default part;
