import React from "react";
import {Icon} from "semantic-ui-react";

const FormTextAreaInput = props => (
    <div id={props.id} className={props.className + (props.error ? " error" : "")}>
        {props.label && <label>{props.label}</label>}
        <textarea
            name={props.fieldName}
            id={props.fieldName}
            autoComplete="off"
            placeholder={props.placeholder}
            title={`${props.title || ''} ${props.error || ''}`}
            onChange={event => props.onChange(event.target.id, event.target.value)}
            value={props.value ? props.value : ''}
            rows={props.rows ? props.rows : 4} cols={props.cols ? props.cols : 50}
            disabled={props.disabled}
        />
        {props.value &&
        <span className="clearInput">
      <Icon
          name="remove"
          size="small"
          circular
          link
          onClick={props.onClick}
      />
    </span>}
        {props.error &&
        <div id="error-message" className="error-message error">{props.error}</div>}
    </div>
);

export default FormTextAreaInput;