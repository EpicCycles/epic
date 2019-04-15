import {findSupplierProduct} from "./supplierProduct";

export const calculatePrice = (is_bike_quote, not_required, part, bikePart, supplierProducts = []) => {
    let trade_in_price;
    let part_price;
    let supplier;

    if (is_bike_quote && bikePart && not_required) trade_in_price = bikePart.trade_in_price;
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

    return { trade_in_price, part_price, supplier };
};

