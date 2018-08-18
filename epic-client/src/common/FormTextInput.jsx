import React from "react";
import {Icon} from "semantic-ui-react";

const FormTextInput = props => (
    <div id={props.id} className={props.className + (props.error ? " error" : "")}>
        <label>{props.label}</label>
        <input
            type="text"
            autoComplete="off"
            placeholder={props.placeholder}
            title={props.title}
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
        {props.error &&
        <div id="error-message" className="error-message error">{props.error}</div>}
    </div>
);

export default FormTextInput;