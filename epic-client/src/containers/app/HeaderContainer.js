import {connect} from "react-redux";
import Header from "./Header";

export default connect(({user}) => ({
    user: user.user,
    isAuthenticated: user.isAuthenticated
}), {
}) (Header)
