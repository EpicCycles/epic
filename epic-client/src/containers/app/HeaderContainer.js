import {connect} from "react-redux";
import Header from "../../components/menus/Header";
import {removeMessage} from "../../state/actions/application";
import {logoutUser} from "../../state/actions/user";

const mapStateToProps = ({user, application}) => {
    return {
        user: user.user,
        application,
    }
};
const mapDispatchToProps = {
    removeMessage,
    logoutUser,
};
export default connect(mapStateToProps, mapDispatchToProps) (Header)
