export const BRANDS_AND_SUPPLIERS_REQUESTED = 'core/BRANDS_AND_SUPPLIERS_REQUESTED';
export const BRANDS_AND_SUPPLIERS_ERROR = 'core/BRANDS_AND_SUPPLIERS_ERROR';
export const BRANDS_AND_SUPPLIERS_OK = 'core/BRANDS_AND_SUPPLIERS_OK';
export const BRANDS_SAVE_REQUESTED = 'core/BRANDS_SAVE_REQUESTED';
export const BRANDS_SAVE_ERROR = 'core/BRANDS_SAVE_ERROR';
export const BRANDS_SAVE_OK = 'core/BRANDS_SAVE_OK';
export const BRANDS_UPDATE = 'core/BRANDS_UPDATE';
export const SUPPLIER_SAVE_REQUESTED = 'core/SUPPLIER_SAVE_REQUESTED';
export const SUPPLIER_SAVE_ERROR = 'core/SUPPLIER_SAVE_ERROR';
export const SUPPLIER_SAVE_OK = 'core/SUPPLIER_SAVE_OK';
export const SUPPLIER_DELETE_REQUESTED = 'core/SUPPLIER_DELETE_REQUESTED';
export const SUPPLIER_DELETE_ERROR = 'core/SUPPLIER_DELETE_ERROR';
export const SUPPLIER_DELETE_OK = 'core/SUPPLIER_DELETE_OK';
export const getBrandsAndSuppliers =  ()  => ({
    type: BRANDS_AND_SUPPLIERS_REQUESTED,
    payload: { }
});

export const getBrandsAndSuppliersSuccess = (brands, suppliers) => ({
    type: BRANDS_AND_SUPPLIERS_OK,
    payload: {brands, suppliers}
});

export const getBrandsAndSuppliersFailure = error => ({
    type: BRANDS_AND_SUPPLIERS_ERROR,
    payload: error
});

export const updateBrands = brands => ({
    type: BRANDS_UPDATE,
    payload: brands
});

export const saveBrands = brands => ({
    type: BRANDS_SAVE_REQUESTED,
    payload: brands
});

export const saveBrandsSuccess = brands => ({
    type: BRANDS_SAVE_OK,
    payload: brands
});

export const saveBrandsFailure = error => ({
    type: BRANDS_SAVE_ERROR,
    payload: error
});

export const saveSupplier = supplier => ({
    type: SUPPLIER_SAVE_REQUESTED,
    payload: { supplier }
});
export const saveSupplierSuccess = suppliers => ({
    type: SUPPLIER_SAVE_OK,
    payload: suppliers
});

export const saveSupplierFailure = error => ({
    type: SUPPLIER_SAVE_ERROR,
    payload: error
});
export const deleteSupplier = supplierId => ({
    type: SUPPLIER_DELETE_REQUESTED,
    payload: { supplierId }
});
export const deleteSupplierSuccess = suppliers => ({
    type: SUPPLIER_DELETE_OK,
    payload: suppliers
});

export const deleteSupplierFailure = error => ({
    type: SUPPLIER_DELETE_ERROR,
    payload: error
});
