import React, {Fragment} from "react";
import {Button} from "semantic-ui-react";
import BikeUploadFrame from "./BikeUploadFrame";

class BikeUploadParts extends React.Component {
    state = {};

    componentWillMount() {
        // todo add some way of getting part types etc
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
        const {  } = this.state;
        this.props.addDataAndProceed({  });
    };

    render() {
        const { brands } = this.props;
        const { brand, frameName } = this.state;
        // const uploadDisabled = !(brand && frameName);
        return <Fragment key="bikeUploadPartTypes">
            <h2>Bike Upload - Find Parts</h2>
             <h2>Bike Upload</h2>
            <BikeUploadFrame
                brands={brands}
                onChange={this.onChangeField}
                brandSelected={brand}
                frameName={frameName}
                isEmptyAllowed={true}
            />
            <Button
                key="bikeFileUploadCont"
                onClick={this.goToNextStep}
            >
                Continue ...
            </Button>
        </Fragment>;
    }
}


//
// };


export default BikeUploadParts;