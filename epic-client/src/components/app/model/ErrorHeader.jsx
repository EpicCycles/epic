import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import {fixedHeaderClassname, gridHeaderClass} from "./helpers/display";

const ErrorHeader = (props) => {
    return <div className={gridHeaderClass(props.className, 0, props.lockedColumn)}>
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