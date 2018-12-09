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