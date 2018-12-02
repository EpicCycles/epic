import React, {Fragment} from "react";
import BikeUploadFrame from "./BikeUploadFrame";
import {bikeFields} from "../../helpers/models";
import {Button} from "semantic-ui-react";
import {BikeUploadFieldMapping} from "./BikeUploadFieldMapping";
import {BikeUploadPartMapping} from "./BikeUploadPartMapping";

class BikeUploadMapping extends React.Component {
    state = {};

    componentWillMount() {
        const { brand, frameName, sections, uploadedData } = this.props;
        const rowMappings = uploadedData.map((row, rowIndex) => {
            const rowField = row[0];
            const rowFieldLower = rowField.toLowerCase();
            const rowData = { rowIndex, rowField };
            const matchingField = bikeFields.some(field => {
                if (field.synonyms.includes(rowFieldLower)) {
                    rowData.bikeAttribute = field.fieldName;
                    return true;
                }
                return false;
            });
            if (!matchingField) {
                sections.some(section => {
                    return section.partTypes.some(partType => {
                        if (partType.shortName.toLowerCase() === rowFieldLower) {
                            rowData.partType = partType.id;
                            return true;
                        } else {
                            partType.synonyms.forEach(synonym => {
                                if (synonym.shortName.toLowerCase() === rowFieldLower) {
                                    rowData.partType = partType.id;
                                    return true;
                                }
                            });
                        }
                        return false;
                    })
                })
            }
            return rowData
        });
        this.setState({
            brand,
            frameName,
            rowMappings
        });
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

    assignToBikeAttribute = (event, bikeAttribute) => {
        event.preventDefault();
        const rowIndex = event.dataTransfer.getData("text");
        const updatedRowMappings = this.state.rowMappings.map(rowMap => {
            // eslint-disable-next-line
            if (rowMap.rowIndex == rowIndex) {
                return {
                    rowIndex: rowMap.rowIndex,
                    rowField: rowMap.rowField,
                    bikeAttribute
                };
            } else {
                return rowMap
            }
        });
        this.setState({ rowMappings: updatedRowMappings });
    };
    assignToPartType = (event, partType) => {
        event.preventDefault();
        const rowIndex = event.dataTransfer.getData("text");
        const updatedRowMappings = this.state.rowMappings.map(rowMap => {
            // eslint-disable-next-line
            if (rowMap.rowIndex == rowIndex) {
                return {
                    rowIndex: rowMap.rowIndex,
                    rowField: rowMap.rowField,
                    partType
                };
            } else {
                return rowMap
            }
        });
        this.setState({ rowMappings: updatedRowMappings });
    };
    undoMapping = (rowIndex) => {
        const updatedRowMappings = this.state.rowMappings.map(rowMap => {
            if (rowMap.rowIndex === rowIndex) {
                return { rowIndex: rowMap.rowIndex, rowField: rowMap.rowField };
            } else {
                return rowMap
            }
        });
        this.setState({ rowMappings: updatedRowMappings });
    };

    render() {
        const { brands, sections } = this.props;
        const { brand, frameName, rowMappings } = this.state;
        const unResolvedRowMappings = rowMappings.filter(rowMapping => (Object.keys(rowMapping).length === 2));
        const continueDisabled = (unResolvedRowMappings.length > 0);
        return <Fragment key="bikeUploadMapping">
            <h2>Bike Upload - Map Upload Data</h2>
            <BikeUploadFrame
                brands={brands}
                onChange={this.onChangeField}
                brandSelected={brand}
                frameName={frameName}
                isEmptyAllowed={false}
            />
            <section key="mappingData" className="row" id="mappingData">
                {/*section 1 Bike mapping*/}
                <div key="bikeFields" className="grid">
                    <div className="grid-row">
                        <div className="grid-item--borderless">
                            <h3>Bike field</h3>
                        </div>
                        <div className="grid-item--borderless">
                            <h3>Upload field</h3>
                        </div>
                    </div>
                    <Fragment>
                        {bikeFields.map((field, index) => {
                            return <BikeUploadFieldMapping
                                key={`bikeFields${index}`}
                                field={field}
                                index={index}
                                allowDrop={this.allowDrop}
                                assignToBikeAttribute={this.assignToBikeAttribute}
                                rowMappings={rowMappings}
                                undoMapping={this.undoMapping}
                            />
                        })
                        }
                    </Fragment>
                </div>
                  {/*section 2 part type mapping*/}
                  <div key="partTypes" className="grid">
                    <div className="grid-row">
                        <div className="grid-item--borderless">
                            <h3>Bike field</h3>
                        </div>
                        <div className="grid-item--borderless">
                            <h3>Upload field</h3>
                        </div>
                    </div>   <Fragment>
                        {sections.map((section) => {
                            return section.partTypes.map((partType) => <BikeUploadPartMapping
                                key={`partList${partType.id}`}
                                partType={partType}
                                allowDrop={this.allowDrop}
                                assignToPartType={this.assignToPartType}
                                rowMappings={rowMappings}
                            />)
                        })
                        }
                    </Fragment>
                </div>
                <div key="unresolved">
                    <h3>Unmatched fields</h3>
                    {unResolvedRowMappings.map((mapping, index) =>
                        <div key={`mapping${index}`}
                             className="rounded"
                             draggable={true}
                             onDragStart={event => this.pickUpField(event, mapping.rowIndex)}
                        >
                            {mapping.rowField}
                        </div>
                    )}
                </div>
            </section>
            <div><Button
                key="bikeFileUploadCont"
                onClick={this.goToNextStep}
                disabled={continueDisabled}
            >
                Continue ...
            </Button></div>
        </Fragment>;
    }
}


export default BikeUploadMapping;