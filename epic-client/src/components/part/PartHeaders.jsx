import React, {Fragment} from "react";
import {partFields} from "../../helpers/models";
import * as PropTypes from "prop-types";

const PartHeaders = (props) => {
    return <Fragment>
        {partFields.map((field, index) =>  <div
                className={`grid-item--header ${(props.lockFirstColumn && (index === 0)) && "grid-header--fixed-left"}`}
                key={`partHead${field.fieldName}`}
            >
                {field.header}
            </div>
        )}
    </Fragment>;
};
PartHeaders.propTypes = {
    lockFirstColumn: PropTypes.bool,
};
export default PartHeaders;