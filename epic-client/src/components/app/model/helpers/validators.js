import {INVALID_EMAIL, INVALID_POSTCODE, INVALID_URL} from "./error";
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
    if (!emailPattern.test(email)) return INVALID_EMAIL;
    return;
};
export const validateURLAndReturnError = (url) => {
    if (url) {
        const urlPattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        if (!urlPattern.test(url)) return INVALID_URL;
    }
    return;

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