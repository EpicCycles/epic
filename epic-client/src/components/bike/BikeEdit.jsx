import React, {Fragment} from "react";
import * as PropTypes from "prop-types";

import {getUpdatedObject, isItAnObject, updateObject} from "../../helpers/utils";
import {addFieldToState} from "../app/model/helpers/model";
import {bikeFields} from "../app/model/helpers/fields";
import {validateData} from "../app/model/helpers/validators";
import {Icon} from "semantic-ui-react";
import EditModelPage from "../app/model/EditModelPage";
import {bikeFullName} from "./helpers/bike_helpers";

class BikeEdit extends React.Component {
    state = {};

    componentWillMount() {
        this.setState(this.deriveStateFromProps());
    };


    deriveStateFromProps = () => {
        let newState = updateObject(this.props.bike)
        return newState;
    };

    handleInputChange = (fieldName, input) => {
        let newState = addFieldToState(this.state, bikeFields, fieldName, input);

        if (this.checkForChanges(newState)) {
            newState.errors = validateData(bikeFields, newState);
        }

        this.checkBikeDataList(newState);
        this.setState(newState);
    };

    onClickReset = () => {
        const resetState = this.deriveStateFromProps();
        this.setState(resetState);
        this.checkBikeDataList(resetState);
    };

    saveOrCreateBike = () => {
        const updatedBike = getUpdatedObject(bikeFields, this.props.bike, this.state);
        this.props.saveBike(updatedBike);
        if (this.props.closeModal) {
            this.props.closeModal();
        }
    };
    deleteOrRemoveBike = () => {
        if (this.state.id) {
            this.props.deleteBike(this.state.id);
        }
        this.setState({});
        if (this.props.closeModal) {
            this.props.closeModal();
        }
    };

    render() {
        const { bike, brands, frames } = this.props;
        const {changed} = this.state;

        return <Fragment>
            <h3>{bikeFullName(bike, frames, brands)}</h3>
            <EditModelPage
                model={this.state}
                modelFields={bikeFields}
                onChange={this.handleInputChange}
                persistedModel={bike}
            />
            <div style={{ width: "100%", textAlign: "right" }}>
                {changed &&
                <Icon id={`reset-bike`} name="undo"
                      onClick={this.onClickReset}
                      title="Reset Bike details"
                />
                }
                {(isChanged && !isItAnObject(errors)) &&
                <Icon id={`accept-bike`} name="check"
                      onClick={this.saveOrCreateBike}
                      title="Confirm Bike Change"
                />
                }
                {deleteBike &&
                <Icon id={`delete-bike`} name="trash"
                      onClick={this.deleteOrRemoveBike}
                      title="Delete Bike"
                />
                }
            </div>
        </Fragment>;
    }
}
BikeEdit.propTypes = {
    bike: PropTypes.object.isRequired,
    brands: PropTypes.array.isRequired,
    frames: PropTypes.array.isRequired,
    saveBike: PropTypes.func.isRequired,
    deleteBike: PropTypes.func.isRequired,
};
export default BikeEdit;