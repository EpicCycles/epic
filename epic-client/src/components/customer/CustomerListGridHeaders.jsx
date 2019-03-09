import React from "react";
import PartHeaders from "../part/PartHeaders";
import * as PropTypes from "prop-types";
import SupplierProductFieldHeaders from "../supplierProduct/SupplierProductFieldHeaders";
import {fixedHeaderClassname} from "../app/model/helpers/display";
import {customerFields, partFields} from "../app/model/helpers/fields";

const CustomerListGridHeaders = (props) => {
    return <div className="grid-row grid-row--header " key="part-display-grid-header-row">
        {customerFields.map((field, index) => <div
                className={`grid-item--header ${(props.lockFirstColumn && (index === 0)) && "grid-header--fixed-left"}`}
                key={`partHead${field.fieldName}`}
                data-test="customer-field-header"
            >
                {field.header}
            </div>
        )}
        {props.includeActions && <div
            className={`grid-item--header ${props.className}`}
            key="part-display-grid-header-actions"
            data-test="customer-actions"
        >
            Actions
        </div>}
        {props.showErrors && <div
            className={`grid-item--header ${props.className}`}
            key="part-display-grid-header-errors"
            data-test="customer-errors"
        >
            Errors
        </div>}
    </div>;
};
CustomerListGridHeaders.defaultProps = {
    className: "",
};
CustomerListGridHeaders.propTypes = {
    lockFirstColumn: PropTypes.bool,
    showErrors: PropTypes.bool,
    includeActions: PropTypes.bool,
    className: PropTypes.string,
};
export default CustomerListGridHeaders;