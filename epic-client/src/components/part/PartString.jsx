import React from "react";

import {getPartTypeName} from "../framework/helpers/framework";
import {buildPartString} from "./helpers/part";

const PartString = props => (
    <div
        key={`partString${props.part.id}`}
        className="column"
    >
        {getPartTypeName(props.part.partType, props.sections)} - {buildPartString(props.part, props.brands)}
    </div>
);

export default  PartString;