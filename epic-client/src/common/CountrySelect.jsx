import React from "react";

import * as PropTypes from "prop-types";
import SelectInput from "./SelectInput";
import {countries} from "../helpers/address_helpers";

const CountrySelect = (props) => {
    const { fieldName, onChange, countrySelected, isEmptyAllowed } = props;
    return <SelectInput
        fieldName={fieldName}
        onChange={onChange}
        value={countrySelected}
        options={countries}
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