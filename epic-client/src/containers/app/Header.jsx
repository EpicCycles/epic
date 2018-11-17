import React, {Fragment} from 'react'

import {Link} from 'react-router-dom'

import ErrorDismissibleBlock from "../../common/ErrorDismissibleBlock";
import {menuStructure} from "../../helpers/constants";
import HeaderSection from "./HeaderSection";

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
                        {menuStructure.map(menuSection => {
                            return <HeaderSection
                            key={'headerSection' + menuSection.sectionPos}
                                sectionContents={menuSection.sectionContents}
                            />
                        })}

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