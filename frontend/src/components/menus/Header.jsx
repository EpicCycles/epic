import React, {Fragment} from 'react'

import {Link} from 'react-router-dom'
import { Redirect} from 'react-router'

import ErrorDismissibleBlock from "../../common/ErrorDismissibleBlock";
import HeaderSection from "./HeaderSection";
import {menuStructure} from "./helpers/menu";
import {Icon} from "semantic-ui-react";
import {getLocalStorage, setLocalStorage} from "../../state/helpers/localStorage";
import {createCookie, deleteCookie, getCookieObject} from "../../state/helpers/cookies";
import {
    COOKIE_TOKEN,
    COOKIE_USER, STORAGE_BRANDS,
    STORAGE_PARTS,
    STORAGE_SECTIONS,
    STORAGE_SUPPLIER_PRODUCTS, STORAGE_SUPPLIERS
} from "../../helpers/constants";
import {userName} from "../user/helpers/user";

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
        const user = getCookieObject(COOKIE_USER);
        const token = getCookieObject(COOKIE_TOKEN);

        if (token && user) {
            this.props.setStateFromLocalStorage(user, token);
            this.props.getUsers();

            const brands = getLocalStorage(STORAGE_BRANDS);
            const suppliers = getLocalStorage(STORAGE_SUPPLIERS);
            if (brands && suppliers) {
                this.props.getBrandsAndSuppliersSuccess(brands, suppliers);
            } else {
                this.props.getBrandsAndSuppliers();
            }
            const sections = getLocalStorage(STORAGE_SECTIONS);
            if (sections) {
                this.props.getFrameworkSuccess(sections);
            } else {
                this.props.getFramework();
            }

            const parts = getLocalStorage(STORAGE_PARTS);
            const supplierProducts = getLocalStorage(STORAGE_SUPPLIER_PRODUCTS);
            if (parts && supplierProducts) {
                this.props.listPartsOK({ parts, supplierProducts });
            } else {
                this.props.listParts({});
            }
        }
    };
    saveStateToLocalStorage = () => {
        if (this.props.user) {
            createCookie(COOKIE_USER, this.props.user);
            createCookie(COOKIE_TOKEN, this.props.token);

            setLocalStorage(STORAGE_PARTS, this.props.parts);
            setLocalStorage(STORAGE_SUPPLIER_PRODUCTS, this.props.supplierProducts);
            setLocalStorage(STORAGE_SECTIONS, this.props.sections);
            setLocalStorage(STORAGE_SUPPLIERS, this.props.suppliers);
            setLocalStorage(STORAGE_BRANDS, this.props.brands);
        }
    };

    logoutUser = () => {
        deleteCookie(COOKIE_USER);
        deleteCookie(COOKIE_TOKEN);
        this.props.logoutUser();
    };

    render() {
        const { user, application, removeMessage } = this.props;
        const okToBeHere = user || window.location.pathname.startsWith('/login') || getCookieObject(COOKIE_USER);

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
                        Current User: {userName(user)}
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