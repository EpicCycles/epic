import React from "react";
import * as PropTypes from "prop-types";
import SupplierProductFieldHeaders from "../supplierProduct/SupplierProductFieldHeaders";
import {fixedHeaderClassname} from "../app/model/helpers/display";
import {customerFields, partFields} from "../app/model/helpers/fields";
import AdditionalHeader from "../app/model/AdditionalHeader";
import ModelTableHeaders from "../app/model/ModelTableHeaders";

const CustomerListGridHeaders = (props) => {
    return <div className="grid-row grid-row--header " key="part-display-grid-header-row">
        <ModelTableHeaders
            modelFields={customerFields}
            lockFirstColumn={props.lockFirstColumn}
            className={props.className}
            data-test="customer-field-headers"
        />
        {props.includeActions && <AdditionalHeader
            className={props.className}
            key="part-display-grid-header-actions"
            data-test="customer-actions"
            headerText={'Actions'}
        />}
        {props.showErrors && <AdditionalHeader
            data-test="customer-errors"
            className={props.className}
            headerText={'Errors'}
        />}
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