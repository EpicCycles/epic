import {connect} from "react-redux";
import Header from "../../components/menus/Header";
import {removeMessage} from "../../state/actions/application";

const mapStateToProps = (state) => {
    return {
        user: user.user,
        application,
    }
};
const mapDispatchToProps = {
    removeError: removeMessage
};
export default connect(mapStateToProps, mapDispatchToProps) (Header)
