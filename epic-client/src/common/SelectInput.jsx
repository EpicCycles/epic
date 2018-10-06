import React, {Component} from "react";

/**
 * DIsplay generic select boc
 * @param props
 *  className - string optional
 *  error - string optional
 *  title - string optional
 *  label - string optional
 *  fieldName - String required
 *  onChange - function from container component
 *  isMultiple - boolean optional
 *  multipleSize - optional integer number shown - not used if isMultiple is not true
 *  value - Array of Strings for selected values optional
 *  isEmptyAllowed - boolean optional
 *  options - array:
 *      value - String - value for database
 *      name - String - value to be selected, optional value will be used if none passed
 *      isDefault - boolean optional
 *
 */
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
        if (value && value.length > 0) {
            if (isMultiple) {
                return value
            } else {
                return value[0];
            }
        }
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

    render() {
        const { className, fieldName, error, title, label, onChange, isMultiple, multipleSize, value, isEmptyAllowed, options } = this.props;
        const displayOptions = this.buildOptions(options, isEmptyAllowed, value);
        const selectedValue = this.findSelectedOptions(options, value, isMultiple);

        return <div
            id={"container" + fieldName}
            key={"container" + fieldName}
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
                onChange={event => onChange(event.target.name, event.target.value)}
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

export default SelectInput;