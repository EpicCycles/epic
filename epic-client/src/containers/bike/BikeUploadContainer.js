import {connect} from 'react-redux'
import BikeUpload from "../../components/bike/BikeUpload";
import {sampleBrands, sampleSections} from "../../helpers/sampleData";
const mapStateToProps = ({core, framework}) => {
    return {
        brands: core.brands || sampleBrands,
        sections: framework.sections || sampleSections,
        isLoading: (framework.isLoading || core.isLoading),
    }
};
const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(BikeUpload)

/**
Colours#Blue
Colour#Red
 */