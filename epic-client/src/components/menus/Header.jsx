import React, {Fragment} from 'react'

import {Link, Redirect} from 'react-router-dom'

import ErrorDismissibleBlock from "../../common/ErrorDismissibleBlock";
import HeaderSection from "./HeaderSection";
import {menuStructure} from "./helpers/menu";
import {Icon} from "semantic-ui-react";

class Header extends React.Component {

    componentDidMount() {
        this.hydrateStateWithLocalStorage();

        // add event listener to save state to localStorage
        // when user leaves/refreshes the page
        window.addEventListener(
            "beforeunload",
            this.saveStateToLocalStorage.bind(this)
        );
    };

    componentWillUnmount() {
        window.removeEventListener(
            "beforeunload",
            this.saveStateToLocalStorage.bind(this)
        );

        // saves if component has a chance to unmount
        this.saveStateToLocalStorage();
    };

    hydrateStateWithLocalStorage = () => {
        const cookies = window.document.cookie.split(';');
        const userCookie = this.getCookie('epic_user');
        const tokenCookie = this.getCookie('epic_user_token');
        if (tokenCookie.length) {
            const user = JSON.parse(userCookie);
            const token = JSON.parse(tokenCookie);
            this.props.getStateFromLocalStorage(user, token);
        }
    };
    saveStateToLocalStorage = () => {
        if (this.props.user) {
            window.document.cookie = `epic_user=${JSON.stringify(this.props.user)};max-age=${60 * 60 * 24}`;
            window.document.cookie = `epic_user_token=${JSON.stringify(this.props.token)};max-age=${60 * 60 * 24}`;
        }
    };
    checkUserCookie = () => {
        return document.cookie.split(';').filter(item => item.trim().startsWith('epic_user=')).length;
    };
 getCookie= (cname) => {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};
    render() {
        const { user, application, removeMessage, logoutUser } = this.props;
        // const okToBeHere = user || window.location.pathname.startsWith('/login') || this.checkUserCookie();
        const okToBeHere = this.checkUserCookie();

        return <Fragment key="header">
            {(!okToBeHere) && <Redirect to="/login" push/>}

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
                    {(user) &&
                    <span id="user">
                        Current User: {user.first_name} {user.last_name} ({user.username})
                        <Icon
                            name="log out"
                            onClick={() => logoutUser()}
                        /></span>}
                </Fragment>
            </div>
            {(application && application.message) &&
            <ErrorDismissibleBlock application={application} removeMessage={removeMessage}/>
            }
        </Fragment>
    }
}

export default Header;