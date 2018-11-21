import React from "react";
import PartTypeEdit from "./PartTypeEdit";
import {
    moveObjectDownOnePlace,
    moveObjectToBottom,
    moveObjectToTop,
    moveObjectUpOnePlace, NEW_PART_TYPE
} from "../../helpers/framework";
import FrameworkMoves from "../framework/FrameworkMoves";
import {findIndexOfObjectWithKey} from "../../helpers/utils";
import {NEW_ELEMENT_ID} from "../../helpers/constants";

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
        const partTypesToUse = partTypes ? partTypes.filter(partType => !(partType.delete || (partType.dummyKey === NEW_ELEMENT_ID))) : [];
        const newPartTypes = partTypes ? partTypes.filter(partType => (partType.dummyKey === NEW_ELEMENT_ID)) : [];
        let newPartTypeForDisplay = (newPartTypes.length > 0) ? newPartTypes[0] : NEW_PART_TYPE;
        return <table key={`partTypes_${sectionKey}`} className="full">
            <tbody>
            {partTypesToUse.map((partType) => {
                const componentKey = partType.id ? partType.id : partType.dummyKey;
                const className = partType.error ? "error" : "";
                const rowTitle = partType.error ? partType.error_detail : "";
                return (
                    <tr
                        key={`partType_${componentKey}`}
                        className={className}
                        title={rowTitle}
                    >
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
                    partType={newPartTypeForDisplay}
                    componentKey={NEW_ELEMENT_ID}
                    updatePartType={this.updatePartType}
                />
                <td/>
            </tr>
            </tbody>
        </table>;
    }
}

export default PartTypes;