import React from "react";
import * as PropTypes from "prop-types";
import {gridHeaderClass} from "./helpers/display";

const AdditionalHeader = (props) => {
    return <div className={gridHeaderClass(props.className, 0, props.lockedColumn)}>
        {props.headerText}
    </div>;
};
AdditionalHeader.defaultProps = {
    lockedColumn: false,
    className: "",
};
AdditionalHeader.propTypes = {
    lockedColumn: PropTypes.bool,
    className: PropTypes.string,
    headerText: PropTypes.string.isRequired,
};
export default AdditionalHeader;