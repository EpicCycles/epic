import {connect} from "react-redux";
import Header from "./Header";
import {removeMessage} from "../../state/actions/application";

export default connect(({user, application}) => ({
    user: user.user,
    application,
}), {
    removeError: removeMessage
}) (Header)
