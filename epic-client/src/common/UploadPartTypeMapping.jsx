import React from "react";
import {UploadMatchedData} from "./UploadMatchedData";
import {Icon} from "semantic-ui-react";

export const UploadPartTypeMapping = props => (
    <div className="grid-row">
        <div
            className="grid-item--borderless field-label red"
        >
            {(props.partTypeIndex === 0) ? props.section.name : " "}
        </div>
        <div
            className="grid-item--borderless field-label align_right"
            key={`partType${props.partType.id}`}
            onDragOver={event => props.allowDrop(event)}
            onDrop={event => props.assignToPartType(event, props.partType.id)}
        >
            {props.partType.shortName}
            <Icon
                key={`edit${props.partType.id}`}
                name="add circle"
                title="Edit part type and synonyms"
                onClick={() => props.setUpPartTypeModalForPart(props.sectionIndex, props.partTypeIndex)}
            />
        </div>
        <div
            className="grid-item--borderless field-label "
        >
            {props.rowMappings.map((matched, matchIndex) => <UploadMatchedData
                key={`partType${props.partType.id}${matchIndex}`}
                matched={matched}
                matchIndex={matchIndex}
                undoMapping={props.undoMapping}
                multiplesAllowed={props.multiplesAllowed}
                />)
            }
        </div>
    </div>
)