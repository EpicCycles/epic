import React from "react";
import PartTypeAttributeEdit from "./PartTypeAttributeEdit";
import {
    moveObjectDownOnePlace,
    moveObjectToBottom,
    moveObjectToTop,
    moveObjectUpOnePlace, NEW_FRAMEWORK_ID
} from "../../helpers/framework";
import FrameworkMoves from "./FrameworkMoves";
import {findIndexOfObjectWithKey} from "../../helpers/utils";

class PartTypeAttributes extends React.Component {
    handleAttributeChange = (attributeKey, updatedAttribute) => {
        const attributesWithUpdates = this.props.attributes.slice();
        const attributeToUpdateIndex = findIndexOfObjectWithKey(attributesWithUpdates, attributeKey);
        if (attributeToUpdateIndex > -1) {
            attributesWithUpdates[attributeToUpdateIndex] = updatedAttribute;
        } else {
            attributesWithUpdates.push(updatedAttribute);
        }
        this.props.updatePartType(`attributes_${this.props.partTypeKey}`, attributesWithUpdates);
    };
    moveUp = (fieldName) => {
        const fields = fieldName.split('_');
        const attributeKey = fields[1];
        this.props.updatePartType(`attributes_${this.props.partTypeKey}`, moveObjectUpOnePlace(this.props.attributes, attributeKey));
    };
    moveDown = (fieldName) => {
        const fields = fieldName.split('_');
        const attributeKey = fields[1];
        this.props.updatePartType(`attributes_${this.props.partTypeKey}`, moveObjectDownOnePlace(this.props.attributes, attributeKey));
    };
    moveToTop = (fieldName) => {
        const fields = fieldName.split('_');
        const attributeKey = fields[1];
        this.props.updatePartType(`attributes_${this.props.partTypeKey}`, moveObjectToTop(this.props.attributes, attributeKey));
    };
    moveToBottom = (fieldName) => {
        const fields = fieldName.split('_');
        const attributeKey = fields[1];
        this.props.updatePartType(`attributes_${this.props.partTypeKey}`, moveObjectToBottom(this.props.attributes, attributeKey));
    };

    render() {
        const { partTypeKey, attributes } = this.props;
        const attributesToUse = attributes.filter(attribute => !attribute.delete);
        return <table key={`attributes_${partTypeKey}`}>
            <tbody>
            <tr>
                <th>Attribute Name</th>
                <th>Used?</th>
                <th>Mandatory?</th>
                <th>Type</th>
                <th>Options</th>
                <th>Position</th>
            </tr>
            {attributesToUse.map((attribute) => {
                const componentKey = attribute.id ? attribute.id : attribute.dummyKey;
                return (
                    <tr key={`attributeRow${componentKey}`}>
                        <PartTypeAttributeEdit
                            key={`attributeEdit${componentKey}`}
                            attribute={attribute}
                            componentKey={componentKey}
                            partType={partTypeKey}
                            updatePartTypeAttribute={this.handleAttributeChange}
                        />
                        <td>
                            {attributesToUse.length > 1 &&
                            <FrameworkMoves
                                componentKey={componentKey}
                                moveToTop={this.moveToTop}
                                moveUp={this.moveUp}
                                moveDown={this.moveDown}
                                moveToBottom={this.moveToBottom}
                            />
                            }
                        </td>
                    </tr>
                );
            })}
            <tr key={`newattributeRow${partTypeKey}`}>
                <PartTypeAttributeEdit
                    key="attributeEditNew"
                    attribute={{}}
                    componentKey={NEW_FRAMEWORK_ID}
                    updatePartTypeAttribute={this.handleAttributeChange}
                />
                <td />
            </tr>
            </tbody>
        </table>;
    }
}

export default PartTypeAttributes;