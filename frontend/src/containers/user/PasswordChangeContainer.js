// carry on from http://v1k45.com/blog/modern-django-part-4-adding-authentication-to-react-spa-using-drf/
import {connect} from "react-redux";
import {changePassword} from "../../state/actions/user";
import PasswordChange from "../../components/user/PasswordChange";

export default connect(({user}) => ({
    user: user.user,
    isLoading: user.isLoading,
}), {
    changePassword,
})(PasswordChange)
