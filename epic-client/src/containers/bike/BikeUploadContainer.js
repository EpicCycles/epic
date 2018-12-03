import {connect} from 'react-redux'
import BikeUpload from "../../components/bike/BikeUpload";
// import {sampleBrands, sampleSections} from "../../helpers/sampleData";
import {getBrands, saveBrands} from "../../state/actions/core";
import {getFramework} from "../../state/actions/framework";
const mapStateToProps = ({core, framework}) => {
    return {
        brands: core.brands ,
        sections: framework.sections ,
        isLoading: (framework.isLoading || core.isLoading),
    }
};
const mapDispatchToProps = {
    getBrands,
    saveBrands,
    getFramework
};
export default connect(mapStateToProps, mapDispatchToProps)(BikeUpload)

/**
Colours#Blue
Colour#Red
 */