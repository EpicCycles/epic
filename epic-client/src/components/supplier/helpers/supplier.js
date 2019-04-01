export const getSupplierName = (supplier, suppliers) => {
    if (! supplier) return undefined;
    if (Array.isArray(supplier)) {
        const supplierNameArray = supplier.map(supplierId => {
            return findSupplierNameforId(supplierId, suppliers);
        });
        return supplierNameArray;
    }
    return findSupplierNameforId(supplier, suppliers)
};
export const findSupplierNameforId = (supplierId, suppliers) => {
    if (!supplierId) return;
    let supplierName = 'Unknown Supplier';
    if (Array.isArray(suppliers)) {
        suppliers.some(supplier => {
            if (supplier.id == supplierId) {
                supplierName = supplier.supplier_name;
                return true;
            }
            return false;
        });
    }
    return supplierName;
};