export const validateEmailFormat = (email) => {
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailPattern.test(email);
};
export const validatePostcodeFormat = (postcode) => {
    const postcodePattern = /^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$/;
    return postcodePattern.test(postcode);
};
// todo tests for this one.
export const findObjectWithKey = (arrayOfObjects, componentKey) => {
    const objectWithId = findObjectWithId(arrayOfObjects, componentKey);
    if (objectWithId) return objectWithId;
    return findObjectWithDummyKey(arrayOfObjects, componentKey);
};
export const findIndexOfObjectWithKey = (arrayOfObjects, componentKey) => {
    const indexOfObjectWithId = findIndexOfObjectWithId(arrayOfObjects, componentKey);
    if (indexOfObjectWithId < 0) return findIndexOfObjectWithDummyKey(arrayOfObjects, componentKey);
    return indexOfObjectWithId;
};
export const findObjectWithId = (arrayOfObjects, objectId) => {
    // eslint-disable-next-line
   return arrayOfObjects.find ( object => object.id == objectId);
};
export const findIndexOfObjectWithId = (arrayOfObjects, objectId) => {
    return arrayOfObjects.indexOf(findObjectWithId(arrayOfObjects, objectId));
};

export const findObjectWithDummyKey = (arrayOfObjects, dummyKey) => {
    return arrayOfObjects.find ( object => object.dummyKey === dummyKey);
};
export const findIndexOfObjectWithDummyKey = (arrayOfObjects, dummyKey) => {
    return arrayOfObjects.indexOf(findObjectWithDummyKey(arrayOfObjects, dummyKey));
};

export const generateRandomCode = () => {
    return Math.random().toString(36).replace('0.', '');
};
