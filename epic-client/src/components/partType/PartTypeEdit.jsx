import React, {Fragment} from "react";
import {generateRandomCode} from "../../helpers/utils";
import {Icon} from "semantic-ui-react";
import {NEW_ELEMENT_ID} from "../../helpers/constants";
import PartTypeData from "./PartTypeData";

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
        const { partType, componentKey, updatePartType } = this.props;
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
                <PartTypeData
                    partType={partType}
                    componentKey={componentKey}
                    handlePartTypeValueChange={this.handlePartTypeValueChange}
                    />
            </td>
        </Fragment>;
    }
}

export default PartTypeEdit;