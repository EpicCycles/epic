import React from "react";

import SelectInput from "../../common/SelectInput";
import {getComponentKey} from "../app/model/helpers/model";

const PartTypeSelect = (props) => {
    const { sections, fieldName, onChange, partTypeSelected, isEmptyAllowed, error, disabled } = props;
    const partTypeOptions = [];
    sections && sections.forEach(section => {
        section.partTypes.forEach(partType => {
            partTypeOptions.push({
                'value': String(getComponentKey(partType)),
                'name': partType.name + " (" + section.name + ")"
            });
        });
    });
    return <SelectInput
        fieldName={fieldName}
        onChange={onChange}
        value={partTypeSelected ? partTypeSelected.toString() : ""}
        options={partTypeOptions}
        isEmptyAllowed={isEmptyAllowed}
        error={error}
        disabled={disabled}
    />;
};
export default PartTypeSelect;