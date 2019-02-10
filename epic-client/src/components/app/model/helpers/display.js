export const fixedHeaderClassname = (lockColumn) => {
    if (lockColumn) return "grid-header--fixed-left";
    return "";
};
export const fixedDetailsClassname = (lockColumn) => {
    if (lockColumn) return "grid-item--fixed-left";
    return "";
};