import {buildPartString} from "./part";

export const getDataList = (parts, brands, partType, brand) => {
    const usableList = parts.filter(part =>
        ((part.partType === partType)
            && ((!brand) || (brand && (part.brand === brand))))
);
    return usableList.map(part => ({ id: part.id, dataValue: buildPartString(part, brands) }));
};