import {INVALID_POSTCODE} from "./error";
import {POSTCODE_RULES} from "./constants";
export const validateData = (fieldList, currentValues) => {
    let errors = {};
    fieldList.forEach(field => {
        if (field.required) {
            if (!currentValues[field.fieldName]) {
                errors[field.fieldName] = field.error;
            }
        }
    });
    return errors;
};

export const validateEmailFormat = (email) => {
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailPattern.test(email);
};

export const validatePostcodeAndReturnError = (postcode, model = {}) => {
    let error;
    const postcodeRule = POSTCODE_RULES.filter(rule => rule.countryCode === model.country);
    if (postcodeRule[0]) {
        const OK = RegExp(postcodeRule[0].regex).exec(postcode);
        if (!OK) error = INVALID_POSTCODE + postcodeRule[0].display;
    }
    return error;
};