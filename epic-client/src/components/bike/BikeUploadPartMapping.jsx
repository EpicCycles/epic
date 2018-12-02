import React from "react";
import {BikeUploadMatchedData} from "./BikeUploadMatchedData";
// partType allowDrop assignToPartType rowMappings
export const BikeUploadPartMapping = props => (
    <div className="grid-row">
        <div
            className="grid-item--borderless field-label align_right"
            key={`partType${props.partType.id}`}
            onDragOver={event => props.allowDrop(event)}
            onDrop={event => props.assignToPartType(event, props.partType.id)}
        >
            {props.partType.shortName}
        </div>
        <div
            className="grid-item--borderless field-label "
        >
            {props.rowMappings.filter(rowMapping => (rowMapping.partType === props.partType.id))
                .map((matched, matchIndex) => <BikeUploadMatchedData
                    key={`partType${props.partType.id}${matchIndex}`}
                    matched={matched}
                    matchIndex={matchIndex}
                    undoMapping={props.undoMapping}
                />)
            }
        </div>
    </div>
)