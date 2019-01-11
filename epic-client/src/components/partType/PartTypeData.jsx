import React, {Fragment} from "react";
import FormTextInput from "../../common/FormTextInput";
import PartTypeAttributes from "../partTypeAttribute/PartTypeAttributes";
import PartTypeSynonyms from "./PartTypeSynonyms";
import {updateObject} from "../../helpers/utils";

class PartTypeData extends React.Component {

    handleInputClear = () => {
        if (window.confirm("Please confirm that you want to delete the Part Type and all data")) {
            const updatedPartType = updateObject(this.props.partType);
            updatedPartType.delete = true;
            this.props.updatePartType(this.props.componentKey, updatedPartType);
        }
    };

    render() {
        const { partType, componentKey, handlePartTypeValueChange } = this.props;
        const can_be_substitutedId = `can_be_substituted_${componentKey}`;
        const can_be_omittedId = `can_be_omitted_${componentKey}`;
        const customer_facingId = `customer_facing_${componentKey}`;
        const attributes = partType.attributes || [];
        const synonyms = partType.synonyms || [];
        return <Fragment>

                <FormTextInput
                    placeholder="add new"
                    fieldName={`shortName_${componentKey}`}
                    value={partType.shortName}
                    onChange={handlePartTypeValueChange}
                    onClick={this.handleInputClear}
                />
                <label htmlFor={can_be_substitutedId}>Can Be Substituted?</label>
                <input type="checkbox"
                       name={can_be_substitutedId}
                       id={can_be_substitutedId}
                       onChange={event => handlePartTypeValueChange(event.target.name, !partType.can_be_substituted)}
                       checked={(partType.can_be_substituted === true)}
                />
                <label htmlFor={can_be_omittedId}>Can Be Omitted?</label>
                <input type="checkbox"
                       name={can_be_omittedId}
                       id={can_be_omittedId}
                       onChange={event => handlePartTypeValueChange(event.target.name, !partType.can_be_omitted)}
                       checked={(partType.can_be_omitted === true)}
                />
                <label htmlFor={customer_facingId}>Customer Facing?</label>
                <input type="checkbox"
                       name={customer_facingId}
                       id={customer_facingId}
                       onChange={event => handlePartTypeValueChange(event.target.name, !partType.customer_facing)}
                       checked={(partType.customer_facing === true)}
                />
            {(!partType._detail) &&
            <div>
                {attributes && `Attributes: ${attributes.length}`}
                {synonyms && `Synonyms: ${synonyms.length}`}
            </div>}
                {(partType._detail) &&
                    <Fragment>
                        <PartTypeAttributes
                            partTypeKey={componentKey}
                            attributes={attributes}
                            handlePartTypeChange={handlePartTypeValueChange}
                        />
                        <PartTypeSynonyms
                            partTypeKey={componentKey}
                            label="synonyms"
                            synonyms={synonyms}
                            handlePartTypeChange={handlePartTypeValueChange}
                        />
                    </Fragment>
                }
        </Fragment>;
    }
}

export default PartTypeData;