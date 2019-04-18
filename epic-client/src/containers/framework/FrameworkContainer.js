import {connect} from 'react-redux'
import {saveFramework, updateFramework} from "../../state/actions/framework";
import Framework from "../../components/framework/Framework";

export default connect(({framework}) => ({
    sections: framework.sections,
    isLoading: framework.isLoading,
}), {
    saveFramework,
    updateFramework
})(Framework)

