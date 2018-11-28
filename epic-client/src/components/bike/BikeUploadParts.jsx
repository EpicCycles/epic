import React, {Fragment} from "react";
import BrandSelect from "../brand/BrandSelect";
import FormTextInput from "../../common/FormTextInput";
import {Button} from "semantic-ui-react";

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
        const { framework } = this.props;
        const { brand, frameName } = this.state;
        // const uploadDisabled = !(brand && frameName);
        return <Fragment key="bikeUploadPartTypes">
            <h2>Bike Upload - Assign Part Types</h2>
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