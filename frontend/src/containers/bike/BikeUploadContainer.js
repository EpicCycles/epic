import {connect} from 'react-redux'
import BikeUpload from "../../components/bike/BikeUpload";
// import {sampleBrands, sampleSections} from "../../helpers/sampleData";
import {saveBrands} from "../../state/actions/core";
import { saveFramework} from "../../state/actions/framework";
import {clearFrame, uploadFrame} from "../../state/actions/bike";
const mapStateToProps = ({core, framework, bike}) => {
    return {
        brands: core.brands ,
        suppliers: core.suppliers,
        sections: framework.sections,
        isLoading: (framework.isLoading || core.isLoading || bike.isLoading),
        frame: bike.frame
    }
};
const mapDispatchToProps = {
    saveBrands,
    saveFramework,
    uploadFrame,
    clearFrame
};
export default connect(mapStateToProps, mapDispatchToProps)(BikeUpload)

