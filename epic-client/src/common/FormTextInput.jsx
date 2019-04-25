import React from "react";
import {Icon} from "semantic-ui-react";
import * as PropTypes from "prop-types";

const FormTextInput = props => {
    let value = props.value;
    if (value === null) value = '';
    return (
        <div
            id={props.id}
            className={"row " + (props.className) + (props.error ? " error" : "")}>
            {props.label && <label>{props.label}</label>}
            <input
                className={(props.error ? " error" : "")}
                type={props.dataType}
                autoComplete="off"
                placeholder={props.placeholder}
                title={`${props.title} ${props.error}`}
                name={props.fieldName}
                id={props.fieldName}
                onChange={event => props.onChange(props.fieldName, event.target.value)}
                value={value}
                size={props.size}
                list={props.list}
                disabled={props.disabled}
                maxLength={props.maxLength ? props.maxLength : props.size}
                onKeyPress={props.onKeyPress}
            />
            {(props.value && props.onClick) &&
            <span className="clearInput">
            <Icon
                name="remove"
                id={"remove" + props.fieldName}
                size="small"
                circular
                link
                onClick={event => props.onClick(props.fieldName)}
            />
        </span>}
        </div>
    );
};

FormTextInput.defaultProps = {
    className: "",
    error: "",
    label: "",
    dataType: "text",
    placeholder: "",
    title: "",
    value: "",
    list: "",
    size: 30,
};
FormTextInput.propsTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    error: PropTypes.string,
    label: PropTypes.string,
    dataType: PropTypes.string,
    placeholder: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.string,
    list: PropTypes.string,
    fieldName: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func,
    size: PropTypes.number,
    maxLength: PropTypes.number,
    disabled:PropTypes.bool,
};
export default FormTextInput;