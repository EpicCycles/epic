import {getNameForValue} from "../../app/model/helpers/model";

export const FITTING_TYPE_CHOICES = [
    {value: "C", name:'Customer'},
    {value:"E", name: 'Epic'}
    ];

export const fittingText = (fitting) => {
    //TODO to be implemented export const getCountryName = countryCode => {
    //     return getNameForValue(countryCode, COUNTRIES);
    // };
    return "not implemented";
};
export const getFittingType = fittingType => {
    return getNameForValue(fittingType, FITTING_TYPE_CHOICES);
};