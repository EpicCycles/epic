import React from "react";
import BikeUploadFile from "./BikeUploadFile";
import BikeUploadPartTypes from "./BikeUploadPartTypes";
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
        const { brands } = this.props;
        const { brand, frameName } = this.state;
        switch (this.state.step) {
            case 1:
                return <BikeUploadFile
                    brand={brand}
                    frameName={frameName}
                    brands={brands}
                    addDataAndProceed={this.addDataAndProceed}
                />
            case 2:
                return <BikeUploadPartTypes/>
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