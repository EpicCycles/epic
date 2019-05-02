import {generateRandomCode, updateObjectInArray} from "../../../helpers/utils";
import {buildBrandNameArray} from "../../brand/helpers/brand";
import {buildPartObject} from "../../part/helpers/part";

export const supplierProductHeaders = [
    "Part Type",
    "Supplier",
    "Code",
    "Description",
    "Build Price",
    "Ticket Price",
    "Club Price",
    "RRP",
    "Trade In Value",
    "Stocked",
    "Trade price"
];
export const findSupplierProducts = (part, supplierProducts) => {
    let matchingSupplierProducts = supplierProducts.filter(supplierproduct => supplierproduct.part === part.id);
    if (matchingSupplierProducts.length === 0) matchingSupplierProducts.push({
        part: part.id,
        dummyKey: generateRandomCode(),
    });

    return matchingSupplierProducts;
};
export const buildSupplierProductForApi = (rowMappings, uploadedData, brands) => {
    const brandsLower = buildBrandNameArray(brands);
    let updatedBrands = brands.slice();
    let parts = [];
    let partsMissingBrands = [];

    rowMappings.forEach(rowMapping => {
        if (!rowMapping.ignore) {
            const dataToUse = uploadedData[rowMapping.rowIndex];

            if (rowMapping.partType) {
                let part = buildPartObject(
                    rowMapping.partType,
                    dataToUse[3],
                    brandsLower,
                    undefined
                );
                if (!part.brand) {
                    partsMissingBrands.push(dataToUse[3]);
                } else {
                    part.trade_in_price = dataToUse[8];
                    part.stocked = dataToUse[9];
                    part.standard = true;
                    if (rowMapping.supplier) {
                        let brand = updatedBrands.filter(brand => (brand.id === part.brand))[0];
                        if (!brand.supplier.includes(rowMapping.supplier)) {
                            brand.supplier.push(rowMapping.supplier);
                            brand.changed = true;
                            updatedBrands = updateObjectInArray(updatedBrands, brand, brand.id);
                        }
                        part.supplierProduct = {
                            supplier: rowMapping.supplier,
                            product_code: dataToUse[2],
                            fitted_price: dataToUse[4],
                            ticket_price: dataToUse[5],
                            rrp: dataToUse[7],
                            trade_price: dataToUse[10],
                            club_price: dataToUse[6],
                        }
                    }
                }
                parts.push(part);
            }
        }
    });
    const brandsToSave = updatedBrands.filter(brand => brand.changed);
    return { updatedBrands: brandsToSave, parts, partsMissingBrands };
};