import {connect} from 'react-redux'
import BikeUpload from "../../components/bike/BikeUpload";
// import {sampleBrands, sampleSections} from "../../helpers/sampleData";
import {getBrandsAndSuppliers, saveBrands} from "../../state/actions/core";
import {getFramework, saveFramework} from "../../state/actions/framework";
const mapStateToProps = ({core, framework}) => {
    return {
        brands: core.brands ,
        suppliers: core.suppliers,
        sections: framework.sections,
        isLoading: (framework.isLoading || core.isLoading),
    }
};
const mapDispatchToProps = {
    getBrandsAndSuppliers,
    saveBrands,
    getFramework,
    saveFramework
};
export default connect(mapStateToProps, mapDispatchToProps)(BikeUpload)

/**
Colours#Blue
Colour#Red
 */