import React from "react";
import BikeUploadFile from "./BikeUploadFile";
import BikeUploadMapping from "./BikeUploadMapping";
import BikeUploadParts from "./BikeUploadParts";
import BikeReview from "./BikeReview";

class BikeUpload extends React.Component {
    state = {
        step: 1
    };

    componentDidMount() {
            this.getDataForUpload();
    };

    componentDidUpdate() {
        if (! this.props.isLoading) {
            this.getDataForUpload();
        }
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
            this.props.getBrands();
        } else if (frameworkRequired) {
            this.props.getFramework();
        }
    };
    addDataAndProceed = (dataForState) => {
        let nextStep = this.state.step + 1;
        let newState = Object.assign({}, this.state, dataForState, { step: nextStep });
        this.setState(newState);
    };


    render() {
        const { brands, sections } = this.props;
        const { brand, frameName, uploadedData } = this.state;
        switch (this.state.step) {
            case 1:
                return <BikeUploadFile
                    brand={brand}
                    frameName={frameName}
                    brands={brands}
                    addDataAndProceed={this.addDataAndProceed}
                />;
            case 2:
                return <BikeUploadMapping
                    brand={brand}
                    sections={sections}
                    frameName={frameName}
                    brands={brands}
                    uploadedData={uploadedData}
                    addDataAndProceed={this.addDataAndProceed}
                />;
            case 3:
                return <BikeUploadParts/>
            case 4:
                return <BikeReview/>
        }
    }
}


//
// };


export default BikeUpload;