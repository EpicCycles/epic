import React, {Fragment} from "react";
import FormTextInput from "../../common/FormTextInput";
import {Button} from "semantic-ui-react";
import FormTextAreaInput from "../../common/FormTextAreaInput";

class BikeUploadFile extends React.Component {
    state = {};


    goToNextStep = () => {
        const { uploadedHeaders, uploadedData } = this.state;
        const rowMappings = this.props.buildInitialRowMappings(uploadedData);
        this.props.addDataAndProceed({ uploadedHeaders, uploadedData, rowMappings });

    };

    handleFileChosen = (bikeUploadFile) => {
        let fileReader = new FileReader();
        fileReader.onloadend = () => {
            const fileContent = fileReader.result;
            let fileLines = fileContent.split("\n");
            let uploadedData = [];
            fileLines.forEach(fileLine => uploadedData.push(fileLine.split(',')));
            if (uploadedData.length > 0) {
                const uploadedHeaders = uploadedData.shift();
                const usableData = uploadedData.filter(uploadRow => {
                    const joinedData = uploadRow.join('');
                    return (joinedData.length > (uploadRow[0].length + 1));
                });
                this.setState({ uploadedHeaders, uploadedData: usableData });
            }
        };
        fileReader.readAsText(bikeUploadFile);
    };
    processTextArea = (textInput) => {
        let partLines = textInput.split("#");
        let uploadedData = [];
        let uploadedHeaders = ["", this.state.modelName];
        let splitCharacter = "/t";
        partLines.forEach(partLine => uploadedData.push(partLine.split(splitCharacter)));
        if (uploadedData.length > 0) {
            if (uploadedData[0].length === 1) {
                // we have a table and not a list of pairs
                let uploadedPairs = [];
                let eachPair = [];
                uploadedData.forEach(uploadValue => {
                    if (uploadValue[0] !== "") {
                        eachPair.push(uploadValue[0]);
                        if (eachPair.length > 1) {
                            uploadedPairs.push(eachPair);
                            eachPair = [];
                        }
                    }
                });
                uploadedData = uploadedPairs;
            }
            this.setState({ uploadedHeaders, uploadedData });
        }
    };
    clearUploadData = () => {
        this.setState({ uploadedHeaders: [], uploadedData: [] });
    };

    render() {
        const { modelName, uploadedHeaders, uploadedData } = this.state;
        const { brandName, frameName } = this.props;
        const uploadData = (uploadedHeaders && (uploadedHeaders.length > 0));
        const uploadDisabled = false;
        const continueDisabled = ((!brandName) || (!frameName));
        return <Fragment key="bikeUploadFile">
            {(!uploadData) && <div key='bikeUploadInput' className="grid">
                <div className="grid-row">
                    <div className="grid-item--borderless field-label red align_right">
                        Either:
                    </div>
                    <div className="grid-item--borderless field-label">
                        Select file for upload
                    </div>
                    <div className="grid-item--borderless">
                        <input
                            type='file'
                            id='bikeUploadFile'
                            accept='.csv'
                            onChange={event => this.handleFileChosen(event.target.files[0])}
                            disabled={uploadDisabled}
                        />
                    </div>
                </div>
                <div className="grid-row">
                    <div className="grid-item--borderless field-label red align_right">
                        Or:
                    </div>
                    <div className="grid-item--borderless field-label">
                        Enter a model Name
                    </div>
                    <div className="grid-item--borderless">
                        <FormTextInput
                            id="modelName"
                            fieldName="modelName"
                            placeholder="Model Name"
                            value={modelName}
                            onChange={this.onChangeField}
                            size={100}
                        />
                    </div>
                </div>
                <div className="grid-row">
                    <div className="grid-item--borderless field-label red align_right">
                        and:
                    </div>
                    <div className="grid-item--borderless field-label">
                        Paste a list of parts
                    </div>
                    <div className="grid-item--borderless">
                        <FormTextAreaInput
                            title="Paste list of bike part types and values here"
                            placeholder={"e.g. Bars Deda 30cm"}
                            onChange={this.processTextArea}
                            disabled={!modelName}
                            rows={20}
                        />
                    </div>
                </div>
            </div>}
            {uploadData && <Fragment>
                <div>
                    <Button
                        key="bikeFileUploadCont"
                        onClick={this.goToNextStep}
                        disabled={continueDisabled}
                    >
                        Continue ...
                    </Button>
                    <Button
                        key="bikeFileUploadReset"
                        onClick={this.clearUploadData}
                    >
                        Clear data
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
                    {uploadedData.map((uploadedRow, rowIndex) => <div key={`detailRow${rowIndex}`} className="grid-row">
                        {uploadedRow.map((cell, index) => <div
                            className={(index === 0) ? "grid-item grid-item--fixed-left" : "grid-item"}
                            key={`row${rowIndex}col${index}`}
                        >
                            <nobr>{cell}</nobr>
                        </div>)}
                    </div>)}
                </div>
            </Fragment>}
        </Fragment>;
    }
}


export default BikeUploadFile;