import React, {Fragment} from "react";
import FormTextInput from "../../common/FormTextInput";
import {generateRandomCode} from "../../helpers/utils";
import PartTypeAttributes from "./PartTypeAttributes";
import {NEW_FRAMEWORK_ID} from "../../helpers/framework";

class PartTypeEdit extends React.Component {
    handlePartTypeValueChange = (fieldName, input) => {
        const updatedPartType = Object.assign({}, this.props.partType);
        if (fieldName.startsWith('shortName')) {
            if (updatedPartType.shortName) {
                updatedPartType.shortName = input;
            } else {
                updatedPartType.delete = true;
            }
        }
        if (fieldName.startsWith('description')) updatedPartType.description = input;
        if (fieldName.startsWith('can_be_substituted')) updatedPartType.can_be_substituted = (input && input === "on");
        if (fieldName.startsWith('can_be_omitted')) updatedPartType.can_be_omitted = (input && input === "on");
        if (fieldName.startsWith('customer_facing')) updatedPartType.customer_facing = (input && input === "on");
        if (fieldName.startsWith('attributes')) updatedPartType.attributes = input;
        const fieldNameParts = fieldName.split('_');
        const componentKey = fieldNameParts[1];
        if (updatedPartType.id || updatedPartType.dummyKey || updatedPartType.shortName) {
            if (!(updatedPartType.id || updatedPartType.dummyKey)) updatedPartType.dummyKey = generateRandomCode();
            this.props.updatePartType(componentKey, updatedPartType);
        }
    };

    handleInputClear = (fieldName) => {
        const updatedPartType = Object.assign({}, this.props.partType);
        updatedPartType.delete = true;
        this.props.updatePartType(this.props.componentKey, updatedPartType);
    };

    render() {
        const { partType, componentKey } = this.props;
        const can_be_substitutedId = `can_be_substituted_${componentKey}`;
        const can_be_omittedId = `can_be_omitted_${componentKey}`;
        const customer_facingId = `customer_facing_${componentKey}`;
        const attributes = partType.attributes || [];
        return <Fragment>
            <td>
                <FormTextInput
                    placeholder="add new"
                    fieldName={`shortName_${componentKey}`}
                    value={partType.shortName}
                    onChange={this.handlePartTypeValueChange}
                    onClick={this.handleInputClear}
                />
            </td>
            <td>
                <FormTextInput
                    placeholder="add new"
                    fieldName={`description_${componentKey}`}
                    value={partType.description}
                    onChange={this.handlePartTypeValueChange}
                    onClick={this.handleInputClear}
                />
            </td>
            <td>
                <label htmlFor={can_be_substitutedId}>Can Be Substituted?</label>
                <input type="checkbox"
                       name={can_be_substitutedId}
                       id={can_be_substitutedId}
                       onChange={event => this.handlePartTypeValueChange(event.target.name, event.target.value)}
                       checked={partType.can_be_substituted ? partType.can_be_substituted : true}
                />
                <br/>
                <label htmlFor={can_be_omittedId}>Can Be Omitted?</label>
                <input type="checkbox"
                       name={can_be_omittedId}
                       id={can_be_omittedId}
                       onChange={event => this.handlePartTypeValueChange(event.target.name, event.target.value)}
                       checked={partType.can_be_omitted ? partType.can_be_substituted : true}
                />
                <br/>
                <label htmlFor={customer_facingId}>Customer Facing?</label>
                <input type="checkbox"
                       name={customer_facingId}
                       id={customer_facingId}
                       onChange={event => this.handlePartTypeValueChange(event.target.name, event.target.value)}
                       checked={partType.customer_facing ? partType.customer_facing : true}
                />
            </td>
            <td>
                {componentKey !== NEW_FRAMEWORK_ID &&
                <PartTypeAttributes
                    partTypeKey={componentKey}
                    attributes={attributes}
                    handlePartTypeChange={this.handlePartTypeValueChange}
                />
                }
            </td>
        </Fragment>;
    }
}

export default PartTypeEdit;