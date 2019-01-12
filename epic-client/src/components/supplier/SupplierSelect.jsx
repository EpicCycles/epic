import React from "react";

import SelectInput from "../../common/SelectInput";
import * as PropTypes from "prop-types";
import {getComponentKey} from "../../helpers/models";

const SupplierSelect = (props) => {
    const { suppliers, fieldName, onChange, supplierSelected, isEmptyAllowed, isMultiple, multipleSize } = props;
    const supplierOptions = suppliers ? suppliers.map(supplier => {
        return {
            value: String(getComponentKey(supplier)),
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
    supplierSelected: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
    ]),
    onChange: PropTypes.func,
    isEmptyAllowed: PropTypes.bool,
    isMultiple: PropTypes.bool,
    multipleSize: PropTypes.number,
};
export default SupplierSelect;