import React, {Fragment} from "react";
import PartTypeAttributeEdit from "./PartTypeAttributeEdit";
import {
    moveObjectDownOnePlace,
    moveObjectToBottom,
    moveObjectToTop,
    moveObjectUpOnePlace
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
        const attributesToUse = attributes.filter(attribute => !attribute.delete);
        return <ul key={`attributes_${partTypeKey}`}>
            {attributesToUse.map((attribute) => {
                const componentKey = attribute.id ? attribute.id : attribute.dummyKey;
                return (
                <Fragment>
                    <PartTypeAttributeEdit
                        key={`attributeEdit${componentKey}`}
                        attribute={attribute}
                        componentKey={componentKey}
                        partType={partTypeKey}
                        updatePartTypeAttribute={this.handleAttributeChange}
                    />
                    {attributesToUse.length > 1 &&
                    <FrameworkMoves
                        componentKey={componentKey}
                        moveToTop={this.moveToTop}
                        moveUp={this.moveUp}
                        moveDown={this.moveDown}
                        moveToBottom={this.moveToBottom}
                    />
                    }
                </Fragment>
                );
            })}
            <PartTypeAttributeEdit
                key="attributeEditNew"
                attribute={{}}
                componentKey={"new"}
                updatePartTypeAttribute={this.handleAttributeChange}
            />
        </ul>;
    }
}

export default PartTypeAttributes;