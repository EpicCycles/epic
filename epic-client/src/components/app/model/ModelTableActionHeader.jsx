import React from "react";
import * as PropTypes from "prop-types";

const ModelTableActionHeader = (props) => <div
        className={`grid-item--header grid-header--fixed-right ${props.className}`}
    >
        Action
    </div>
;

ModelTableActionHeader.defaultProps = {
    className: "",
};
ModelTableActionHeader.propTypes = {
    className: PropTypes.string,
};
export default ModelTableActionHeader;