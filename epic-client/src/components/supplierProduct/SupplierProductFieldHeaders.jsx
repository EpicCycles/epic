import React, {Fragment} from "react";
import {supplierProductFields} from "../app/model/helpers/fields";
import * as PropTypes from "prop-types";
import {fixedHeaderClassname} from "../app/model/helpers/display";
import ErrorHeader from "../app/model/ErrorHeader";

const SupplierProductFieldHeaders = (props) => {
    return <Fragment>
        {supplierProductFields.map(field => {
            return <div
                className={`grid-item--header ${props.className} ${fixedHeaderClassname(props.lockFirstColumn)}`}
                key={`partHead${field.fieldName}`}
            >
                {field.header}
            </div>;
        })}
        <ErrorHeader/>
    </Fragment>;
};
SupplierProductFieldHeaders.defaultProps = {
    lockFirstColumn: false,
    showErrors: false,
    className: "",
};
SupplierProductFieldHeaders.propTypes = {
    lockFirstColumn: PropTypes.bool,
    showErrors: PropTypes.bool,
    className: PropTypes.string,
};
export default SupplierProductFieldHeaders;