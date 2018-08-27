import React, {Fragment} from 'react'

import {Link} from 'react-router-dom'

import ErrorDismissibleBlock from "../../common/ErrorDismissibleBlock";

class Header extends React.Component {
    render() {
        const { user } = this.props;

        return <Fragment key="header">
            <div className="row full nav">
                <Fragment key="nav">
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
                    {(this.props.user) &&
                    <span id="user"> Current User: {user.first_name} {user.last_name} ({user.username})</span>}
                </Fragment>
            </div>
            {(this.props.application && this.props.application.message) &&
            <ErrorDismissibleBlock application={this.props.application} removeMessage={this.props.removeMessage}/>
            }
        </Fragment>
    }
}

export default Header;