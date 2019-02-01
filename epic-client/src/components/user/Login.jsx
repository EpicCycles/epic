import React, {Fragment} from 'react'
import {Dimmer, Icon, Loader} from 'semantic-ui-react'

class Login extends React.Component {
    state = {
        username: "",
        password: "",
    };

    componentWillMount() {
        if (this.props.user) {
            this.setState({
                username: this.props.user.username
            });
        }
    }


    onUsernameChanged = input => {
        this.setState({ username: input });
    };

    onPasswordChanged = input => {
        this.setState({ lastName: input });
    };

    onClearUsername = () => {
        this.setState({ password: '' });
    };

    onClearPassword = () => {
        this.setState({ password: '' });
    };

    loginUser = () => {
        const { username, password } = this.state;
        this.props.loginUser(username, password);
    };

    render() {
        const { username, password } = this.state;
        const { isLoading, user, logoutUser } = this.props;

        return (
            <Fragment>
                {(user && user.username) ?
                    <div className="row">
                        Hi {user.first_name} {user.last_name}
                        <Icon
                            name="log out"
                            onClick={() => logoutUser()}
                        />
                    </div>
                    :
                    <Fragment>
                        <h1>Login</h1>
                        <div id="loginUser" className="grid" style={{height:"400px"}}>
                            <div className="grid-row">
                                <div className="grid-item--borderless field-label align_right">
                                    Username
                                </div>
                                <div
                                    className="grid-item--borderless"
                                >
                                    <input
                                        type="text" id="username"
                                        onChange={e => this.setState({ username: e.target.value })}/>
                                    {username &&
                                    <Icon
                                        name="remove"
                                        size="small"
                                        circular
                                        link
                                        onClick={e => this.setState({ username: "", password: "" })}
                                    />
                                    }
                                </div>
                            </div>
                            <div className="grid-row">

                                <div className="grid-item--borderless field-label align_right">
                                    Password
                                </div>
                                <div
                                    className="grid-item--borderless"
                                >
                                    <input
                                        type="password" id="password"
                                        onChange={e => this.setState({ password: e.target.value })}/>
                                    {password &&
                                    <Icon
                                        name="remove"
                                        size="small"
                                        circular
                                        link
                                        onClick={e => this.setState({ password: "" })}
                                    />
                                    }
                                </div>
                            </div>
                            <div className="grid-row">

                                <div className="grid-item--borderless field-label align_right">
                                    sign in
                                </div>
                                <div
                                    className="grid-item--borderless"
                                >
                                    <Icon
                                        name="sign in"
                                        onClick={() => this.loginUser()}
                                    />
                                </div>
                            </div>
                        </div>

                    </Fragment>
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

export default Login;