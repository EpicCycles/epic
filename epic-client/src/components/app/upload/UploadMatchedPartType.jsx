import React from "react";
import {Icon} from "semantic-ui-react";
import * as PropTypes from "prop-types";

export const UploadMatchedPartType = props => (
    <div
        key={`match${props.matched.rowIndex}${props.matchIndex}`}
        className={(props.multiplesAllowed || (props.matchIndex === 0)) ? "rounded-auto" : "rounded-auto red"}
    >
        {props.matched.partTypeName}
        <Icon
            key={`matchDelete$${props.matched.rowIndex}${props.matchIndex}`}
            name="delete"
            onClick={() => props.undoMapping(props.matched.rowIndex)}
        />
    </div>
);
UploadMatchedPartType.propTypes = {
    matched: PropTypes.object.isRequired,
    matchIndex: PropTypes.number.isRequired,
    undoMapping: PropTypes.func.isRequired,
    multiplesAllowed: PropTypes.bool,
};