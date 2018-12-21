import React, {Fragment} from "react";
import BikeUploadFile from "./BikeUploadFile";
import BikeUploadMapping from "./BikeUploadMapping";
import BikeUploadParts from "./BikeUploadParts";
import BikeUploadReview from "./BikeUploadReview";
import BikeUploadFrame from "./BikeUploadFrame";
import BikeUploadMappingPartTypes from "./BikeUploadMappingPartTypes";
import {doesFieldMatchPartType} from "../../helpers/framework";
import {findObjectWithId} from "../../helpers/utils";
import BikeUploadMappingReview from "./BikeUploadMappingReview";
import {Button} from "semantic-ui-react";
import {colourStyles} from "../../helpers/constants";
import {bikeFields} from "../../helpers/models";

const uploadSteps = [
    {
        stepNumber: 1,
        description: "Upload File"
    },
    { stepNumber: 2, description: "Assign Part Types for upload data" },
    { stepNumber: 3, description: "Assign Bike level fields" },
    { stepNumber: 4, description: "Review mapping for all data" },
    { stepNumber: 5, description: "Review brands for parts to be created during upload" },
    { stepNumber: 6, description: "List Bikes created during upload" },
];
const initialState = {
    step: 0
};

class BikeUpload extends React.Component {
    state = initialState;

    componentDidMount() {
        this.getDataForUpload();
    };

    componentDidUpdate() {
        if (!this.props.isLoading) {
            this.getDataForUpload();
        }
    };

    onChangeField = (fieldName, fieldValue) => {
        let newState = this.state;
        newState[fieldName] = fieldValue;
        if (fieldName === "brand") {
            const selectedBrand = findObjectWithId(this.props.brands, fieldValue);
            if (selectedBrand) newState["brandName"] = selectedBrand.brand_name;
        }
        this.setState(newState);
    };
    getDataForUpload = () => {
        let brandsRequired = true;
        let frameworkRequired = true;
        if (this.props.brands && this.props.brands.length > 0) {
            brandsRequired = false;
        }
        if (this.props.sections && this.props.sections.length > 0) {
            frameworkRequired = false;
        }
        if (brandsRequired) {
            this.props.getBrandsAndSuppliers();
        } else if (frameworkRequired) {
            this.props.getFramework();
        }
    };
    addDataAndProceed = (dataForState) => {
        let nextStep = this.state.step + 1;

        let newState = Object.assign({}, this.state, dataForState, { step: nextStep });
        if ((nextStep < 3) && newState.rowMappings) {
            const unmappedFields = newState.rowMappings.filter(rowMapping => (Object.keys(rowMapping).length === 2))
            if (unmappedFields.length === 0) {
                newState.step = 3;
            }
        }
        this.setState(newState);
    };

    goToStep = (step) => {
        if (step < this.state.step) {
            let newState = Object.assign({}, { step: step });
            this.setState(newState);
        }
    };
    startAgain = () => {
        this.props.clearFrame();
        this.setState(initialState);
    };
    buildInitialRowMappings = (uploadedData) => {
        const { sections } = this.props;
        const rowMappings = uploadedData.map((row, rowIndex) => {
            const rowField = row[0].trim();
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
                        if (doesFieldMatchPartType(partType, rowFieldLower)) {
                            rowData.partType = partType.id;
                            return true;
                        }
                        return false;
                    });
                })
            }
            return rowData
        });
        return rowMappings;
    };

    render() {
        const { brands, suppliers, sections, saveBrands, saveFramework, uploadFrame, frame } = this.props;
        const { brand, brandName, frameName, step, rowMappings, uploadedHeaders, uploadedData, apiData } = this.state;
        return <Fragment key="bikeUpload">
            <h2>Bike Upload - {uploadSteps[step].description}</h2>
            {(step !== 1) && <BikeUploadFrame
                brands={brands}
                suppliers={suppliers}
                onChange={this.onChangeField}
                brandSelected={brand}
                frameName={frameName}
                brandName={brandName}
                displayOnly={(step > 0)}
                saveBrands={saveBrands}
            />}
            {(step === 0) && <BikeUploadFile
                brandName={brandName}
                frameName={frameName}
                brands={brands}
                buildInitialRowMappings={this.buildInitialRowMappings}
                addDataAndProceed={this.addDataAndProceed}
            />}
            {(step === 1) && <BikeUploadMappingPartTypes
                rowMappings={rowMappings}
                sections={sections}
                saveFramework={saveFramework}
                addDataAndProceed={this.addDataAndProceed}
            />}
            {(step === 2) && <BikeUploadMapping
                rowMappings={rowMappings}
                addDataAndProceed={this.addDataAndProceed}
            />}
            {(step === 3) && <BikeUploadMappingReview
                rowMappings={rowMappings}
                uploadedHeaders={uploadedHeaders}
                uploadedData={uploadedData}
                brands={brands}
                brand={brand}
                frameName={frameName}
                addDataAndProceed={this.addDataAndProceed}
            />}
            {(step === 4) && <BikeUploadParts
                apiData={apiData}
                brands={brands}
                sections={sections}
                addDataAndProceed={this.addDataAndProceed}
                saveBrands={saveBrands}
                recheckBrands={() => this.goToStep(3)}
                uploadFrame={uploadFrame}
            />}
            {(step === 5) && <BikeUploadReview
                sections={sections}
                brands={brands}
                frame={frame}
            />}
            <div className="full align_center">
                {(this.state.step < (uploadSteps.length - 1)) ? uploadSteps.map((stepDetails, stepIndex) => <Fragment>
                        {(colourStyles[stepIndex].transition) && <div
                            className={colourStyles[stepIndex].transition}
                            key={`transition${stepIndex}`}
                        />}
                        <div
                            key={`step${stepDetails.stepNumber}`}
                            className={`circle ${(stepIndex === step) ? " selected-circle" : " unselected-circle"} ${colourStyles[stepIndex].colour} ${colourStyles[stepIndex].background} ${colourStyles[stepIndex].border}`}
                            onClick={() => this.goToStep(stepIndex)}
                            disabled={!(stepIndex < this.state.step)}
                            title={stepDetails.description}
                        >
                            {stepDetails.stepNumber}
                        </div>
                    </Fragment>
                    )
                    :
                    <Button
                        key="startAgain"
                        onClick={this.startAgain}
                    >
                        Upload Another
                    </Button>
                }
            </div>
        </Fragment>
    }
}

export default BikeUpload;