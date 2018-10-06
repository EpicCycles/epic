import {connect} from 'react-redux'
import {getFramework, saveFramework, updateFramework} from "../../state/actions/framework";
import Framework from "./Framework";

export default connect(({framework}) => ({
    sections: framework.sections,
    isLoading: framework.isLoading,
}), {
    getFramework,
    saveFramework,
    updateFramework
})(Framework)

