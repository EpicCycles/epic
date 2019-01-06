export const PART_DELETE_REQUESTED = "part/PART_DELETE_REQUESTED";
export const PART_DELETE_OK = "part/PART_DELETE_OK";
export const PART_DELETE_ERROR = "part/PART_DELETE_ERROR";
export const PART_SAVE_REQUESTED = "part/PART_SAVE_REQUESTED";
export const PART_SAVE_OK = "part/PART_SAVE_OK";
export const PART_SAVE_ERROR = "part/PART_SAVE_ERROR";
export const PART_LIST_REQUESTED = "part/PART_LIST_REQUESTED";
export const PART_LIST_OK = "part/PART_LIST_OK";
export const PART_LIST_ERROR = "part/PART_LIST_ERROR";
export const PART_UPLOAD_REQUESTED = "part/PART_UPLOAD_REQUESTED";
export const PART_UPLOAD_OK = "part/PART_UPLOAD_OK";
export const PART_UPLOAD_ERROR = "part/PART_UPLOAD_ERROR";
export const PART_CLEAR = "part/PART_CLEAR";
export const SUPPLIER_PRODUCT_SAVE_REQUESTED = "part/SUPPLIER_PRODUCT_SAVE_REQUESTED";
export const SUPPLIER_PRODUCT_SAVE_OK = "part/SUPPLIER_PRODUCT_SAVE_OK";
export const SUPPLIER_PRODUCT_SAVE_ERROR = "part/SUPPLIER_PRODUCT_SAVE_ERROR";
export const UPDATE_PARTS = "part/UPDATE_PARTS";
export const UPDATE_SUPPLIER_PRODUCTS = "part/UPDATE_SUPPLIER_PRODUCTS";

export const clearParts = () => ({
    type: PART_CLEAR
});
export const updateParts = (parts) => ({
    type: UPDATE_PARTS,
    payload: parts
});
export const updateSupplierProducts = (supplierProducts) => ({
    type: UPDATE_SUPPLIER_PRODUCTS,
    payload: supplierProducts
});
export const savePart = (part) => ({
    type: PART_SAVE_REQUESTED,
    payload: { part }
});
export const savePartOK = (part) => ({
    type: PART_SAVE_OK,
    payload: { part }
});
export const savePartError = (error) => ({
    type: PART_SAVE_ERROR,
    payload: error
});
export const deletePart = (partId) => ({
    type: PART_DELETE_REQUESTED,
    payload: { partId }
});
export const deletePartOK = () => ({
    type: PART_DELETE_OK
});
export const deletePartError = (error) => ({
    type: PART_DELETE_ERROR,
    payload: error
});
export const uploadParts = (parts) => ({
    type: PART_UPLOAD_REQUESTED,
    payload: { parts }
});
export const uploadPartsOK = () => ({
    type: PART_UPLOAD_OK,
    payload: { parts: [], supplierParts: [] }
});
export const uploadPartsError = (error) => ({
    type: PART_UPLOAD_ERROR,
    payload: error
});
export const listParts = (listCriteria) => ({
    type: PART_LIST_REQUESTED,
    payload: { listCriteria }
});
export const listPartsOK = (responseData) => ({
    type: PART_LIST_OK,
    payload: responseData
});
export const listPartsError = (error) => ({
    type: PART_LIST_ERROR,
    payload: error
});
export const saveSupplierParts = (parts, supplierParts) => ({
    type: SUPPLIER_PRODUCT_SAVE_REQUESTED,
    payload: { parts, supplierParts }
});
export const saveSupplierPartsOK = (parts, supplierParts) => ({
    type: SUPPLIER_PRODUCT_SAVE_OK,
    payload: { parts, supplierParts }
});
export const saveSupplierPartsError = (error) => ({
    type: SUPPLIER_PRODUCT_SAVE_ERROR,
    payload: error
});
