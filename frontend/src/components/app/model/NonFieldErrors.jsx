import React from "react";
import * as PropTypes from "prop-types";

import {doWeHaveObjects} from "../../../helpers/utils";

const NonFieldErrors = props => {
    const { error_detail, componentKey } = props;
    if (doWeHaveObjects(error_detail.non_field_errors)) {
        const displayText = error_detail.non_field_errors.join(' ');
        return <div
            className="grid-row"
            key={`error-row${componentKey}`}
        >
            <div
                className="grid-item--borderless field-label align_right"
                key={`errorCell${componentKey}`}
            >Errors:
            </div>
            <div
                key={`error${componentKey}`}
                className="grid-item--borderless field-label red"
                data-test="error-detail-div"
            >
                {displayText}
            </div>
        </div>;
    }
    return null;
};
NonFieldErrors.propTypes = {
    componentKey: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    error_detail: PropTypes.object,
};
export default NonFieldErrors;