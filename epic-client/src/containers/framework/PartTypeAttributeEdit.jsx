import React, {Fragment} from "react";
import FormTextInput from "../../common/FormTextInput";
import AttributeOptions from "./AttributeOptions";
import SelectInput from "../../common/SelectInput";
import {attributeOptionTypes} from "../../helpers/constants";
import {generateRandomCode} from "../../helpers/utils";
import {NEW_FRAMEWORK_ID} from "../../helpers/framework";
import {Icon} from "semantic-ui-react";

class PartTypeAttributeEdit extends React.Component {
    handleInputChange = (fieldName, input) => {
        const updatedAttribute = Object.assign({}, this.props.attribute);
        if (fieldName.startsWith('attribute_name')) updatedAttribute.attribute_name = input;
        if (!updatedAttribute.attribute_name) updatedAttribute.delete = true;
        if (fieldName.startsWith('in_use')) updatedAttribute.in_use = input;
        if (fieldName.startsWith('mandatory')) updatedAttribute.mandatory = input;
        if (fieldName.startsWith('attribute_type')) updatedAttribute.attribute_type = input;
        if (fieldName.startsWith('options')) updatedAttribute.options = input;
        if (this.props.componentKey === NEW_FRAMEWORK_ID) updatedAttribute.dummyKey = NEW_FRAMEWORK_ID;

        this.props.handleAttributeChange(this.props.componentKey, updatedAttribute);
    };

    handleInputClear = (fieldName) => {
        const updatedAttribute = Object.assign({}, this.props.attribute);
        updatedAttribute.delete = true;
        this.props.handleAttributeChange(this.props.componentKey, updatedAttribute);
    };
    addAnother = () => {
        const updatedAttribute = Object.assign({}, this.props.attribute);
        updatedAttribute.dummyKey = generateRandomCode();
        this.props.handleAttributeChange(NEW_FRAMEWORK_ID, updatedAttribute);
    };

    render() {
        const { attribute, componentKey } = this.props;
        const inUseId = `in_use_${componentKey}`;
        const mandatoryId = `mandatory_${componentKey}`;
        const attribute_typeId = `attribute_type_${componentKey}`;
        const attributeOptions = attribute.options || [];
        return <Fragment>
            <td>
                <nobr>
                    <FormTextInput
                        placeholder="add new"
                        fieldName={`attribute_name_${componentKey}`}
                        value={attribute.attribute_name}
                        onChange={this.handleInputChange}
                        onClick={this.handleInputClear}
                    />
                    <label htmlFor={inUseId}>&nbsp;In Use?&nbsp;</label>
                    <input type="checkbox"
                           name={inUseId}
                           id={inUseId}
                           onChange={event => this.handleInputChange(event.target.name, !attribute.in_use)}
                           checked={attribute.in_use}
                    />
                    <label htmlFor={mandatoryId}>&nbsp;Mandatory?&nbsp;</label>

                    <input type="checkbox"
                           name={mandatoryId}
                           id={mandatoryId}
                           onChange={event => this.handleInputChange(event.target.name, !attribute.mandatory)}
                           checked={attribute.mandatory}
                    />
                    <label htmlFor={attribute_typeId}>&nbsp;Type:&nbsp;</label>
                    <SelectInput
                        fieldName={attribute_typeId}
                        options={attributeOptionTypes}
                        onChange={this.handleInputChange}
                        value={attribute.attribute_type}
                    />
                    {componentKey === NEW_FRAMEWORK_ID &&
                    <Icon
                        name="add"
                        onClick={this.addAnother}
                        title="confirm new Attribute"
                    />
                    }
                </nobr>
            </td>
            <td>
                {componentKey !== NEW_FRAMEWORK_ID &&
                <AttributeOptions
                    attributeKey={componentKey}
                    options={attributeOptions}
                    handleAttributeChange={this.handleInputChange}
                />
                }
            </td>
        </Fragment>;
    }
}

export default PartTypeAttributeEdit;