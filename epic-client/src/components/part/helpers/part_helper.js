// look at state and decide whether to get a new part list for datalist.
import {generateRandomCode, updateObjectInArray} from "../../../helpers/utils";
import {buildBrandNameArray, getBrandName} from "../../brand/helpers/brand_helper";

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

export const getNewDataListRequired = (currentPartDataList, currentPartType, currentBrand) => {
    if (!currentPartDataList) {
        return true;
    }
    return !((currentPartDataList.partType === currentPartType) && (currentPartDataList.brand === currentBrand));

};
// builds a string for the part
export const buildPartString = (part, brands) => {
    let brandName = "Unknown Brand";
    if (part.brand_name) {
        brandName = part.brand_name;
    } else {
        brandName = getBrandName(part.brand, brands);
    }
    return brandName + " " + part.part_name;
};

export const findSupplierProducts = (part, supplierProducts) => {
    let matchingSupplierProducts = supplierProducts.filter(supplierproduct => supplierproduct.part === part.id);
    if (matchingSupplierProducts.length === 0) matchingSupplierProducts.push({
        part: part.id,
        dummyKey: generateRandomCode(),
    });

    return matchingSupplierProducts;
};


export const buildPartObject = (partType, partNameWithBrand, brandsLower, bikeBrand) => {
    let brandFound = brandsLower.find(brand => {
        return partNameWithBrand.toLowerCase().startsWith(brand.brand_name)
    });
    const brand = brandFound ? brandFound.id : bikeBrand;
    const part_name = brandFound ? partNameWithBrand.slice(brandFound.brand_name.length).trim() : partNameWithBrand;

    return { partType, part_name, brand };
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
                    part.trade_in_value = dataToUse[8];
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
