import {connect} from 'react-redux'
import {getBrandsAndSuppliers, saveBrands} from "../../state/actions/core";
import {getFramework} from "../../state/actions/framework";
import {deleteBikePart, reviewBike, saveBike, saveBikePart, deleteBikes, addBikePart} from "../../state/actions/bike";
import BikeReview from "../../components/bike/BikeReview";
const mapStateToProps = ({core, framework, bike, part}) => {
    return {
        brands: core.brands ,
        suppliers: core.suppliers,
        sections: framework.sections,
        isLoading: (core.isLoading || bike.isLoading || framework.isLoading),
        bike: bike.bike,
        parts: bike.parts,
        bikeReviewList: bike.bikeReviewList
    }
};
const mapDispatchToProps = {
    getBrandsAndSuppliers,
    saveBrands,
    getFramework,
    reviewBike,
    saveBike,
    deleteBikes,
    saveBikePart,
    deleteBikePart,
    addBikePart
};
export default connect(mapStateToProps, mapDispatchToProps)(BikeReview)

