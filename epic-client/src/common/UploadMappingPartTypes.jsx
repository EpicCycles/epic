import React, {Fragment} from "react";
import {Button, Icon} from "semantic-ui-react";
import {UploadPartTypeMapping} from "./UploadPartTypeMapping";
import {NEW_ELEMENT_ID} from "../helpers/constants";
import PartTypeModal from "../components/partType/PartTypeModal";
import {doesFieldMatchPartType, renumberAll} from "../helpers/framework";
import {generateRandomCode, removeKey} from "../helpers/utils";

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

    onChangeField = (fieldName, fieldValue) => {
        let newState = this.state;
        newState[fieldName] = fieldValue;
        this.setState(newState);
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
        const updatedRowMappings = this.state.rowMappings.map(rowMap => {
            // eslint-disable-next-line
            if (rowMap.rowIndex == rowIndex) {
                return Object.assign({}, rowMap, { partType, ignore: false });
            } else {
                return rowMap
            }
        });
        this.setState({ rowMappings: updatedRowMappings });
    };
    undoMapping = (rowIndex) => {
        const updatedRowMappings = this.state.rowMappings.map(rowMap => {
            if (rowMap.rowIndex === rowIndex) {
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
            if (rowMap.rowIndex === rowIndex) {
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
        const updatedRowMappings = this.state.rowMappings.map(rowMap => {
            if (rowMap.rowIndex === rowIndex) {
                let updatedRowMap = removeKey(rowMap, 'partType');
                updatedRowMap.ignore = false;
                return updatedRowMap;
            } else {
                return rowMap
            }
        });
        this.setState({ rowMappings: updatedRowMappings });
    };

    setUpPartTypeModalForNewField = (rowMap) => {
        const partType = {
            shortName: rowMap.partTypeName,
            _detail: true
        };
        this.setState({
            partType,
            showModal:true,
        });
    };
    setUpPartTypeModalForPart = (sectionIndex, partTypeIndex) => {
        let partType = Object.assign({}, this.props.sections[sectionIndex].partTypes[partTypeIndex]);
        this.state.rowMappings.forEach(rowMap => {
            // eslint-disable-next-line
            if (rowMap.partType == partType.id) {
                const checkField = rowMap.partTypeName.trim();
                if (! doesFieldMatchPartType(partType, checkField)) {
                    partType.synonyms.push({
                        shortName:checkField,
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
                if (!partType.id) {
                    section.partTypes.push(partType);
                } else {
                    section.partTypes = section.partTypes.map(existingPartType => {
                        if (partType.id === existingPartType.id) {
                            return Object.assign({}, existingPartType, partType);
                        } else {
                            return existingPartType;
                        }
                    })
                }
            }
            return section;
        });
        this.props.saveFramework(renumberAll(updatedSections));
    };
    render() {
        const { sections, multiplesAllowed } = this.props;
        const { rowMappings, showModal, partType } = this.state;
        const unResolvedRowMappings = rowMappings.filter(rowMapping => (!rowMapping.partType));
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


export default UploadMappingPartTypes;