export const getSupplierName = (supplierId, suppliers) => {
    let supplierName = "Unknown Supplier";

    suppliers.some(supplier => {
        if (supplier.id === part.supplier) {
            supplierName = supplier.supplier_name;
            return true;
        }
        return false;
    });
    return supplierName;
}