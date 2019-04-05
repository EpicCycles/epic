import React from "react";

import {getPartTypeName} from "../partType/helpers/partType";
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