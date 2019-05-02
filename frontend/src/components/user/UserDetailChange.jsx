import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import {updateObject} from "../../helpers/utils";
import {hasErrors, updateModel} from "../app/model/helpers/model";
import { userFields} from "../app/model/helpers/fields";
import EditModelPage from "../app/model/EditModelPage";
import {Dimmer, Icon, Loader} from "semantic-ui-react";

class UserDetailChange  extends React.Component {
    constructor(props) {
        super();
        const user = props.user ? props.user.user : {};
        this.state = updateObject(user);
    };

    onClickReset = () => {
        this.setState(updateObject(this.props.user));
    };
    handleUserValueChange = (fieldName, input) => {
        const updatedState = updateModel(this.state, userFields, fieldName, input);
        this.setState(updatedState);
    };
    saveChanges = () => {
        this.props.changeUserData(this.state);
    };

    render() {
        const {user, isLoading} = this.props;
        if (!(user && user.username)) return <div className="red error">You need to log in,</div>;

        const errors = hasErrors(this.state);
        const hasChanges = this.state.changed;
        return <Fragment>
            <div style={{ width: "100%", textAlign: "left" }}>
                <h2>Update User Details</h2>
                <EditModelPage
                    model={this.state}
                    persistedModel={user}
                    modelFields={userFields}
                    onChange={this.handleUserValueChange}
                />
            </div>
            <div style={{ width: "100%", textAlign: "right" }}>
                {hasChanges &&
                <Icon
                    id={`reset-user`}
                    name="undo"
                    onClick={this.onClickReset}
                    title="Reset User details"
                />
                }
                {(hasChanges && (!errors)) &&
                <Icon
                    id={`accept-changes`}
                    name="check"
                    onClick={this.saveChanges}
                    title="Confirm Changes"
                />
                }
            </div>
            {isLoading &&
            <Dimmer active inverted>
                <Loader content='Loading'/>
            </Dimmer>
            }
        </Fragment>
    }
}

UserDetailChange.propTypes = {
    user: PropTypes.object,
    changeUserData: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

export default UserDetailChange;