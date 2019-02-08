import React from "react";

import SelectInput from "../../common/SelectInput";
import * as PropTypes from "prop-types";
import {getComponentKey} from "../app/model/helpers/model";
import {buildPartString} from "./helpers/part";

const PartSelect = (props) => {
    const { parts, brands, fieldName, onChange, partSelected, isEmptyAllowed, isMultiple, multipleSize } = props;
    const partOptions = parts ? parts.map(part => {
        return {
            value: String(getComponentKey(part)),
            name: buildPartString(part, brands)
        }
    }) : [];
    return <SelectInput
        fieldName={fieldName}
        onChange={onChange}
        value={getComponentKey(partSelected)}
        options={partOptions}
        isEmptyAllowed={isEmptyAllowed}
        isMultiple={isMultiple}
        multipleSize={multipleSize}
    />;
};
PartSelect.defaultProps = {
    isEmptyAllowed: true,
    isMultiple: false,
    multipleSize: 0,
    partSelected: {}
};
PartSelect.propTypes = {
    fieldName: PropTypes.string.isRequired,
    brands: PropTypes.array,
    parts: PropTypes.array,
    partSelected: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    isEmptyAllowed: PropTypes.bool,
    isMultiple: PropTypes.bool,
    multipleSize: PropTypes.number,
};
export default PartSelect;