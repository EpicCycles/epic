import React, {Fragment} from "react";
import {Button} from "semantic-ui-react";
import FormTextAreaInput from "../../common/FormTextAreaInput";
import {supplierProductHeaders} from "./helpers/supplierProduct"

class SupplierProductUploadFile extends React.Component {
    state = {};

    goToNextStep = () => {
        const { uploadedData } = this.state;
        const rowMappings = this.props.buildInitialRowMappings(uploadedData);
        this.props.addDataAndProceed({ uploadedData, rowMappings });

    };

    handleFileChosen = (supplierProductUploadFile) => {
        let fileReader = new FileReader();
        fileReader.onloadend = () => {
            const fileContent = fileReader.result;
            let fileLines = fileContent.split(/\r?\n/);
            let uploadedData = [];
            fileLines.forEach(fileLine => uploadedData.push(fileLine.split(',')));
            if (uploadedData.length > 0) {
                uploadedData.shift(); // remove header row
                const usableData = uploadedData.filter(uploadRow => {
                    if (uploadRow[0].length === 0) return false;

                    const joinedData = uploadRow.join('');
                    return (joinedData.length > (uploadRow[0].length + 1));
                });
                this.setState({ uploadedData: usableData });
            }
        };
        fileReader.readAsText(supplierProductUploadFile);
    };
    processTextArea = (textInput) => {
        let partLines = textInput.split("\n");
        let uploadedData = [];
        let splitCharacter = "\t";
        partLines.forEach(partLine => uploadedData.push(partLine.split(splitCharacter)));
        if (uploadedData.length > 0) {
            this.setState({ uploadedData });
        }
    };
    clearUploadData = () => {
        this.setState({ uploadedData: [] });
    };

    render() {
        const { modelName, uploadedData } = this.state;
        const uploadData = (uploadedData && (uploadedData.length > 0));
        const uploadDisabled = false;
        return <Fragment key="supplierProductUploadFile">
            {(!uploadData) && <div key='supplierProductUploadInput' className="grid">
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
                            id='supplierProductUploadFile'
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
                        Paste a list of supplier products
                    </div>
                    <div className="grid-item--borderless">
                        <FormTextAreaInput
                            title="Paste list of supplier part types and values here"
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
                        key="supplierProductFileUploadCont"
                        onClick={this.goToNextStep}
                    >
                        Continue ...
                    </Button>
                    <Button
                        key="supplierProductFileUploadReset"
                        onClick={this.clearUploadData}
                    >
                        Clear data
                    </Button>
                </div>
                <div
                    key='supplierProductUploadGrid'
                    className="grid"
                    style={{
                        height: (window.innerHeight - 100) + "px",
                        width: (window.innerWidth - 50) + "px",
                        overflow: "scroll"
                    }}
                >
                    <div key="supplierProductUploadHeaders" className="grid-row grid-row--header">
                        {supplierProductHeaders.map((cell, index) => <div
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


export default SupplierProductUploadFile;