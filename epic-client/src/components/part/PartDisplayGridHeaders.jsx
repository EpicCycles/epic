import React from "react";
import PartHeaders from "../part/PartHeaders";
import * as PropTypes from "prop-types";
import SupplierProductFieldHeaders from "../supplierProduct/SupplierProductFieldHeaders";
import {fixedHeaderClassname} from "../app/model/helpers/display";

const PartDisplayGridHeaders = (props) => {
    return <div className="grid-row grid-row--header " key="part-display-grid-header-row">
        <div
            className={`grid-item--header ${props.className} ${fixedHeaderClassname(props.lockFirstColumn)}`}
            key="part-display-grid-header-section"
        >
            Section
        </div>
        <PartHeaders
            showErrors={props.showErrors}
            className={props.className}
            key="part-display-grid-header-part-headers"
        />
        {props.showSupplierProducts && <SupplierProductFieldHeaders
            className={props.className}
            showErrors={props.showErrors}
            key="part-display-grid-header-sp-headers"
        />}
        {props.includeActions && <div
            className={`grid-item--header ${props.className}`}
            key="part-display-grid-header-actions"
        >
            Actions
        </div>}
    </div>;
};
PartDisplayGridHeaders.defaultProps = {
    className: "",
};
PartDisplayGridHeaders.propTypes = {
    lockFirstColumn: PropTypes.bool,
    showSupplierProducts: PropTypes.bool,
    showErrors: PropTypes.bool,
    includeActions: PropTypes.any,
    className: PropTypes.string,
};
export default PartDisplayGridHeaders;