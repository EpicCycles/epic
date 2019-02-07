// look at state and decide whether to get a new part list for datalist.
import {getBrandName} from "../../brand/helpers/brand";
import {getPartTypeName} from "../../framework/helpers/framework";

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

export const partTypePartAndBrandString = (part, sections, brands) => {
    const partTypeName = getPartTypeName(part.partType, sections) || "Unknown Type";
    return `${partTypeName}: ${buildPartString(part, brands)}`
};


export const buildPartObject = (partType, partNameWithBrand, brandsLower, bikeBrand) => {
    let brandFound = brandsLower.find(brand => {
        return partNameWithBrand.toLowerCase().startsWith(brand.brand_name)
    });
    const brand = brandFound ? brandFound.id : bikeBrand;
    const part_name = brandFound ? partNameWithBrand.slice(brandFound.brand_name.length).trim() : partNameWithBrand;

    return { partType, part_name, brand };
};

