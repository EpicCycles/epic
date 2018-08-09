// carry on from http://v1k45.com/blog/modern-django-part-4-adding-authentication-to-react-spa-using-drf/
import React, {Component} from "react";

class Login extends Component {

    state = {
        username: "",
        password: "",
    };

    onSubmit = e => {
        e.preventDefault();
        console.error("Not implemented!!1");
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <fieldset>
                    <legend>Login</legend>
                    <p>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text" id="username"
                            onChange={e => this.setState({username: e.target.value})}/>
                    </p>
                    <p>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password" id="password"
                            onChange={e => this.setState({password: e.target.value})}/>
                    </p>
                    <p>
                        <button type="submit">Login</button>
                    </p>

                    {/*<p>*/}
                    {/*Don't have an account? <Link to="/register">Register</Link>*/}
                    {/*</p>*/}
                </fieldset>
            </form>
        )
    }
}

// const mapStateToProps = state => {
//     return {};
// };
//
// const mapDispatchToProps = dispatch => {
//     return {};
// };
//
// export default connect(mapStateToProps, mapDispatchToProps)(Login);
export default Login;