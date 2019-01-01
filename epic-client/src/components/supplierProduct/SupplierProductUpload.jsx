import React, {Fragment} from "react";
import SupplierProductUploadFile from "./SupplierProductUploadFile";
import {doesFieldMatchPartType} from "../../helpers/framework";
import {Button} from "semantic-ui-react";
import {colourStyles} from "../../helpers/constants";
import UploadMappingPartTypes from "../../common/UploadMappingPartTypes";
import UploadMappingSuppliers from "../../common/UploadMappingSuppliers";
import {buildSupplierProductForApi} from "../../helpers/part_helper";
import BrandPrompt from "../brand/BrandPrompt";
import SupplierProductUploadReview from "./SupplierProductUploadReview";

const uploadSteps = [
    {
        stepDescriptor: "File",
        description: "Upload File"
    },
    { stepDescriptor: "Part Types", description: "Assign Part Types for upload data" },
    { stepDescriptor: "Suppliers", description: "Assign Suppliers for upload data" },
    { stepDescriptor: "Brands", description: "Add missing brands" },
    { stepDescriptor: "Review", description: "Review data for parts to be created during upload" },
];
const initialState = {
    step: 0
};

class SupplierProductUpload extends React.Component {
    state = initialState;

    componentDidMount() {
        this.getDataForUpload();
    };

    componentDidUpdate() {
        if (!this.props.isLoading) {
            this.getDataForUpload();
            if (this.props.brands !== prevProps.brands) {
                // have added a brand - check whether we have all brands

            }
        }

    };

    onChangeField = (fieldName, fieldValue) => {
        let newState = this.state;
        newState[fieldName] = fieldValue;

        this.setState(newState);
    };
    getDataForUpload = () => {
        let sectionsRequired = true;
        let frameworkRequired = true;
        if (this.props.sections && this.props.sections.length > 0) {
            sectionsRequired = false;
        }
        if (this.props.sections && this.props.sections.length > 0) {
            frameworkRequired = false;
        }
        if (sectionsRequired) {
            this.props.getBrandsAndSuppliers();
        } else if (frameworkRequired) {
            this.props.getFramework();
        }
    };
    addDataAndProceed = (dataForState) => {
        let nextStep = this.state.step + 1;

        let newState = Object.assign({}, this.state, dataForState, { step: nextStep });
        if (newState.rowMappings) {

            const missingPartType = newState.rowMappings.some(rowMapping => (!rowMapping.partType && !rowMapping.ignore));
            const missingSupplier = newState.rowMappings.some(rowMapping => (!rowMapping.supplier && !rowMapping.ignore));
            if (missingPartType) {
                newState.step = 1;
            } else if (missingSupplier) {
                newState.step = 2;
            } else {
                newState.step = 3;
                newState.apiData = buildSupplierProductForApi(newState.rowMappings, newState.uploadedData, this.props.brands);
                if (newState.apiData.updatedBrands) this.props.saveBrands(newState.apiData.updatedBrands);
                if (newState.apiData.partsMissingBrands.length === 0) newState.step = 4;
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
        this.props.clearParts();
        this.setState(initialState);
    };
    buildInitialRowMappings = (uploadedData) => {
        const { sections, suppliers } = this.props;
        return uploadedData.map((row, rowIndex) => {
            const partTypeName = row[0].trim();
            const partTypeNameLower = partTypeName.toLowerCase();
            const supplierName = row[1].trim();
            const supplierNameLower = supplierName.toLowerCase();
            const rowData = { rowIndex, partTypeName, supplierName };

            sections.some(section => {
                return section.partTypes.some(partType => {
                    if (doesFieldMatchPartType(partType, partTypeNameLower)) {
                        rowData.partType = partType.id;
                        return true;
                    }
                    return false;
                });
            });

            suppliers.some(supplier => {
                if (supplier.supplier_name.toLowerCase() === supplierNameLower) {
                    rowData.supplier = supplier.id;
                    return true;
                }
                return false;
            });
            return rowData
        });
    };

    render() {
        const { sections, suppliers, brands, saveSections, saveFramework, saveSupplier, uploadParts, saveBrands } = this.props;
        const { step, rowMappings, uploadedData, apiData } = this.state;
        return <Fragment key="supplierProductUpload">
            <h2>Supplier Product Upload - {uploadSteps[step].description}</h2>
            {(step === 0) && <SupplierProductUploadFile
                buildInitialRowMappings={this.buildInitialRowMappings}
                addDataAndProceed={this.addDataAndProceed}
            />}
            {(step === 1) && <UploadMappingPartTypes
                rowMappings={rowMappings}
                sections={sections}
                saveFramework={saveFramework}
                addDataAndProceed={this.addDataAndProceed}
            />}
            {(step === 2) && <UploadMappingSuppliers
                rowMappings={rowMappings}
                suppliers={suppliers}
                saveSupplier={saveSupplier}
                addDataAndProceed={this.addDataAndProceed}
            />}
            {(step === 3) && <BrandPrompt
                brands={brands}
                productDescriptions={apiData.partsMissingBrands}
                saveBrands={saveBrands}
            />}
            {(step === 4) && <SupplierProductUploadReview
                apiData={apiData}
                brands={brands}
                sections={sections}
                suppliers={suppliers}
                uploadParts={uploadParts}
            />}
            <div className="full align_center">
                {(this.state.step < (uploadSteps.length - 1)) ? uploadSteps.map((stepDetails, stepIndex) => <Fragment>
                        {(colourStyles[stepIndex].transition) && <div
                            className={colourStyles[stepIndex].transition}
                            key={`transition${stepIndex}`}
                        />}
                        <div
                            key={`step${stepDetails.stepDescriptor}`}
                            className={`circle ${(stepIndex === step) ? " selected-circle" : " unselected-circle"} ${colourStyles[stepIndex].colour} ${colourStyles[stepIndex].background} ${colourStyles[stepIndex].border}`}
                            onClick={() => this.goToStep(stepIndex)}
                            disabled={!(stepIndex < this.state.step)}
                            title={stepDetails.description}
                        >
                            {stepDetails.stepDescriptor}
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

export default SupplierProductUpload;