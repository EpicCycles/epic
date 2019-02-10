export const replaceBikeParts = (bikeId, newBikeParts, existingBikeParts) => {
    let bikePartsForState = existingBikeParts.filter(oldBikePart => oldBikePart.bike !== bikeId);
    return bikePartsForState.concat(newBikeParts);
};