import React, {Fragment} from "react";
import {generateRandomCode} from "../../helpers/utils";
import {Icon} from "semantic-ui-react";
import {NEW_ELEMENT_ID} from "../../helpers/constants";
import PartTypeData from "./PartTypeData";
import {processPartTypeValueChanges} from "../../helpers/framework";

class PartTypeEdit extends React.Component {
    handlePartTypeValueChange = (fieldName, input) => {
        const updatedPartType = processPartTypeValueChanges(this.props.partType, this.props.componentKey,fieldName, input);

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
                    updatePartType={updatePartType}
                    />
            </td>
        </Fragment>;
    }
}

export default PartTypeEdit;