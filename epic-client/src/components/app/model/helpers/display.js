import {
    BIKE,
    BRAND,
    CHECKBOX,
    CURRENCY,
    CUSTOMER,
    DATE_TIME,
    NUMBER,
    PART_TYPE,
    RADIO,
    SELECT_ONE,
    SUPPLIER
} from "./fields";
import {getCustomerName} from "../../../customer/helpers/customer";
import {getCountryName} from "../../../address/helpers/address";
import {getBrandName} from "../../../brand/helpers/brand";
import {getNameForValue} from "./model";
import {getSupplierName} from "../../../supplier/helpers/supplier";
import {getPartTypeName} from "../../../framework/helpers/framework";
import {getBikeName} from "../../../bike/helpers/bike";

export const fixedHeaderClassname = (lockColumn) => {
    if (lockColumn) return "grid-header--fixed-left";
    return "";
};
export const fixedDetailsClassname = (lockColumn) => {
    if (lockColumn) return "grid-item--fixed-left";
    return "";
};
export const gridHeaderClass = (baseClassName = "", fieldIndex, firstColumnLocked) => {
  const shouldLock = firstColumnLocked && (fieldIndex === 0);
    return `${baseClassName} grid-item--header ${fixedHeaderClassname(shouldLock)}`;
};
export const gridItemClass = (baseClassName = "", fieldIndex, firstColumnLocked) => {
  const shouldLock = firstColumnLocked && (fieldIndex === 0);
    return `${baseClassName} grid-item ${fixedDetailsClassname(shouldLock)}`;
};
export const formattedDate = date => {
    if (date) return date.toLocaleString('en-GB');
    return "";
};
export const fieldAlignment = field => {
    switch (field.type) {
        case NUMBER:
        case CURRENCY:
            return 'align_right';
        case CHECKBOX:
        case RADIO:
            return 'align_center';
        default:
            return '';
    }
};
 export const buildViewString = (model, field, sections, brands, suppliers, customers, bikes, frames) => {
        let viewData;
        const fieldValue = model ? model[field.fieldName] : undefined;
        switch (field.type) {
            case CURRENCY:
                viewData = fieldValue ? Number(fieldValue).toLocaleString('en-GB', {
                    style: 'currency',
                    currency: 'GBP'
                }) : "";
                break;
            case CHECKBOX:
                viewData = fieldValue ? "Y" : "N";
                break;
            case DATE_TIME:
                viewData = fieldValue ? formattedDate(new Date(fieldValue)) : "";
                break;
            case PART_TYPE:
                viewData = fieldValue ? getPartTypeName(fieldValue, sections) : '';
                break;
            case BRAND:
                viewData = fieldValue ? getBrandName(fieldValue, brands) : '';
                break;
            case SUPPLIER:
                viewData = fieldValue ? getSupplierName(fieldValue, suppliers) : '';
                break;
            case CUSTOMER:
                viewData = fieldValue ? getCustomerName(fieldValue, customers) : '';
                break;
            case BIKE:
                viewData = fieldValue ? getBikeName(fieldValue, bikes, frames, brands) : '';
                break;
            case SELECT_ONE:
                viewData = fieldValue ? getNameForValue(fieldValue, field.selectList) : '';
                break;
            default:
                viewData = fieldValue ? fieldValue : '';
        }
        return viewData;
    };
