export const BRANDS_AND_SUPPLIERS = 'core/BRANDS_AND_SUPPLIERS';
export const BRANDS = 'core/BRANDS';
export const BRANDS_SAVE = 'core/BRANDS_SAVE';
export const BRANDS_UPDATE = 'core/BRANDS_UPDATE';
export const SUPPLIER_SAVE = 'core/SUPPLIER_SAVE';
export const SUPPLIER_DELETE = 'core/SUPPLIER_DELETE';
export const getBrandsAndSuppliers = () => ({
    type: `${BRANDS_AND_SUPPLIERS}_REQUESTED`,
    payload: {}
});

export const getBrandsAndSuppliersSuccess = (brands, suppliers) => ({
    type: `${BRANDS_AND_SUPPLIERS}_OK`,
    payload: { brands, suppliers }
});

export const getBrandsAndSuppliersFailure = error => ({
    type: `${BRANDS_AND_SUPPLIERS}_ERROR`,
    payload: error
});
export const getBrands = () => ({
    type: `${BRANDS}_REQUESTED`,
    payload: {}
});

export const getBrandsSuccess = (brands) => ({
    type: `${BRANDS}_OK`,
    payload: { brands }
});

export const getBrandsFailure = error => ({
    type: `${BRANDS_AND_SUPPLIERS}_ERROR`,
    payload: error
});

export const updateBrands = brands => ({
    type: `${BRANDS}_UPDATE`,
    payload: brands
});

export const saveBrands = brands => ({
    type: `${BRANDS_SAVE}_REQUESTED`,
    payload: brands
});

export const saveBrandsSuccess = brands => ({
    type:`${BRANDS_SAVE}_OK`,
    payload: brands
});

export const saveBrandsFailure = error => ({
    type: `${BRANDS_SAVE}_ERROR`,
    payload: error
});

export const saveSupplier = supplier => ({
    type: `${SUPPLIER_SAVE}_REQUESTED`,
    payload: { supplier }
});
export const saveSupplierSuccess = suppliers => ({
    type: `${SUPPLIER_SAVE}_OK`,
    payload: suppliers
});

export const saveSupplierFailure = error => ({
    type: `${SUPPLIER_SAVE}_ERROR`,
    payload: error
});
export const deleteSupplier = supplierId => ({
    type: `${SUPPLIER_DELETE}_REQUESTED`,
    payload: { supplierId }
});
export const deleteSupplierSuccess = suppliers => ({
    type: `${SUPPLIER_DELETE}_OK`,
    payload: suppliers
});

export const deleteSupplierFailure = error => ({
    type: `${SUPPLIER_DELETE}_ERROR`,
    payload: error
});
