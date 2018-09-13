import React from "react";
import {Icon} from "semantic-ui-react";

const FormTextInput = props => (
    <div id={props.id} className={props.className + (props.error ? " error" : "")}>
        {props.label&&<label>{props.label}</label>}
        <input
             className={(props.error ? " error" : "")}
            type="text"
            autoComplete="off"
            placeholder={props.placeholder}
            title={`${props.title || ''} ${props.error}`}
            name={props.fieldName}
            onChange={event => props.onChange(event.target.name, event.target.value)}
            value={props.value ? props.value : ''}
        />
        {props.value &&
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

export default FormTextInput;