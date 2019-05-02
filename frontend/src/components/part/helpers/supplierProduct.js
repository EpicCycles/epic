import {compareDatesDescending} from "../../../helpers/sort";

export const findSupplierProduct = (part, supplierProducts = []) => {
    const matchedSupplierProducts = supplierProducts.filter((sp => sp.part === part.id));
    if (matchedSupplierProducts.length > 0) {
        matchedSupplierProducts.sort((a, b) => compareDatesDescending(a.check_date, b.check_date));
        return matchedSupplierProducts[0];
    }
};