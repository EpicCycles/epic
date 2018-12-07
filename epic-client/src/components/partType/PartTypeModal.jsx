import React from "react";
import ReactModal from 'react-modal';

import * as PropTypes from "prop-types";
import PartTypeData from "./PartTypeData";
import {Icon} from "semantic-ui-react";
import {SECTION_MISSING} from "../../helpers/error";
import SelectInput from "../../common/SelectInput";
import {processPartTypeValueChanges} from "../../helpers/framework";

class PartTypeModal extends React.Component {
    constructor(props) {
        super();
        this.state = this.deriveStateFromProps(props);
    };
    deriveStateFromProps = (props) => {
        const {sections, partType} = props;
        const sectionOptions = sections.map(section => {
            return { name: section.name, value: section.id.toString() }
        });
        return {
            sectionOptions,
            partType: partType || {},
            mode: (partType && partType.id) ? "Edit" : "New",
        }
    };
    handlePartTypeValueChange = (fieldName, input) => {
        const updatedPartType = processPartTypeValueChanges(this.state.partType, this.state.componentKey, fieldName, input);
        if (fieldName.startsWith("includeInSection")) updatedPartType.includeInSection = input;
        if (!updatedPartType.includeInSection) {
            if (updatedPartType.error) {
                updatedPartType.error_detail = SECTION_MISSING + '.' + updatedPartType.error_detail;
            } else {
                updatedPartType.error = true;
                updatedPartType.error_detail = SECTION_MISSING;
            }
        }
        this.setState({ partType: updatedPartType });
    };
    onClickReset = () => {
        this.setState(this.deriveStateFromProps(this.props));
    };
    onAfterOpen = () => {
        this.setState(this.deriveStateFromProps(this.props));
    };

    saveOrCreatePartType = () => {
        this.props.savePartType(this.state.partType);
        this.props.closePartTypeModal();
    };
    deleteOrRemovePartType = () => {
        if (this.state.componentKey) {
            this.props.deletePartType(this.state.partType);
        }
        this.props.closePartTypeModal();
    };

    render() {
        const { partTypeModalOpen, componentKey, deletePartType, closePartTypeModal } = this.props;
        const { partType, mode, sectionOptions } = this.state;
        return <ReactModal
            isOpen={partTypeModalOpen}
            contentLabel={`${mode} Part Type`}
            className="Modal PartTypeModal"
            onAfterOpen={this.onAfterOpen}
        >
            <div style={{ width: "100%", textAlign: "right" }}>
                <Icon
                    name="remove"
                    circular
                    link
                    onClick={closePartTypeModal}
                />
            </div>
            {partTypeModalOpen && <div style={{ width: "100%", textAlign: "left" }}>
                <h2>{mode} Part Type</h2>
                {partType.error && <div className="red">{partType.error_detail}</div>}
                <div>
                    <SelectInput
                        className=""
                        title="Select Section"
                        label="Section"
                        fieldName="includeInSection"
                        onChange={this.handlePartTypeValueChange}
                        value={partType.includeInSection  && partType.includeInSection.toString()}
                        options={sectionOptions}
                        isEmptyAllowed={true}
                    />
                </div>
                <PartTypeData
                    partType={partType}
                    componentKey={componentKey}
                    handlePartTypeValueChange={this.handlePartTypeValueChange}
                />
            </div>}
            <div style={{ width: "100%", textAlign: "right" }}>
                {partType.changed &&
                <Icon id={`reset-partType`} name="undo"
                      onClick={this.onClickReset}
                      title="Reset PartType details"
                />
                }
                {(partType.changed && (!partType.error)) &&
                <Icon id={`accept-partType`} name="check"
                      onClick={this.saveOrCreatePartType}
                      title="Confirm PartType Change"/>
                }
                {(deletePartType && (partType.id || partType.changed)) &&
                <Icon id={`delete-partType`} name="trash"
                      onClick={this.deleteOrRemovePartType}
                      title="Delete PartType"/>
                }
            </div>
        </ReactModal>;
    }
}

PartTypeModal.propTypes = {
    partTypeModalOpen: PropTypes.any,
    partType: PropTypes.any,
    componentKey: PropTypes.any,
    savePartType: PropTypes.any,
    sections: PropTypes.any,
    closePartTypeModal: PropTypes.func,
    deletePartType: PropTypes.any,
};

export default PartTypeModal;