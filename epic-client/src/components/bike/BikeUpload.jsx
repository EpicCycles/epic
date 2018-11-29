import React from "react";
import BikeUploadFile from "./BikeUploadFile";
import BikeUploadMapping from "./BikeUploadMapping";
import BikeUploadParts from "./BikeUploadParts";
import BikeReview from "./BikeReview";

class BikeUpload extends React.Component {
    state = {
        step: 1
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