import React from "react";

import * as PropTypes from "prop-types";
import SelectInput from "../../common/SelectInput";
import {COUNTRIES} from "./helpers/address";

const CountrySelect = (props) => {
    const { fieldName, onChange, countrySelected, isEmptyAllowed } = props;
    return <SelectInput
        fieldName={fieldName}
        onChange={onChange}
        value={countrySelected}
        options={COUNTRIES}
        isEmptyAllowed={isEmptyAllowed}
    />;
};
CountrySelect.propTypes = {
    fieldName: PropTypes.string,
    countrySelected: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    isEmptyAllowed: PropTypes.bool,
};
export default CountrySelect;