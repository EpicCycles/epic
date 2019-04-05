// look at state and decide whether to get a new part list for datalist.
import {getBrandName} from "../../brand/helpers/brand";
import {getPartType, getPartTypeName} from "../../partType/helpers/partType";
import {partFields, partFieldsNoPartType, STOCKED_FIELD} from "../../app/model/helpers/fields";
import {isModelValid} from "../../app/model/helpers/model";
import {isItAnObject} from "../../../helpers/utils";

export const partCanBeSubstituted = (part, sections) => {
      const partType = getPartType(part.partType, sections);
    if (partType) return partType.can_be_substituted;
};
export const partCanBeOmitted = (part, sections) => {
     const partType = getPartType(part.partType, sections);
    if (partType) return partType.can_be_omitted;
};
export const partReadyToUse = (part, persistedPart) => {
    if (!isModelValid(part)) return false;
    if (part.changed) return true;
    if (isItAnObject(part) && isItAnObject(persistedPart)) return Object.keys(persistedPart).some(key => {
        return (persistedPart[key] !== part[key]);
    });
    return isItAnObject(part);
};
export const getModelFields = (part, partTypeEditable) => {
    let editFields = partFields.slice();
    if (part && ! partTypeEditable) editFields = partFieldsNoPartType.slice();
    if (part && (part.standard || part.stocked)) editFields.push(STOCKED_FIELD);
    return editFields;
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

