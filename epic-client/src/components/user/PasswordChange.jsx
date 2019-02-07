import React, {Fragment} from 'react'
import * as PropTypes from "prop-types";

import {Dimmer, Icon, Loader} from 'semantic-ui-react'
import {updateObject} from "../../helpers/utils";

const initialState = {
    new_password1: "",
    new_password2: "",
    old_password: "",
};
const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
class PasswordChange extends React.Component {
    state = initialState;

    handleInputChange = (input) => {
        let newState = updateObject(this.state, input);
        this.setState(newState);
    };
    onClickReset = () => {
        this.setState(initialState);
    };
    saveChanges = () => {
        let errors = [];
        if (!this.state.old_password) errors.push("Old Password must be given.");
        if (!this.state.new_password1) errors.push("Please enter a new password.");
        if (this.state.new_password1 && !this.state.new_password2) errors.push("Please confirm the new password.");

        if (errors.length === 0 && !passwordPattern.test(this.state.new_password1)) errors.push("The new password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters")
        if (errors.length === 0 && (this.state.new_password1 !== this.state.new_password2)) errors.push("The new password fields do not match");

        if (errors.length === 0) this.props.changePassword(this.state);
        if (errors.length > 0) window.alert(errors.join(' '));
    };

    render() {
        const { old_password, new_password1, new_password2 } = this.state;
        const { isLoading, user } = this.props;

        return (
            <Fragment>
                {(user && user.username) ?
                    <Fragment>
                        <h1>Change password</h1>
                        <div id="changePassword" className="grid" style={{ height: "400px" }}>
                            <div className="grid-row">
                                <div className="grid-item--borderless field-label align_right">
                                    Current details:
                                </div>

                                <div className="grid-item--borderless">
                                    {user.first_name}{ }{user.last_name}
                                </div>
                            </div>
                          <div className="grid-row">
                                <div className="grid-item--borderless field-label align_right">
                                    Old Password
                                </div>

                                <div className="grid-item--borderless">
                                    <input
                                        type="password"
                                        id="old_password"
                                        value={old_password}
                                        required
                                        onChange={e => this.handleInputChange({ old_password: e.target.value })}
                                    />
                                    {old_password &&
                                    <Icon
                                        name="remove"
                                        size="small"
                                        circular
                                        link
                                        onClick={e => this.setState({ old_password: "" })}
                                    />
                                    }
                                </div>
                            </div>
                            <div className="grid-row">
                                <div className="grid-item--borderless field-label align_right">
                                    New Password
                                </div>

                                <div className="grid-item--borderless">
                                    <input
                                        type="password"
                                        id="new_password1"
                                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                                        required
                                        value={new_password1}
                                        onChange={e => this.handleInputChange({ new_password1: e.target.value })}
                                    />
                                    {new_password1 &&
                                    <Icon
                                        name="remove"
                                        size="small"
                                        circular
                                        link
                                        onClick={e => this.setState({ new_password1: "" })}
                                    />
                                    }
                                </div>
                            </div>
                            <div className="grid-row">
                                <div className="grid-item--borderless field-label align_right">
                                    *
                                </div>

                                <div className="grid-item--borderless">
                                    <input
                                        type="password"
                                        id="new_password2"
                                        required
                                        value={new_password2}
                                        onChange={e => this.handleInputChange({ new_password2: e.target.value })}
                                    />
                                    {new_password2 &&
                                    <Icon
                                        name="remove"
                                        size="small"
                                        circular
                                        link
                                        onClick={e => this.setState({ new_password2: "" })}
                                    />
                                    }
                                </div>
                            </div>
                            <div className="grid-row">

                                <div className="grid-item--borderless field-label align_right"/>
                                <div
                                    className="grid-item--borderless"
                                >
                                    <Icon id={`reset`} name="undo"
                                          onClick={this.onClickReset}
                                          title="Reset details"
                                    />

                                    <Icon id={`accept`} name="check"
                                          onClick={() => this.saveChanges()}
                                          title="Confirm Password Change"
                                    />
                                </div>
                            </div>
                        </div>
                        // title= <div id="message">
                            <h3>Password must contain the following:</h3>
                            <p id="letter" >A <b>lowercase</b> letter</p>
                            <p id="capital">A <b>capital (uppercase)</b> letter</p>
                            <p id="number">A <b>number</b></p>
                            <p id="length" >Minimum <b>8 characters</b></p>
                        </div>
                    </Fragment>
                    :
                    <div className="red error">You need to log in,</div>
                }
                {isLoading &&
                <Dimmer active inverted>
                    <Loader content='Loading'/>
                </Dimmer>
                }
            </Fragment>

        )
    }
}
PasswordChange.propTypes = {
    user: PropTypes.object,
    changePassword: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
}
export default PasswordChange;