import React from "react";
import {Icon} from "semantic-ui-react";

export const BikeUploadMatchedData = props => (
    <div
        key={`match${props.matched.rowIndex}${props.matchIndex}`}
        className={(props.matchIndex > 1) ? "rounded-auto red" : "rounded-auto "}
    >
        {props.matched.rowField}
        <Icon
            key={`matchDelete$${props.matched.rowIndex}${props.matchIndex}`}
            name="delete"
            onClick={() => props.undoMapping(props.matched.rowIndex)}
        />
    </div>
);