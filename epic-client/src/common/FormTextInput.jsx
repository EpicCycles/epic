import React from "react";
import {Icon} from "semantic-ui-react";
import * as PropTypes from "prop-types";

const FormTextInput = props => (
    <div
        id={props.id}
        className={(props.className) + (props.error ? " error" : "")}>
        {props.label && <label>{props.label}</label>}
        <input
            className={(props.error ? " error" : "")}
            type={props.dataType}
            autoComplete="off"
            placeholder={props.placeholder}
            title={`${props.title} ${props.error}`}
            name={props.fieldName}
            id={props.fieldName}
            onChange={event => props.onChange(event.target.id, event.target.value)}
            value={props.value}
            size={props.size}
        />
        {(props.value && props.onClick) &&
        <span className="clearInput">
            <Icon
                name="remove"
                id={"remove" + props.fieldName}
                size="small"
                circular
                link
                onClick={event => props.onClick(event.target.id)}
            />
        </span>}
    </div>
);

FormTextInput.defaultProps = {
    className: "",
    error: "",
    label: "",
    dataType: "text",
    placeholder: "",
    title: "",
    value: "",
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
    fieldName: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    size: PropTypes.number,
};
export default FormTextInput;