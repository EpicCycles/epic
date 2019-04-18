import React, {Fragment} from 'react'

import {Link, Redirect} from 'react-router-dom'

import ErrorDismissibleBlock from "../../common/ErrorDismissibleBlock";
import HeaderSection from "./HeaderSection";
import {menuStructure} from "./helpers/menu";
import {Icon} from "semantic-ui-react";
import {getLocalStorage, setLocalStorage} from "../../state/helpers/localStorage";
import {deleteCookie, getCookie} from "../../state/helpers/cookies";

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
        const userCookie = getCookie('epic_user');
        const tokenCookie = getCookie('epic_user_token');

        if (tokenCookie && userCookie) {
            const user = JSON.parse(userCookie);
            const token = JSON.parse(tokenCookie);
            this.props.setStateFromLocalStorage(user, token);

            const brands = getLocalStorage('epic_brands');
            const suppliers = getLocalStorage('epic_suppliers');
            if (brands && suppliers) {
                this.props.getBrandsAndSuppliersSuccess(brands, suppliers);
            } else {
                this.props.getBrandsAndSuppliers();
            }
            const sections = getLocalStorage('epic_sections');
            if (sections) {
                this.props.getFrameworkSuccess(sections);
            } else {
                this.props.getFramework();
            }

            const parts = getLocalStorage('epic_parts');
            const supplierProducts = getLocalStorage('epic_supplierProducts');
            if (parts && supplierProducts) {
                this.props.listPartsOK({ parts, supplierProducts });
            } else {
                this.props.listParts({});
            }
        }
    };
    saveStateToLocalStorage = () => {
        if (this.props.user) {
            window.document.cookie = `epic_user=${JSON.stringify(this.props.user)};max-age=${60 * 60}`;
            window.document.cookie = `epic_user_token=${JSON.stringify(this.props.token)};max-age=${60 * 60}`;

            setLocalStorage('epic_parts', this.props.parts);
            setLocalStorage('epic_supplierProducts', this.props.supplierProducts);
            setLocalStorage('epic_sections', this.props.sections);
            setLocalStorage('epic_suppliers', this.props.suppliers);
            setLocalStorage('epic_brands', this.props.brands);
        }
    };

    logoutUser = () => {
        deleteCookie('epic_user');
        deleteCookie('epic_user_token');
        this.props.logoutUser();
    };

    render() {
        const { user, application, removeMessage, logoutUser } = this.props;
        const okToBeHere = user || window.location.pathname.startsWith('/login') || getCookie('epic_user');

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
                            onClick={this.logoutUser}
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