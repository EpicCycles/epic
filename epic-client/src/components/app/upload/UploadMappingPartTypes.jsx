import React, {Fragment} from "react";
import {Button, Icon} from "semantic-ui-react";
import {UploadPartTypeMapping} from "./UploadPartTypeMapping";
import {NEW_ELEMENT_ID} from "../../../helpers/constants";
import PartTypeModal from "../../partType/PartTypeModal";
import {doesFieldMatchPartType, renumberAll} from "../../framework/helpers/framework";
import {generateRandomCode, removeKey, updateObject, updateObjectInArray} from "../../../helpers/utils";
import * as PropTypes from "prop-types";
import {getModelKey} from "../model/helpers/model";

class UploadMappingPartTypes extends React.Component {
    constructor(props) {
        super();
        this.state = this.deriveStateFromProps(props);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    };
    deriveStateFromProps = (props) => {
        const { rowMappings } = props;
        return {
            showModal: false,
            rowMappings
        };
    };

    goToNextStep = () => {
        const { rowMappings } = this.state;
        this.props.addDataAndProceed({ rowMappings });
    };

    allowDrop = (event) => {

        event.preventDefault();
        // Set the dropEffect to move
        event.dataTransfer.dropEffect = "move"
    };

    pickUpField = (event, rowIndex) => {
        // Add the target element's id to the data transfer object
        event.dataTransfer.setData("text/plain", rowIndex);
        event.dropEffect = "move";
    };

    assignToPartType = (event, partType) => {
        event.preventDefault();
        const rowIndex = event.dataTransfer.getData("text");
        this.updateMapping(rowIndex, partType);

    };
    updateMapping = (rowIndex, partType) => {
        const updatedRowMappings = this.state.rowMappings.map(rowMap => {
            // eslint-disable-next-line
            if (rowMap.rowIndex == rowIndex) {
                return updateObject(rowMap, { partType, ignore: false });
            } else {
                return rowMap
            }
        });
        this.setState({ rowMappings: updatedRowMappings });
    };
    undoMapping = (rowIndex) => {
        const updatedRowMappings = this.state.rowMappings.map(rowMap => {
            // eslint-disable-next-line
            if (rowMap.rowIndex == rowIndex) {
                let updatedRowMap = removeKey(rowMap, 'partType');
                updatedRowMap.ignore = false;
                return updatedRowMap;
            } else {
                return rowMap
            }
        });
        this.setState({ rowMappings: updatedRowMappings });
    };
    discardData = (rowIndex) => {
        const updatedRowMappings = this.state.rowMappings.map(rowMap => {
            // eslint-disable-next-line
            if (rowMap.rowIndex == rowIndex) {
                let updatedRowMap = removeKey(rowMap, 'partType');
                updatedRowMap.ignore = true;
                return updatedRowMap;
            } else {
                return rowMap
            }
        });
        this.setState({ rowMappings: updatedRowMappings });
    };

    undoDiscardData = (rowIndex) => {
        this.undoMapping(rowIndex);
    };

    setUpPartTypeModalForNewField = (rowMap) => {
        const partType = {
            name: rowMap.partTypeName,
            _detail: true
        };
        this.setState({
            partType,
            showModal:true,
        });
    };
    setUpPartTypeModalForPart = (sectionIndex, partTypeIndex) => {
        let partType = updateObject(this.props.sections[sectionIndex].partTypes[partTypeIndex]);
        this.state.rowMappings.forEach(rowMap => {
            // eslint-disable-next-line
            if (rowMap.partType == partType.id) {
                const checkField = rowMap.partTypeName.trim();
                if (! doesFieldMatchPartType(partType, checkField)) {
                    partType.synonyms.push({
                        name:checkField,
                        dummyKey: generateRandomCode()
                    });
                    partType.changed = true;
                }
            }
        });
        partType._detail = true;
        this.setState({
            partType,
            showModal:true,
        });
    };

    handleOpenModal() {
        // this.setState({ showModal: true, partType: {} });
    }
    handleCloseModal() {
        this.setState({ showModal: false, partType: {} });
    }
    savePartType = (partType) => {

        const updatedSections = this.props.sections.map(section => {
            // eslint-disable-next-line
            if (section.id == partType.includeInSection) {
                return updateObject(section, {partTypes: updateObjectInArray(section.partTypes, partType, getModelKey(partType))});
            }
            return section;
        });
        this.props.saveFramework(renumberAll(updatedSections));
    };
    render() {
        const { sections, multiplesAllowed } = this.props;
        const { rowMappings, showModal, partType } = this.state;
        const unResolvedRowMappings = rowMappings.filter(rowMapping => (!(rowMapping.partType || rowMapping.ignore)));
        const discardedRowMappings = rowMappings.filter(rowMapping => rowMapping.ignore);
        return <Fragment key="bikeUploadMapping">
            {showModal && <PartTypeModal
                partTypeModalOpen={showModal}
                partType={partType}
                componentKey={NEW_ELEMENT_ID}
                savePartType={this.savePartType}
                sections={sections}
                closePartTypeModal={this.handleCloseModal}
            />}
            <section key="mappingData" className="row" id="mappingData">
                {/* part type mapping*/}
                <div
                    key="partTypes"
                    className="grid"
                    style={{
                        height: (window.innerHeight * 0.8) + "px",
                        width: (window.innerWidth * 0.5) + "px",
                        overflow: "scroll"
                    }}
                >
                    <div className="grid-row grid-row--header ">
                        <div className="grid-item--header">
                            Section
                        </div>
                        <div className="grid-item--header">
                            Part Type
                        </div>
                        <div className="grid-item--header">
                            Upload field
                        </div>
                    </div>
                    <Fragment>
                        {sections.map((section, sectionIndex) => {
                            return section.partTypes.map((partType, partTypeIndex) => <UploadPartTypeMapping
                                key={`partList${partType.id}`}
                                partType={partType}
                                partTypeIndex={partTypeIndex}
                                allowDrop={this.allowDrop}
                                assignToPartType={this.assignToPartType}
                                section={section}
                                sectionIndex={sectionIndex}
                                rowMappings={rowMappings.filter(rowMapping => (rowMapping.partType === partType.id))}
                                undoMapping={this.undoMapping}
                                setUpPartTypeModalForPart={this.setUpPartTypeModalForPart}
                                multiplesAllowed={multiplesAllowed}
                            />)
                        })
                        }
                    </Fragment>
                </div>
                <div>
                            {unResolvedRowMappings.map((mapping, index) =>
                                <div key={`mapping${index}`}
                                     className="rounded"
                                     draggable={true}
                                     onDragStart={event => this.pickUpField(event, mapping.rowIndex)}
                                >
                                    {mapping.partTypeName}
                                    <Icon id={`delete-field${index}`} name="trash"
                                          onClick={() => this.discardData(mapping.rowIndex)}
                                          title="Discard data"/>
                                    <Icon id={`create{index}`} name="add circle"
                                          onClick={() =>this.setUpPartTypeModalForNewField(mapping)}
                                          title="Create Part Type to store data"/>
                                </div>
                            )}
                            {discardedRowMappings.map((mapping, index) =>
                                <div key={`discard${index}`}
                                     className="rounded discarded"
                                >
                                    {mapping.partTypeName}
                                    <Icon id={`restore-field${index}`} name="remove circle"
                                          onClick={() => this.undoDiscardData(mapping.rowIndex)}
                                          title="Do not Discard data"/>
                                </div>
                            )}
                        </div>

            </section>
            <div><Button
                key="bikeFileUploadCont"
                onClick={this.goToNextStep}
            >
                Continue ...
            </Button></div>
        </Fragment>;
    }
}
UploadMappingPartTypes.propTypes = {
    rowMappings: PropTypes.array.isRequired,
    sections: PropTypes.array.isRequired,
    multiplesAllowed: PropTypes.bool,
    saveFramework: PropTypes.any.isRequired,
    addDataAndProceed: PropTypes.func.isRequired,
};

export default UploadMappingPartTypes;