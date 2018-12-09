import React from "react";

import SelectInput from "../../common/SelectInput";

const PartTypeSelect = (props) => {
    const { sections, fieldName, onChange, partTypeSelected, isEmptyAllowed, error } = props;
    const partTypeOptions = [];
    sections && sections.forEach(section => {
        partTypeOptions.concat(section.partTypes.map(partType => {
            return {
                'value': partType.id ? partType.id : partType.dummyKey,
                'name': partType.shortName + " (" + section.shortName + ")"
            };
        }));
    });
    return <SelectInput
        fieldName={fieldName}
        onChange={onChange}
        value={partTypeSelected}
        options={partTypeOptions}
        isEmptyAllowed={isEmptyAllowed}
        error={error}
    />;
};
export default PartTypeSelect;