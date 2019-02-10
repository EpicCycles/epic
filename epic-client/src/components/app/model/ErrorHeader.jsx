import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import {fixedHeaderClassname} from "./helpers/display";

const ErrorHeader = (props) => {
    return <div className={`grid-item--header ${fixedHeaderClassname(props.lockedColumn)} ${props.className}`}>
        Errors
    </div>;
};
ErrorHeader.defaultProps = {
    lockedColumn: false,
    className: "",
};
ErrorHeader.propTypes = {
    lockedColumn: PropTypes.bool,
    className: PropTypes.string,
};
export default ErrorHeader;