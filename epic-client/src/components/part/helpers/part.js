// look at state and decide whether to get a new part list for datalist.
import {getBrandName} from "../../brand/helpers/brand";
import {getPartTypeName} from "../../framework/helpers/framework";
import {partFields, partFieldsNoPartType, STOCKED_FIELD} from "../../app/model/helpers/fields";

export const getModelFields = (part, partTypeEditable) => {
    let editFields = partFields;
    if (part && ! partTypeEditable) editFields = partFieldsNoPartType;
    if (part && (part.standard || part.stocked)) editFields.push(STOCKED_FIELD);
    return editFields;
}
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

export const buildFrameWorkPartDisplay = (sections, parts, showEmptySections, showEmptyPartTypes) => {
    const sectionsWithParts = sections.map(section => {
        let partsForSection = [];
        section.partTypes.map(partType => parts.filter(bikePart => bikePart.partType === partType.id)).forEach(partArray => partsForSection = partsForSection.concat(partArray));
        return {
            id: section.id,
            name: section.name,
            parts: partsForSection
        }
    });
    if (showEmptySections) return sectionsWithParts;
    return sectionsWithParts.filter(section => section.parts.length > 0);
};

