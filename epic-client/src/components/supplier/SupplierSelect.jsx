import React from "react";

import SelectInput from "../../common/SelectInput";
import * as PropTypes from "prop-types";

const SupplierSelect = (props) => {
    const { suppliers, fieldName, onChange, supplierSelected, isEmptyAllowed, isMultiple, multipleSize } = props;
    const supplierOptions = suppliers ? suppliers.map(supplier => {
        return {
            value: supplier.id ? supplier.id.toString() : supplier.dummyKey,
            name: supplier.supplier_name
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
SupplierSelect.propTypes = {
    fieldName: PropTypes.string,
    suppliers: PropTypes.array,
    supplierSelected: PropTypes.string,
    onChange: PropTypes.func,
    isEmptyAllowed: PropTypes.bool,
    isMultiple: PropTypes.bool,
    multipleSize: PropTypes.string,
};
export default SupplierSelect;