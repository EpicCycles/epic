import React, {Fragment} from "react";
import {Button, Icon} from "semantic-ui-react";
import {buildDataForApi} from "./helpers/bike";

class BikeUploadMappingReview extends React.Component {
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
    goToNextStep = () => {
        const { rowMappings } = this.state;
        const apiData = buildDataForApi(
            this.props.brand,
            this.props.frameName,
            rowMappings,
            this.props.uploadedHeaders,
            this.props.uploadedData,
            this.props.brands
        );
        this.props.addDataAndProceed({ rowMappings, apiData });
    };
    discardData = (rowIndex) => {
        const updatedRowMappings = this.state.rowMappings.map(rowMap => {
            if (rowMap.rowIndex === rowIndex) {
                rowMap.ignore = true;
            }
            return rowMap;
        });
        this.setState({ rowMappings: updatedRowMappings });
    };

    undoDiscardData = (rowIndex) => {
        const updatedRowMappings = this.state.rowMappings.map(rowMap => {
            if (rowMap.rowIndex === rowIndex) {
                rowMap.ignore = false;
            }
            return rowMap;
        });
        this.setState({ rowMappings: updatedRowMappings });
    };

    render() {
        const { rowMappings } = this.state;
        const { uploadedHeaders, uploadedData } = this.props;
        return <Fragment key="bikeUploadParts">
            <div>
                <Button
                    key="bikeFileUploadCont"
                    onClick={this.goToNextStep}
                >
                    Assign brands for Parts and Continue
                </Button>
            </div>
            <div
                key='bikeUploadGrid'
                className="grid"
                style={{
                    height: (window.innerHeight - 100) + "px",
                    width: (window.innerWidth - 50) + "px",
                    overflow: "scroll"
                }}
            >
                <div key="bikeUploadHeaders" className="grid-row grid-row--header">
                    {uploadedHeaders.map((cell, index) => <div
                        key={`col1${index}`}
                        className={(index === 0) ? "grid-item--header grid-header--fixed-left" : "grid-item--header"}
                    >
                        {cell}
                    </div>)}
                </div>
                {rowMappings.map((rowMapping) => <div key={`detailRow${rowMapping.rowIndex}`} className="grid-row">
                    {uploadedData[rowMapping.rowIndex].map((cell, index) => <div
                        className={`grid-item ${(index === 0) && "grid-item--fixed-left"} ${rowMapping.ignore && "discarded"}`}
                        key={`row${rowMapping.rowIndex}col${index}`}
                    >
                        <nobr>
                            {cell}
                            {((index === 0) && (rowMapping.ignore && (rowMapping.partType || rowMapping.bikeAttribute))) &&
                            <Icon id={`undoDelete-field${index}`} name="undo"
                                  onClick={() => this.undoDiscardData(rowMapping.rowIndex)}
                                  title="Discard data"/>}
                            {((index === 0) && !rowMapping.ignore) && <Icon id={`delete-field${index}`} name="trash"
                                                                            onClick={() => this.discardData(rowMapping.rowIndex)}
                                                                            title="Discard data"/>}
                        </nobr>
                    </div>)}
                </div>)}
            </div>
        </Fragment>;
    }
}


//
// };


export default BikeUploadMappingReview;