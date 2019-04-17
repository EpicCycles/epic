import {connect} from "react-redux";
import Header from "../../components/menus/Header";
import {getStateFromLocalStorage, removeMessage, saveStateToLocalStorage} from "../../state/actions/application";
import {logoutUser} from "../../state/actions/user";

const mapStateToProps = ({user, application}) => {
    return {
        user: user.user,
        token: user.token,
        application,
    }
};
const mapDispatchToProps = {
    removeMessage,
    logoutUser,
    saveStateToLocalStorage,
    getStateFromLocalStorage
};
export default connect(mapStateToProps, mapDispatchToProps) (Header)
