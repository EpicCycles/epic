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
        frames: bike.frames,
        bikes: bike.bikes,
        bikeParts: bike.bikeParts,
        parts: part.parts,
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

