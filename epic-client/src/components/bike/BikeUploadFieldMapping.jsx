import React from "react";
/**
 *
 * @type {Function}
 * props
 * field, index, allowDrop, assignToBikeAttribute, rowMappings,undoMapping
 */
import {UploadMatchedPartType} from "../../common/UploadMatchedPartType";
import * as PropTypes from "prop-types";

export const BikeUploadFieldMapping = (props) => {
    return (<div className="grid-row">
        <div
            className="grid-item--borderless field-label align_right"
            key={`bikeField${props.index}`}
            onDragOver={event => props.allowDrop(event)}
            onDrop={event => props.assignToBikeAttribute(event, props.field.fieldName)}
        >
            {props.field.header}
        </div>
        <div
            key={`matchFieldDiv${props.index}`}
            className="grid-item--borderless field-label "
        >
            {props.rowMappings
                .map((matched, matchIndex) => <UploadMatchedPartType
                    key={`matchArea${props.index}${matchIndex}`}
                    matched={matched}
                    matchIndex={matchIndex}
                    undoMapping={props.undoMapping}
                />)
            }
        </div>
    </div>);
};
BikeUploadFieldMapping.propTypes = {
    field: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    rowMappings: PropTypes.array.isRequired,
    undoMapping: PropTypes.func.isRequired,
};