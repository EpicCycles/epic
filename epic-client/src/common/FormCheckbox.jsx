import React, {Fragment} from "react";
import * as PropTypes from "prop-types";

const FormCheckbox = props => {
    const { fieldLabel, fieldName, fieldValue, onChange } = props;
    return <Fragment>
        <div className="field-label" data-test="checkbox-label">{fieldLabel}</div>
        <input
            type="checkbox"
            name={fieldName}
            onChange={() => onChange(fieldName, !fieldValue)}
            checked={fieldValue}
             data-test="checkbox-input"
        />
    </Fragment>;
};
FormCheckbox.defaultProps = {
    fieldValue: false,
};
FormCheckbox.propTypes = {
    onChange: PropTypes.func.isRequired,
    fieldName: PropTypes.string.isRequired,
    fieldValue: PropTypes.bool,
    fieldLabel: PropTypes.string.isRequired,
};
export default FormCheckbox