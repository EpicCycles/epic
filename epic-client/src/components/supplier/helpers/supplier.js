export const getSupplierName = (supplier, suppliers) => {
    if (! supplier) return undefined;
    if (! (suppliers && Array.isArray(suppliers) && (suppliers.length > 0) )) return undefined;

    if (Array.isArray(supplier)) {
        const supplierNameArray = supplier.map(supplierId => {
            return findSupplierNameforId(supplierId, suppliers);
        });
        return supplierNameArray;
    }
    return findSupplierNameforId(supplier, suppliers)
};
export const findSupplierNameforId = (supplierId, suppliers) => {
    let supplierName;
    suppliers.some(supplier => {
        if (supplier.id == supplierId) {
            supplierName = supplier.supplier_name;
            return true;
        }
        return false;
    });
    return supplierName;
};