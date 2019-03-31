import {CHECKBOX, CURRENCY, NUMBER, RADIO} from "./fields";

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