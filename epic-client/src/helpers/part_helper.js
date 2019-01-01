// look at state and decide whether to get a new part list for datalist.
import {generateRandomCode} from "./utils";
import {buildBrandNameArray, getBrandName} from "./brand_helper";

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
        isChanged: false
    });

    return matchingSupplierProducts;
};


export const buildPartObject = (partType, partNameWithBrand, brandsLower, bikeBrand) => {
    let partBrandFound = brandsLower.find(brand => {
        return partNameWithBrand.toLowerCase().startsWith(brand.brand_name)
    });
    const partBrand = partBrandFound ? partBrandFound.id : bikeBrand;
    const partName = partBrandFound ? partNameWithBrand.slice(partBrandFound.brand_name.length).trim() : partNameWithBrand;

    return { partType, partName, partBrand };
};

export const buildSupplierProductForApi = (rowMappings, uploadedData, brands) => {
    const brandsLower = buildBrandNameArray(brands);
    let updatedBrands = [];
    let parts = [];
    let partsMissingBrands = [];

    rowMappings.forEach(rowMapping => {
        if (!rowMapping.ignore) {
            const dataToUse = uploadedData[rowMapping.rowIndex].slice(1);

            if (rowMapping.partType) {
                let part = buildPartObject(
                    rowMapping.partType,
                    dataToUse[4],
                    brandsLower,
                    undefined
                );
                if (!part.brand) {
                    partsMissingBrands.push(dataToUse[4]);
                } else {
                    part.trade_in_value = dataToUse[9];
                    part.stocked = dataToUse[10];
                    part.standard = true;
                    if (rowMapping.supplier) {
                        let partBrand = brands.filter(brand => (brand.id === part.brand))[0];
                        if (!partBrand.suppliers.includes(rowMapping.supplier)) {
                            partBrand.suppliers.push(rowMapping.supplier);
                            updatedBrands.push(partBrand);
                        }
                        part.supplierProduct = {
                            supplier: rowMapping.supplier,
                            product_code: dataToUse[3],
                            fitted_price: dataToUse[5],
                            ticket_price: dataToUse[6],
                            rrp: dataToUse[8],
                            trade_price: dataToUse[11],
                            club_price: dataToUse[7],
                        }
                    }
                }
            }
        }
    });
    return { updatedBrands, parts, partsMissingBrands };
};
