import React, {Fragment} from "react";
import FormTextInput from "../../common/FormTextInput";
import {generateRandomCode} from "../../helpers/utils";
import PartTypeAttributes from "../partTypeAttribute/PartTypeAttributes";
import {Icon} from "semantic-ui-react";
import {NEW_ELEMENT_ID} from "../../helpers/constants";
import PartTypeSynonyms from "./PartTypeSynonyms";

class PartTypeEdit extends React.Component {
    handlePartTypeValueChange = (fieldName, input) => {
        const updatedPartType = Object.assign({}, this.props.partType);
        if (fieldName.startsWith('shortName')) updatedPartType.shortName = input;
        if (!updatedPartType.shortName) {
            updatedPartType.error = true;
            updatedPartType.error_detail = "A name is required for the part Type";
        } else {
            updatedPartType.error = false;
            updatedPartType.error_detail = "";
        }
        if (fieldName.startsWith('description')) updatedPartType.description = input;
        if (fieldName.startsWith('can_be_substituted')) updatedPartType.can_be_substituted = input;
        if (fieldName.startsWith('can_be_omitted')) updatedPartType.can_be_omitted = input;
        if (fieldName.startsWith('customer_facing')) updatedPartType.customer_facing = input;
        if (fieldName.startsWith('attributes')) updatedPartType.attributes = input;
        if (fieldName.startsWith('synonyms')) updatedPartType.synonyms = input;
        if (fieldName.startsWith('detail')) updatedPartType._detail = input;
        if (this.props.componentKey === NEW_ELEMENT_ID) updatedPartType.dummyKey = NEW_ELEMENT_ID;

        this.props.updatePartType(this.props.componentKey, updatedPartType);
    };

    handleInputClear = (fieldName) => {
        if (window.confirm("Please confirm that you want to delete this Part Type")) {
            const updatedPartType = Object.assign({}, this.props.partType);
            updatedPartType.delete = true;
            this.props.updatePartType(this.props.componentKey, updatedPartType);
        }
    };
    toggleDetail = () => {
        this.handlePartTypeValueChange(`detail_${this.props.componentKey}`, !this.props.partType._detail)
    };
    addAnother = () => {
        const updatedPartType = Object.assign({}, this.props.partType);
        updatedPartType.dummyKey = generateRandomCode();
        this.props.updatePartType(NEW_ELEMENT_ID, updatedPartType);
    };

    render() {
        const { partType, componentKey } = this.props;
        const can_be_substitutedId = `can_be_substituted_${componentKey}`;
        const can_be_omittedId = `can_be_omitted_${componentKey}`;
        const customer_facingId = `customer_facing_${componentKey}`;
        const attributes = partType.attributes || [];
        const synonyms = partType.synonyms || [];
        return <Fragment>
            <td>
                {componentKey !== NEW_ELEMENT_ID ?
                    <Icon
                        name={`toggle ${partType._detail ? "down" : "right"}`}
                        onClick={this.toggleDetail}
                    />
                    :
                    <Icon
                        name="add"
                        onClick={this.addAnother}
                    />
                }
            </td>
            <td>
                <FormTextInput
                    placeholder="add new"
                    fieldName={`shortName_${componentKey}`}
                    value={partType.shortName}
                    onChange={this.handlePartTypeValueChange}
                    onClick={this.handleInputClear}
                />
                <label htmlFor={can_be_substitutedId}>Can Be Substituted?</label>
                <input type="checkbox"
                       name={can_be_substitutedId}
                       id={can_be_substitutedId}
                       onChange={event => this.handlePartTypeValueChange(event.target.name, !partType.can_be_substituted)}
                       checked={partType.can_be_substituted}
                />
                <label htmlFor={can_be_omittedId}>Can Be Omitted?</label>
                <input type="checkbox"
                       name={can_be_omittedId}
                       id={can_be_omittedId}
                       onChange={event => this.handlePartTypeValueChange(event.target.name, !partType.can_be_omitted)}
                       checked={partType.can_be_omitted}
                />
                <label htmlFor={customer_facingId}>Customer Facing?</label>
                <input type="checkbox"
                       name={customer_facingId}
                       id={customer_facingId}
                       onChange={event => this.handlePartTypeValueChange(event.target.name, !partType.customer_facing)}
                       checked={partType.customer_facing}
                />
                {attributes && `Attributes: ${attributes.length}`}
                {synonyms && `Synonyms: ${synonyms.length}`}
                {(partType._detail && componentKey !== NEW_ELEMENT_ID) &&
                    <Fragment>
                        <PartTypeAttributes
                            partTypeKey={componentKey}
                            attributes={attributes}
                            handlePartTypeChange={this.handlePartTypeValueChange}
                        />
                        <PartTypeSynonyms
                            partTypeKey={componentKey}
                            synonyms={synonyms}
                            handlePartTypeChange={this.handlePartTypeValueChange}
                        />

                    </Fragment>
                }
            </td>
        </Fragment>;
    }
}

export default PartTypeEdit;