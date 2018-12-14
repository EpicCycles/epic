import React from "react";

import SelectInput from "../../common/SelectInput";

const BrandSelect = (props) => {
    const { brands, fieldName, onChange, brandSelected, isEmptyAllowed, error, bikeOnly } = props;
    const brandsToUse = (brands && bikeOnly) ? brands.filter(brand => brand.bike_brand) : brands;
    const brandOptions = brandsToUse ? brandsToUse.map(brand => {
        return {
            'value': brand.id ? brand.id.toString() : brand.dummyKey,
            'name': brand.brand_name
        }
    }) : [];
    return <SelectInput
        fieldName={fieldName}
        onChange={onChange}
        value={brandSelected ? brandSelected.toString() : ""}
        options={brandOptions}
        isEmptyAllowed={isEmptyAllowed}
        error={error}
    />;
}
export default BrandSelect;