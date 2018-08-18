import React from 'react'
import {Button, Dimmer, Icon, Loader} from 'semantic-ui-react'
import ErrorDismissibleBlock from "../../common/ErrorDismissibleBlock";

class UserLogin extends React.Component {
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
        this.setState({username: input});
    };

    onPasswordChanged = input => {
        this.setState({lastName: input});
    };

    onClearUsername = () => {
        this.setState({password: ''});
    };

    onClearPassword = () => {
        this.setState({password: ''});
    };

    onSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const {username, password} = this.state;
        console.log('about to log in user for name', username, ' and password ', password);
        this.props.loginUser(username, password);
    };

    render() {
        const {username, password} = this.state;
        const {isLoading, user, error, removeUserError} = this.props;

        return (
            <section id="loginUser">
                <form onSubmit={this.onSubmit}>
                    <h1>Login</h1>
                    {(user && user.username) &&
                    <div className="row">Hi {user.first_name} {user.last_name}</div>
                    }
                    {error &&
                    <ErrorDismissibleBlock error={error} removeError={removeUserError}/>
                    }
                    <div className="row">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text" id="username"
                            onChange={e => this.setState({username: e.target.value})}/>
                        {username &&
                        <Icon
                            name="remove"
                            size="small"
                            circular
                            link
                            onClick={e => this.setState({username: "", password: ""})}
                        />
                        }
                    </div>
                    <div className="row">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password" id="password"
                            onChange={e => this.setState({password: e.target.value})}/>
                        {password &&
                        <Icon
                            name="remove"
                            size="small"
                            circular
                            link
                            onClick={e => this.setState({password: ""})}
                        />
                        }
                    </div>
                    <Button type="submit" disabled={(isLoading || !(username && password))}>Login</Button>
                </form>
                {isLoading &&
                <Dimmer active inverted>
                    <Loader content='Loading'/>
                </Dimmer>
                }
            </section>

        )
    }
}

export default UserLogin;