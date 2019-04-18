import {connect} from "react-redux";
import Header from "../../components/menus/Header";
import {removeMessage, saveStateToLocalStorage, setStateFromLocalStorage} from "../../state/actions/application";
import {logoutUser} from "../../state/actions/user";
import {getBrandsAndSuppliers, getBrandsAndSuppliersSuccess} from "../../state/actions/core";
import {listParts, listPartsOK} from "../../state/actions/part";
import {getFramework, getFrameworkSuccess} from "../../state/actions/framework";

const mapStateToProps = ({ user, application, core, part, framework }) => {
    const { brands, suppliers } = core;
    const { parts, supplierParts } = part;
    const { sections } = framework;
    return {
        user: user.user,
        token: user.token,
        application,
        brands, suppliers,
        parts, supplierParts,
        sections,
    }
};
const mapDispatchToProps = {
    removeMessage,
    logoutUser,
    saveStateToLocalStorage,
    setStateFromLocalStorage,
    getBrandsAndSuppliers,
    getBrandsAndSuppliersSuccess,
    getFramework,
    getFrameworkSuccess,
    listParts,
    listPartsOK,
};
export default connect(mapStateToProps, mapDispatchToProps)(Header)
