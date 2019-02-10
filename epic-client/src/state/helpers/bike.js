import {removeObjectWithIndex} from "../../helpers/utils";

export const replaceBikeParts = (bikeId, newBikeParts, existingBikeParts) => {
    let bikePartsForState = existingBikeParts.filter(oldBikePart => oldBikePart.bike !== bikeId);
    return bikePartsForState.concat(newBikeParts);
};
export const findNextBikeToReview = (bikeReviewList, bikeId) => {
    const bikeIndex = bikeReviewList.indexOf(bikeId);
    return bikeReviewList[bikeIndex + 1];
};
export const removeIdFromReviewList  = (bikeReviewList, bikeId) => {
    const bikeIndex = bikeReviewList.indexOf(bikeId);
    return removeObjectWithIndex(bikeReviewList, bikeIndex);
};