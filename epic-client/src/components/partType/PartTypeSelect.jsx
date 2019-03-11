import React from "react";
import * as PropTypes from "prop-types";

import SelectInput from "../../common/SelectInput";
import {getModelKey} from "../app/model/helpers/model";

const PartTypeSelect = (props) => {
    const { sections, fieldName, onChange, partTypeSelected, isEmptyAllowed, error, disabled } = props;
    const partTypeOptions = [];
    sections && sections.forEach(section => {
        section.partTypes.forEach(partType => {
            partTypeOptions.push({
                'value': String(getModelKey(partType)),
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

PartTypeSelect.defaultProps = {
    sections: [],
    fieldName: 'partType',
    isEmptyAllowed: false,
    error: "",
    disabled: false
};

PartTypeSelect.propTypes = {
    sections: PropTypes.array.isRequired,
    fieldName: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    partTypeSelected: PropTypes.any,
    isEmptyAllowed: PropTypes.bool,
    error: PropTypes.string,
    disabled: PropTypes.bool,
};

export default PartTypeSelect;