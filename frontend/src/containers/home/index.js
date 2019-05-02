import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {clearAllState} from "../../state/actions/application";
import Home from "../../components/menus/Home";

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({ clearAllState }, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)
