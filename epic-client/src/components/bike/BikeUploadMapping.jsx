import React, {Fragment} from "react";
import BikeUploadFrame from "./BikeUploadFrame";
import {COLOURS_FIELD, fieldNameData, SELL_PRICE_FIELD, SIZES_FIELD} from "../../helpers/models";
import {Button, Icon} from "semantic-ui-react";
import {NEW_ELEMENT_ID} from "../../helpers/constants";

class BikeUploadMapping extends React.Component {
    state = {};

    componentWillMount() {
        const { brand, frameName, sections, uploadedData } = this.props;
        const rowMappings = uploadedData.map((row, rowIndex) => {
            const rowField = row[0];
            const rowFieldLower = rowField.toLowerCase();
            const rowData = { rowIndex, rowField };
            if (COLOURS_FIELD.synonyms.includes(rowFieldLower)) {
                rowData.bikeAttribute = COLOURS_FIELD.fieldName;
            } else if (SELL_PRICE_FIELD.synonyms.includes(rowFieldLower)) {
                rowData.bikeAttribute = SELL_PRICE_FIELD.fieldName;
            } else if (SIZES_FIELD.synonyms.includes(rowFieldLower)) {
                rowData.bikeAttribute = SIZES_FIELD.fieldName;
            } else {
                sections.forEach(section => {
                    section.partTypes.forEach(partType => {
                        if (partType.shortName.toLowerCase() === rowFieldLower) {
                            rowData.partType = partType.id;
                        } else {
                            partType.synonyms.forEach(synonym => {
                                if (synonym.shortName.toLowerCase() === rowFieldLower) {
                                    rowData.partType = partType.id;
                                }
                            });
                        }
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
            if (rowMap.rowIndex === rowIndex) {
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
            if (rowMap.rowIndex === rowIndex) {
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
                <div key="possibles" className="grid">
                    <div className="grid-row">
                        <div className="grid-item--borderless">
                            <h3>Bike fields</h3>
                        </div>
                    </div>
                    <div className="grid-row">
                        <div className="grid-item--borderless field-label align_right">
                            {COLOURS_FIELD.header}
                        </div>
                        <div
                            className="grid-item--borderless field-label align_right"
                            onDragOver={event => this.allowDrop(event)}
                            onDrop={event => this.assignToBikeAttribute(event, COLOURS_FIELD.fieldName)}
                        >
                            {rowMappings.filter(rowMapping => (rowMapping.bikeAttribute === COLOURS_FIELD.fieldName))
                                .map((matched, matchIndex) =>
                                    <div
                                        key={`match${matched.bikeAttribute}${matchIndex}`}
                                        className={(matchIndex > 1) ? "rounded-auto red" : "rounded-auto "}
                                    >
                                        {matched.rowField}
                                        <Icon
                                            key={`matchDelete$${matched.bikeAttribute}${matchIndex}`}
                                            name="delete"
                                            onClick={() => this.undoMapping(matched.rowIndex)}
                                        />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div key="unresolved" className="grid">
                    <div className="grid-row">
                        {unResolvedRowMappings.map((mapping, index)=>
                            <div  key={`mapping${index}`}
                            className="rounded"
                            draggable={true}
                            onDragStart={event => this.pickUpField(event, mapping.rowIndex)}
                            >
                                {mapping.rowField}
                            </div>
                        )}
                    </div>
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