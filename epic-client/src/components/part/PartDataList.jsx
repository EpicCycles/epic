import React from "react";

const PartDataList = (props) => (
    <datalist id={props.dataListId}>
        {(props.partDataList && props.partDataList.parts) &&
        props.partDataList.parts.map(part => <option
            value={part.part_name}
        />)
        }
    </datalist>
);

export default PartDataList;