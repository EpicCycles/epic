export const BRANDS_AND_SUPPLIERS_REQUESTED = 'core/BRANDS_AND_SUPPLIERS_REQUESTED';
export const BRANDS_AND_SUPPLIERS_ERROR = 'core/BRANDS_AND_SUPPLIERS_ERROR';
export const BRANDS_AND_SUPPLIERS_OK = 'core/BRANDS_AND_SUPPLIERS_OK';
export const BRANDS_SAVE_REQUESTED = 'core/BRANDS_SAVE_REQUESTED';
export const BRANDS_SAVE_ERROR = 'core/BRANDS_SAVE_ERROR';
export const BRANDS_SAVE_OK = 'core/BRANDS_SAVE_OK';
export const BRANDS_UPDATE = 'core/BRANDS_UPDATE';
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
