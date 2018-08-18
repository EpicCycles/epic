import React from 'react'

import {Link, Redirect} from 'react-router-dom'

class Header extends React.Component {
    render() {
        const {user, isAuthenticated} = this.props;
        if (!(isAuthenticated)) {
            return <Redirect to='/login'/>
        }
        return (
            <div id="header">
                <ul className="nav">
                    <li className="dropdown">
                        <Link className="dropbtn" to="/">Home</Link>
                    </li>
                    <li className="dropdown">
                        <Link className="dropbtn" to="/about-us">About</Link>
                    </li>
                    <li className="dropdown">
                        <p className="dropbtn">Customer</p>
                        <div className="dropdown-content">
                            <div className="dropdown-section">Customer</div>
                            <Link className="dropbtn" to="/customer-search">Find Customer</Link>
                        </div>
                    </li>
                </ul>
                {(this.props.user && this.props.user.isAuthenticated) && <span id="user">{user.username}</span>}
            </div>

        )
    }
}

export default Header;