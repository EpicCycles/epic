import React, {Fragment} from "react";
import {bikeFields} from "../app/model/helpers/fields";
import {Button, Icon} from "semantic-ui-react";
import {BikeUploadFieldMapping} from "./BikeUploadFieldMapping";

class BikeUploadMapping extends React.Component {
    constructor(props) {
        super();
        this.state = this.deriveStateFromProps(props);
     };
    deriveStateFromProps = (props) => {
        const { rowMappings } = props;
        return {
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

    assignToBikeAttribute = (event, bikeAttribute) => {
        event.preventDefault();
        const rowIndex = event.dataTransfer.getData("text");
        const updatedRowMappings = this.state.rowMappings.map(rowMap => {
            // eslint-disable-next-line
            if (rowMap.rowIndex == rowIndex) {
                return {
                    rowIndex: rowMap.rowIndex,
                    partTypeName: rowMap.partTypeName,
                    bikeAttribute
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
                return { rowIndex: rowMap.rowIndex, partTypeName: rowMap.partTypeName };
            } else {
                return rowMap
            }
        });
        this.setState({ rowMappings: updatedRowMappings });
    };
    discardData = (rowIndex) => {
        const updatedRowMappings = this.state.rowMappings.map(rowMap => {
            if (rowMap.rowIndex === rowIndex) {
                return { rowIndex: rowMap.rowIndex, partTypeName: rowMap.partTypeName, ignore: true };
            } else {
                return rowMap
            }
        });
        this.setState({ rowMappings: updatedRowMappings });
    };

    undoDiscardData = (rowIndex) => {
        const updatedRowMappings = this.state.rowMappings.map(rowMap => {
            if (rowMap.rowIndex === rowIndex) {
                return { rowIndex: rowMap.rowIndex, partTypeName: rowMap.partTypeName };
            } else {
                return rowMap
            }
        });
        this.setState({ rowMappings: updatedRowMappings });
    };


    render() {
        const { rowMappings } = this.state;
        const unResolvedRowMappings = rowMappings.filter(rowMapping => (Object.keys(rowMapping).length === 2));
        const discardedRowMappings = rowMappings.filter(rowMapping => rowMapping.ignore);
        const continueDisabled = (unResolvedRowMappings.length > 0);
        return <Fragment key="bikeUploadMapping">
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
                                rowMappings={rowMappings.filter(rowMapping => (rowMapping.bikeAttribute === field.fieldName))}
                                undoMapping={this.undoMapping}
                            />
                        })
                        }
                    </Fragment>
                </div>

                <div key="unresolved" className="grid" style={{width:  (window.innerWidth * 0.3) + "px", height: (window.innerHeight - 400) + "px"}}>
                    <div className="grid-row grid-row--header ">
                        <h3>Unmatched fields</h3>

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
                        </div>
                    )}
                    </div>
                </div>
                <div key="discarded" className="grid" style={{height: (window.innerHeight - 400) + "px"}}>
                    <div className="grid-row grid-row--header ">
                        <h3>Discarded fields</h3>
                    {discardedRowMappings.map((mapping, index) =>
                        <div key={`discard${index}`}
                             className="rounded"
                        >
                            {mapping.partTypeName}
                            <Icon id={`restore-field${index}`} name="remove circle"
                                  onClick={() => this.undoDiscardData(mapping.rowIndex)}
                                  title="Do not Discard data"/>
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