import React from "react";
import PartHeaders from "../part/PartHeaders";
import * as PropTypes from "prop-types";
import SupplierProductFieldHeaders from "../supplierProduct/SupplierProductFieldHeaders";
import {fixedHeaderClassname} from "../app/model/helpers/display";

const PartDisplayGridHeaders = (props) => {
    return <div className="grid-row grid-row--header ">
        <div
            className={`grid-item--header ${props.className} ${fixedHeaderClassname(props.lockFirstColumn)}`}
        >
            Section
        </div>
        <PartHeaders
            showErrors={props.showErrors}
            className={props.className}
        />
        {props.showSupplierProducts && <SupplierProductFieldHeaders
            className={props.className}
            showErrors={props.showErrors}
        />}
        {props.includeActions &&  <div
            className={`grid-item--header ${props.className}`}
        >
            Actions
        </div>}
    </div>;
};
PartDisplayGridHeaders.defaultProps = {
    lockFirstColumn: false,
    showSupplierProducts: false,
    showErrors: false,
    includeActions: false,
    className: "",
};
PartDisplayGridHeaders.propTypes = {
    lockFirstColumn: PropTypes.bool,
    showSupplierProducts: PropTypes.bool,
    showErrors: PropTypes.bool,
    includeActions: PropTypes.bool,
    className: PropTypes.string,
};
export default PartDisplayGridHeaders;