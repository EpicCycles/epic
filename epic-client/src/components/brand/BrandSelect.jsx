import React from "react";

import SelectInput from "../../common/SelectInput";
import {getComponentKey} from "../app/model/helpers/model";

const BrandSelect = (props) => {
    const { brands, fieldName, onChange, brandSelected, isEmptyAllowed, error, bikeOnly, disabled } = props;
    const brandsToUse = (brands && bikeOnly) ? brands.filter(brand => brand.bike_brand) : brands;
    const brandOptions = brandsToUse ? brandsToUse.map(brand => {
        return {
            'value': String(getComponentKey(brand)),
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
        disabled={disabled}
    />;
}
export default BrandSelect;