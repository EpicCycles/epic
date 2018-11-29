import React from "react";

import SelectInput from "../../common/SelectInput";

const BrandSelect = (props) => {
    const { brands, fieldName, onChange, brandSelected, isEmptyAllowed } = props;
    const brandOptions = brands ? brands.map(brand => {
        return {
            'value': brand.id ? brand.id : brand.dummyKey,
            'name': brand.brand_name
        }
    }) : [];
    return <SelectInput
        fieldName={fieldName}
        onChange={onChange}
        value={brandSelected}
        options={brandOptions}
        isEmptyAllowed={isEmptyAllowed}
    />;
}
export default BrandSelect;