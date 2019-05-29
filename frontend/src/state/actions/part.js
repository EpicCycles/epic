export const PART_DELETE = 'part/PART_DELETE';
export const PART_SAVE = 'part/PART_SAVE';
export const PART_LIST = 'part/PART_LIST';
export const PART_UPLOAD = 'part/PART_UPLOAD';
export const PART_CLEAR = 'part/PART_CLEAR';
export const UPDATE_PARTS = 'part/UPDATE_PARTS';
export const UPDATE_SUPPLIER_PRODUCTS = 'part/UPDATE_SUPPLIER_PRODUCTS';
export const SUPPLIER_PRODUCT_DELETE = 'part/SUPPLIER_PRODUCT_DELETE';
export const SUPPLIER_PRODUCT_SAVE = 'part/SUPPLIER_PRODUCT_SAVE';
export const PART_AND_PRODUCT_MULTI_SAVE = 'part/PART_AND_PRODUCT_MULTI_SAVE';

export const clearParts = () => ({
  type: PART_CLEAR,
});
export const updateParts = parts => ({
  type: UPDATE_PARTS,
  payload: parts,
});
export const updateSupplierProducts = supplierProducts => ({
  type: UPDATE_SUPPLIER_PRODUCTS,
  payload: supplierProducts,
});
export const savePart = part => ({
  type: `${PART_SAVE}_REQUESTED`,
  payload: { part },
});
export const savePartOK = (part, existingKey) => ({
  type: `${PART_SAVE}_OK`,
  payload: { part, existingKey },
});
export const savePartError = payload => ({
  type: `${PART_SAVE}_ERROR`,
  payload: payload,
});
export const deletePart = partId => ({
  type: `${PART_DELETE}_REQUESTED`,
  payload: { partId },
});
export const deletePartOK = partId => ({
  type: `${PART_DELETE}_OK`,
  payload: { partId },
});
export const deletePartError = error => ({
  type: `${PART_DELETE}_ERROR`,
  payload: error,
});
export const uploadParts = parts => ({
  type: `${PART_UPLOAD}_REQUESTED`,
  payload: { parts },
});
export const uploadPartsOK = () => ({
  type: `${PART_UPLOAD}_OK`,
  payload: { parts: [], supplierProducts: [] },
});
export const uploadPartsError = error => ({
  type: `${PART_UPLOAD}_ERROR`,
  payload: error,
});
export const listParts = listCriteria => ({
  type: `${PART_LIST}_REQUESTED`,
  payload: { listCriteria },
});
export const listPartsOK = responseData => ({
  type: `${PART_LIST}_OK`,
  payload: responseData,
});
export const listPartsError = error => ({
  type: `${PART_LIST}_ERROR`,
  payload: error,
});
export const saveSupplierProduct = supplierProduct => ({
  type: `${SUPPLIER_PRODUCT_SAVE}_REQUESTED`,
  payload: { supplierProduct },
});
export const saveSupplierProductOK = (supplierProduct, existingKey) => ({
  type: `${SUPPLIER_PRODUCT_SAVE}_OK`,
  payload: { supplierProduct, existingKey },
});
export const saveSupplierProductError = payload => ({
  type: `${SUPPLIER_PRODUCT_SAVE}_ERROR`,
  payload,
});
export const deleteSupplierProduct = supplierProductId => ({
  type: `${SUPPLIER_PRODUCT_DELETE}_REQUESTED`,
  payload: { supplierProductId },
});
export const deleteSupplierProductOK = supplierProductId => ({
  type: `${SUPPLIER_PRODUCT_DELETE}_OK`,
  payload: { supplierProductId },
});
export const deleteSupplierProductError = error => ({
  type: `${SUPPLIER_PRODUCT_DELETE}_ERROR`,
  payload: error,
});
export const savePartsAndProducts = (parts, supplierProducts) => ({
  type: `${PART_AND_PRODUCT_MULTI_SAVE}_REQUESTED`,
  payload: { parts, supplierProducts },
});
export const savePartsAndProductsOK = payload => ({
  type: `${PART_AND_PRODUCT_MULTI_SAVE}_OK`,
  payload: payload,
});
