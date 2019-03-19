import React, {Component} from "react";
import * as PropTypes from "prop-types";

class SelectInput extends Component {
    buildOptions = (options, isEmptyAllowed, value) => {
        let displayOptions = [];
        let selectedValues = value ? value : [];
        isEmptyAllowed && displayOptions.push({ value: "", name: "None", selected: (!value) });
        options.forEach((option) => {
            const displayName = option.name ? option.name : option.value;
            const displaySelected = selectedValues.length > 0 ? selectedValues.includes(option.value) : option.isDefault;
            displayOptions.push({ value: option.value, name: displayName, selected: displaySelected });
        });
        return displayOptions;
    };

    findSelectedOptions = (options, value, isMultiple) => {
        if (Array.isArray(value) && value.length > 0) {
            if (isMultiple) {
                return JSON.stringify(value)
            } else {
                return value[0].toString();
            }
        } else if (value && (value.length > 0)) {
            if (isMultiple) {
                return [value]
            } else {
                return value;
            }
        }

        // no selected value found
        let defaultValue = [];
        options.forEach((option) => {
            if (option.isDefault) defaultValue.push(option.value);
        });
        if (isMultiple) {
            return defaultValue;
        } else {
            return defaultValue[0];
        }
    };

    handleChange = (event) => {
        if (this.props.isMultiple) {
            let value = [];
            const options = event.target.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    value.push(options[i].value);
                }
            }
            this.props.onChange(event.target.name, value)
        } else {
            this.props.onChange(event.target.name, event.target.value);
        }

    };
    render() {
        const { className, fieldName, error, title, label, isMultiple, multipleSize, value, isEmptyAllowed, options } = this.props;
        const displayOptions = this.buildOptions(options, isEmptyAllowed, value);
        const selectedValue = this.findSelectedOptions(options, value, isMultiple);

        return <div
            key={'select-container' + fieldName}
            className={className + (error ? " error" : "")}
            title={error}
        >
            {label && <label>{label}</label>}
            <select
                name={fieldName}
                id={fieldName}
                key={fieldName}
                title={title}
                multiple={isMultiple}
                size={multipleSize}
                onChange={event => this.handleChange(event)}
                value={selectedValue}
            >
                {displayOptions.map((option) => {
                    return <option
                        id={`${fieldName}_${option.value}`}
                        key={`${fieldName}_${option.value}`}
                        value={option.value}
                    >
                        {option.name}
                    </option>
                })}
            </select>
        </div>;
    };
}

SelectInput.defaultProps = {
   className: '',
   error: '',
   multipleSize: 1,
};
SelectInput.propTypes = {
    className: PropTypes.string,
    error: PropTypes.string,
    title: PropTypes.string,
    label: PropTypes.string,
    fieldName: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    isMultiple: PropTypes.bool,
    multipleSize: PropTypes.number,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    isEmptyAllowed: PropTypes.bool,
    options: PropTypes.array.isRequired,
};
export default SelectInput;