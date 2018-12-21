import React, {Component} from "react";
import FormTextInput from "./FormTextInput";
import {CHECKBOX, NUMBER, TEXT_AREA} from "../helpers/models";
import FormTextAreaInput from "./FormTextAreaInput";

class EditModelField extends Component {
    state={};
    validateOnChange = (fieldName, fieldValue) => {
        if (fieldValue) {
            this.props.onChange(this.props.field.fieldName, fieldValue, this.props.componentKey);
        } else {
            this.props.onChange(this.props.field.fieldName, "", this.props.componentKey);
            if (this.props.field.required) {
                this.setState({error: this.props.field.error})
            }
        }
    };
    resetField = fieldName => {
        this.props.onChange(fieldName, this.props.persistedModel[this.props.field.fieldName]);
    };

    render() {
        const { field, model, className, componentKey, index } = this.props;
        const {error} = this.state;
        let editComponent;
        const fieldName = `${field.fieldName}_${componentKey}${index}`;
        const fieldValue = model[field.fieldName];
        switch (field.type) {
            case TEXT_AREA:
                editComponent = <FormTextAreaInput
                    className={className}
                    placeholder={field.header}
                    error={error}
                    fieldName={fieldName}
                    value={fieldValue}
                    onChange={this.validateOnChange}
                    cols={Math.ceil(field.size / 4)}
                    onClick={this.resetField}
                />;
                break;
            case NUMBER:
                editComponent = <FormTextInput
                    type="number"
                    className={className}
                    placeholder={field.header}
                    error={error}
                    fieldName={fieldName}
                    value={fieldValue}
                    onChange={this.validateOnChange}
                    size={field.size}
                    onClick={this.validateOnChange}
                />;
                break;
            case CHECKBOX:
                editComponent = <input type="checkbox"
                                       name={fieldValue}
                                       onChange={() => this.validateOnChange(fieldName, !fieldValue)}
                                       checked={fieldValue}
                />;
                break;
            default:
                editComponent = <FormTextInput
                    className={className}
                    placeholder={field.header}
                    error={error}
                    onChange={this.validateOnChange}
                    fieldName={fieldName}
                    value={fieldValue}
                    size={field.size}
                    onClick={this.validateOnChange}
                />;
        }
        return <div className="grid-row">
            <div
                className="grid-item--borderless field-label align_right"
                key={`modelField${componentKey}${index}`}
            >
                {field.header}
            </div>
            <div
                key={`matchFieldDiv${componentKey}${index}`}
                className="grid-item--borderless field-label "
            >
                {editComponent}
            </div>
        </div>;
    };
}

export default EditModelField;