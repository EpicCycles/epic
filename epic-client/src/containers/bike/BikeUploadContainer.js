import {connect} from 'react-redux'
import BikeUpload from "../../components/bike/BikeUpload";
const mapStateToProps = ({core}) => {
    return {
        brands: core.brands,
    }
};
const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(BikeUpload)
