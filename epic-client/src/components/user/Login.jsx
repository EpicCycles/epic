import React, {Fragment} from 'react'
import {Dimmer, Icon, Loader} from 'semantic-ui-react'
import {Redirect} from "react-router-dom";

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

    loginUser = () => {
        const { username, password } = this.state;
        this.props.loginUser(username, password);
    };
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const { username, password } = this.state;
            if (username && password) this.loginUser();
        }
    };

    render() {
        const { username, password } = this.state;
        const { isLoading, user } = this.props;

        return (
            <Fragment>
                {(user && user.username) ?
                    <Redirect to="/" push/>
                    :
                    <Fragment>
                        <h1>Login</h1>
                        <div id="loginUser" className="grid" style={{ height: "400px" }}>
                            <div className="grid-row">
                                <div className="grid-item--borderless field-label align_right">
                                    Username
                                </div>
                                <div
                                    className="grid-item--borderless"
                                >
                                    <input
                                        type="text" id="username"
                                        onKeyPress={this.handleKeyPress}
                                        onChange={e => this.setState({ username: e.target.value })}
                                    />
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
                                        onChange={e => this.setState({ password: e.target.value })}
                                        onKeyPress={this.handleKeyPress}
                                    />
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