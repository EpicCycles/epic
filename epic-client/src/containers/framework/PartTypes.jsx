import React from "react";
import PartTypeEdit from "./PartTypeEdit";
import {
    moveObjectDownOnePlace,
    moveObjectToBottom,
    moveObjectToTop,
    moveObjectUpOnePlace, NEW_FRAMEWORK_ID
} from "../../helpers/framework";
import FrameworkMoves from "./FrameworkMoves";
import {findIndexOfObjectWithKey} from "../../helpers/utils";

class PartTypes extends React.Component {
    updatePartType = (partTypeKey, updatedPartType) => {
        const partTypesWithUpdates = this.props.partTypes.slice();
        const partTypeToUpdateIndex = findIndexOfObjectWithKey(partTypesWithUpdates, partTypeKey);
        if (partTypeToUpdateIndex > -1) {
            partTypesWithUpdates[partTypeToUpdateIndex] = updatedPartType;
        } else {
            partTypesWithUpdates.push(updatedPartType);
        }
        this.props.handleSectionChange(`partTypes_${this.props.sectionKey}`, partTypesWithUpdates);
    };
    moveUp = (fieldName) => {
        const fields = fieldName.split('_');
        const partTypeKey = fields[1];
        this.props.handleSectionChange(`partTypes_${this.props.sectionKey}`, moveObjectUpOnePlace(this.props.partTypes, partTypeKey));
    };
    moveDown = (fieldName) => {
        const fields = fieldName.split('_');
        const partTypeKey = fields[1];
        this.props.handleSectionChange(`partTypes_${this.props.sectionKey}`, moveObjectDownOnePlace(this.props.partTypes, partTypeKey));
    };
    moveToTop = (fieldName) => {
        const fields = fieldName.split('_');
        const partTypeKey = fields[1];
        this.props.handleSectionChange(`partTypes_${this.props.sectionKey}`, moveObjectToTop(this.props.partTypes, partTypeKey));
    };
    moveToBottom = (fieldName) => {
        const fields = fieldName.split('_');
        const partTypeKey = fields[1];
        this.props.handleSectionChange(`partTypes_${this.props.sectionKey}`, moveObjectToBottom(this.props.partTypes, partTypeKey));
    };

    render() {
        const { sectionKey, partTypes } = this.props;
        const partTypesToUse = partTypes.filter(partType => !partType.delete);
        return <table key={`partTypes_${sectionKey}`}>
            <tbody>
            <tr key={`partTypeHeader${sectionKey}`}>
                <th>Name</th>
                <th>Description</th>
                <th>Quote options</th>
                <th>Attributes</th>
                <th>Position</th>
            </tr>
            {partTypesToUse.map((partType) => {
                const componentKey = partType.id ? partType.id : partType.dummyKey;
                return (
                    <tr key={`partType_${componentKey}`}>
                        <PartTypeEdit
                            key={`partTypeEdit${componentKey}`}
                            partType={partType}
                            componentKey={componentKey}
                            updatePartType={this.updatePartType}
                        />
                        {partTypesToUse.length > 1 &&
                        <td>
                            <FrameworkMoves
                                componentKey={componentKey}
                                moveToTop={this.moveToTop}
                                moveUp={this.moveUp}
                                moveDown={this.moveDown}
                                moveToBottom={this.moveToBottom}
                            />
                        </td>
                        }
                    </tr>
                );
            })}
            <tr key={`partTypeNew_${sectionKey}`}>
                <PartTypeEdit
                    key="partTypeEditNew"
                    partType={{}}
                    componentKey={NEW_FRAMEWORK_ID}
                    updatePartType={this.updatePartType}
                />
                <td/>
            </tr>
            </tbody>
        </table>;
    }
}

export default PartTypes;