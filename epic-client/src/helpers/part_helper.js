// look at state and decide whether to get a new part list for datalist.
export const getNewDataListRequired = (currentPartDataList, currentPartType, currentBrand) => {
    if (!currentPartDataList) {
        return true;
    }
    if ((currentPartDataList.partType === currentPartType) && (currentPartDataList.brand === currentBrand)) {
        return false;
    }
    return true;
};
// biolds a string fror teh part
export const buildPartString = (part, brands) => {
    let brandName = "Unknown Brand";
    if (part.brand_name) {
        brandName = part.brand_name;
    } else {
        brands.some(brand => {
            if (brand.id === part.brand) {
                brandName = brand.brand_name;
                return true;
            }
            return false;
        })
    }
    return brandName + " " + part.part_name;
};