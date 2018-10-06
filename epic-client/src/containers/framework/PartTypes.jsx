import React, {Fragment} from "react";
import PartTypeEdit from "./PartTypeEdit";
import {
    moveObjectDownOnePlace,
    moveObjectToBottom,
    moveObjectToTop,
    moveObjectUpOnePlace
} from "../../helpers/framework";
import FrameworkMoves from "./FrameworkMoves";
import {findIndexOfObjectWithKey} from "../../helpers/utils";

class PartTypes extends React.Component {
    handlePartTypeChange = (partTypeKey, updatedPartType) => {
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
        return <ul key={`partTypes_${sectionKey}`}>
            {partTypesToUse.map((partType) => {
                const componentKey = partType.id ? partType.id : partType.dummyKey;
                return (
                <Fragment>
                    <PartTypeEdit
                        key={`partTypeEdit${componentKey}`}
                        partType={partType}
                        componentKey={componentKey}
                        updatePartType={this.handlePartTypeChange}
                    />
                    {partTypesToUse.length > 1 &&
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
            <PartTypeEdit
                key="partTypeEditNew"
                partType={{}}
                componentKey={"new"}
                updatePartType={this.handlePartTypeChange}
            />
        </ul>;
    }
}

export default PartTypes;