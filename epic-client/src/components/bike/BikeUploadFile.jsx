import React, {Fragment} from "react";
import BrandSelect from "../brand/BrandSelect";
import FormTextInput from "../../common/FormTextInput";
import {Button} from "semantic-ui-react";

class BikeUploadFile extends React.Component {
    state = {};

    componentWillMount() {
        this.setState({
            brand: this.props.brand,
            frameName: this.props.frameName,
        });
    };

    onChangeField = (fieldName, fieldValue) => {
        let newState = this.state;
        newState[fieldName] = fieldValue;
        this.setState(newState);
    };
    goToNextStep = () => {
        const { brand, frameName, uploadedHeaders, uploadedData } = this.state;
        this.props.addDataAndProceed({ brand, frameName, uploadedHeaders, uploadedData });
    };

    handleFileChosen = (bikeUploadFile) => {
        let fileReader = new FileReader();
        fileReader.onloadend = () => {
            const fileContent = fileReader.result;
            // console.log(fileContent);
            let fileLines = fileContent.split("\n");
            let uploadedData = [];
            fileLines.forEach(fileLine => uploadedData.push(fileLine.split(',')));
            if (uploadedData.length > 0) {
                var uploadedHeaders = uploadedData.shift();
                this.setState({ uploadedHeaders, uploadedData });
            }
        };
        fileReader.readAsText(bikeUploadFile);
    };

    render() {
        const { brands } = this.props;
        const { brand, frameName, uploadedHeaders } = this.state;
        const uploadDisabled = false;
        // const uploadDisabled = !(brand && frameName);
        return <Fragment key="bikeUpload">
            <h2>Bike Upload</h2>
            <div key='bikeUploadInput' className="grid">
                <div className="grid-row">
                    <div className="grid-item--fixed-left label">
                        Bike Brand
                    </div>
                    <div className="grid-item">
                        <BrandSelect
                            brands={brands}
                            fieldName="brand"
                            onChange={this.onChangeField}
                            brandSelected={brand}
                        />
                    </div>
                </div>

                <div className="grid-row">
                    <div className="grid-item--fixed-left label">
                        Frame Name
                    </div>
                    <div className="grid-item">
                        <FormTextInput
                            id="frameName"
                            fieldName="frameName"
                            placeholder="Frame Name"
                            value={frameName}
                            onChange={this.onChangeField}
                            size={100}
                        />
                    </div>
                </div>
                {(!uploadedHeaders) && <div className="grid-row">
                    <div className="grid-item--fixed-left label">
                        Select file for upload
                    </div>
                    <div className="grid-item">
                        <input
                            type='file'
                            id='bikeUploadFile'
                            accept='.csv'
                            onChange={event => this.handleFileChosen(event.target.files[0])}
                            disabled={uploadDisabled}
                        />
                    </div>
                </div>}
            </div>
            {uploadedHeaders && <Button
                key="bikeFileUploadCont"
                onClick={this.goToNextStep}
            >
                Continue ...
            </Button>}
        </Fragment>;
    }
}



export default BikeUploadFile;