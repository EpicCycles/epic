import React from "react";
import FormTextInput from "../../common/FormTextInput";
import AttributeOptions from "./AttributeOptions";
import SelectInput from "../../common/SelectInput";
import {attributeOptionTypes} from "../../helpers/constants";
import {generateRandomCode} from "../../helpers/utils";

class PartTypeAttributeEdit extends React.Component {
    handleInputChange = (fieldName, input) => {
        const updatedAttribute = Object.assign({}, this.props.attribute);
        if (fieldName.startsWith('attribute_name')) {
            if (updatedAttribute.attribute_name) {
                updatedAttribute.attribute_name = input;
            } else {
                updatedAttribute.delete = true;
            }
        }
        if (fieldName.startsWith('in_use')) updatedAttribute.in_use = (input && input === "on");
        if (fieldName.startsWith('mandatory')) updatedAttribute.mandatory = (input && input === "on");
        if (fieldName.startsWith('attribute_type')) updatedAttribute.attribute_type = input;
        if (fieldName.startsWith('options')) updatedAttribute.options = input;
        const fieldNameParts = fieldName.split('_');
        const componentKey = fieldNameParts[1];
        if (updatedAttribute.id || updatedAttribute.dummyKey || updatedAttribute.attribute_name){
            if (!(updatedAttribute.id || updatedAttribute.dummyKey)) {
                updatedAttribute.dummyKey = generateRandomCode();
                updatedAttribute.partType = this.props.partType;
            }
            this.props.updatePartTypeAttribute(componentKey, updatedAttribute);
        }
    };

    handleInputClear = (fieldName) => {
        const updatedAttribute = Object.assign({}, this.props.attribute);
        updatedAttribute.delete = true;
        this.props.updatePartTypeAttribute(this.props.componentKey, updatedAttribute);
    };

    render() {
        const { attribute, componentKey } = this.props;
        const inUseId = `in_use_${componentKey}`;
        const mandatoryId = `in_use_${componentKey}`;
        const attributeOptions = attribute.options || [];
        return <li key={`attribute_${componentKey}`}>
            <FormTextInput
                placeholder="add new"
                fieldName={`attribute_name_${componentKey}`}
                value={attribute.attribute_name}
                onChange={this.handleInputChange}
                onClick={this.handleInputClear}
            />
            <label htmlFor={inUseId}>In Use?</label>
            <input type="checkbox"
                   name={inUseId}
                   id={inUseId}
                   onChange={event => this.handleInputChange(event.target.name, event.target.value)}
                   checked={attribute.in_use ? attribute.in_use : true}
            />
            <label htmlFor={mandatoryId}>In Use?</label>
            <input type="checkbox"
                   name={mandatoryId}
                   id={mandatoryId}
                   onChange={event => this.handleInputChange(event.target.name, event.target.value)}
                   checked={attribute.mandatory ? attribute.in_use : true}
            />
            <SelectInput
                fieldName={`attribute_type_${componentKey}`}
                options={attributeOptionTypes}
                onChange={event => this.handleInputChange(event.target.name, event.target.value)}
                value={attribute.attribute_type}
            />
            <AttributeOptions
                attributeKey={componentKey}
                options={attributeOptions}
                handleAttributeChange={this.handleInputChange}
            />
        </li>;
    }
}

export default PartTypeAttributeEdit;