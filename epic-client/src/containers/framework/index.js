import {connect} from 'react-redux'
import {getFramework} from "../../state/actions/framework";
import {saveFramework} from "../../state/sagas/framework";
import Framework from "./Framework";

export default connect(({framework}) => ({
    sections: framework.sections,
    isLoading: framework.isLoading,
}), {
    getFramework,
    saveFramework,
})(Framework)

