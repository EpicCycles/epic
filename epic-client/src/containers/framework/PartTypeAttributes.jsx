import React from "react";
import PartTypeAttributeEdit from "./PartTypeAttributeEdit";
import {
    moveObjectDownOnePlace,
    moveObjectToBottom,
    moveObjectToTop,
    moveObjectUpOnePlace, NEW_ATTRIBUTE, NEW_FRAMEWORK_ID
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
        this.props.handlePartTypeChange(`attributes_${this.props.partTypeKey}`, attributesWithUpdates);
    };
    moveUp = (fieldName) => {
        const fields = fieldName.split('_');
        const attributeKey = fields[1];
        this.props.handlePartTypeChange(`attributes_${this.props.partTypeKey}`, moveObjectUpOnePlace(this.props.attributes, attributeKey));
    };
    moveDown = (fieldName) => {
        const fields = fieldName.split('_');
        const attributeKey = fields[1];
        this.props.handlePartTypeChange(`attributes_${this.props.partTypeKey}`, moveObjectDownOnePlace(this.props.attributes, attributeKey));
    };
    moveToTop = (fieldName) => {
        const fields = fieldName.split('_');
        const attributeKey = fields[1];
        this.props.handlePartTypeChange(`attributes_${this.props.partTypeKey}`, moveObjectToTop(this.props.attributes, attributeKey));
    };
    moveToBottom = (fieldName) => {
        const fields = fieldName.split('_');
        const attributeKey = fields[1];
        this.props.handlePartTypeChange(`attributes_${this.props.partTypeKey}`, moveObjectToBottom(this.props.attributes, attributeKey));
    };

    render() {
        const { partTypeKey, attributes } = this.props;
        const attributesToUse = attributes ? attributes.filter(attribute => !(attribute.delete || (attribute.dummyKey === NEW_FRAMEWORK_ID))) : [];
        const newAttributes = attributes ? attributes.filter(attribute => (attribute.dummyKey === NEW_FRAMEWORK_ID)) : [];
        let newAttributeDisplay = (newAttributes.length > 0) ? newAttributes[0] : NEW_ATTRIBUTE;
        return <table key={`attributes_${partTypeKey}`} className="full">
            <tbody>
            <tr>
                <th>Attribute Details</th>
                <th>Options</th>
                <th>Position</th>
            </tr>
            {attributesToUse.map((attribute) => {
                const componentKey = attribute.id ? attribute.id : attribute.dummyKey;
                const className = attribute.error ? "error" : "";
                const rowTitle = attribute.error ? attribute.error_detail : "";
                return (
                    <tr
                        key={`attributeRow${componentKey}`}
                        className={className}
                        title={rowTitle}
                    >
                        <PartTypeAttributeEdit
                            key={`attributeEdit${componentKey}`}
                            attribute={attribute}
                            componentKey={componentKey}
                            partType={partTypeKey}
                            handleAttributeChange={this.handleAttributeChange}
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
                    attribute={newAttributeDisplay}
                    componentKey={NEW_FRAMEWORK_ID}
                    handleAttributeChange={this.handleAttributeChange}
                />
                <td/>
            </tr>
            </tbody>
        </table>;
    }
}

export default PartTypeAttributes;