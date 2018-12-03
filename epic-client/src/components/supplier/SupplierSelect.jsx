import React from "react";

import SelectInput from "../../common/SelectInput";

const SupplierSelect = (props) => {
    const { suppliers, fieldName, onChange, supplierSelected , isEmptyAllowed, isMultiple, multipleSize } = props;
    const supplierOptions = suppliers ? suppliers.map(supplier => {
        return {
            'value': supplier.id ? supplier.id : supplier.dummyKey,
            'name': supplier.supplier_name
        }
    }) : [];
    return <SelectInput
        fieldName={fieldName}
        onChange={onChange}
        value={supplierSelected || []}
        options={supplierOptions}
        isEmptyAllowed={isEmptyAllowed}
        isMultiple={isMultiple}
        multipleSize={multipleSize}
    />;
};
export default SupplierSelect;