import {connect} from 'react-redux'
import BikeUpload from "../../components/bike/BikeUpload";
// import {sampleBrands, sampleSections} from "../../helpers/sampleData";
import {getBrandsAndSuppliers, saveBrands} from "../../state/actions/core";
import {getFramework} from "../../state/actions/framework";
import {getFrameList} from "../../state/actions/bike";
const mapStateToProps = ({core, framework, bike}) => {
    return {
        brands: core.brands ,
        suppliers: core.suppliers,
        sections: framework.sections,
        isLoading: (bike.isLoading),
        frames: bike.frames
    }
};
const mapDispatchToProps = {
    getBrandsAndSuppliers,
    saveBrands,
    getFramework,
    getFrameList
};
export default connect(mapStateToProps, mapDispatchToProps)(BikeUpload)

