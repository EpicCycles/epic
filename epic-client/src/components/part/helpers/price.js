import {findSupplierProduct} from "./supplierProduct";

export const calculatePrice = (is_bike_quote, part, supplierProducts = []) => {
    let part_price;
    let supplier;

    if (part) {
        const supplierProduct = findSupplierProduct(part, supplierProducts);
        if (supplierProduct) {
            if (is_bike_quote) {
                part_price = supplierProduct.fitted_price;
            } else {
                part_price = supplierProduct.rrp;
            }
            supplier = supplierProduct.supplier;
        }
    }

    return { part_price, supplier };
};