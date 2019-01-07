export const getSupplierName = (supplierId, suppliers) => {
    if (! supplierId) return undefined;
    let supplierName = "Unknown Supplier";

    suppliers.some(supplier => {
        if (supplier.id === supplierId) {
            supplierName = supplier.supplier_name;
            return true;
        }
        return false;
    });
    return supplierName;
}