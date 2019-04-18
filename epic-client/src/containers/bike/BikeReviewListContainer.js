import {connect} from 'react-redux'
// import {sampleBrands, sampleSections} from "../../helpers/sampleData";
import {getBrands} from "../../state/actions/core";
import {
    archiveFrames,
    clearFrame,
    deleteBikes,
    deleteFrames,
    getFrameList,
    reviewBikes,
    saveFrame
} from "../../state/actions/bike";
import BikeReviewList from "../../components/bike/BikeReviewList";
const mapStateToProps = ({core, framework, bike}) => {
    return {
        brands: core.brands ,
        sections: framework.sections,
        isLoading: (bike.isLoading),
        frames: bike.frames,
        bikes: bike.bikes,
    }
};
const mapDispatchToProps = {
    getBrands,
    getFrameList,
    clearFrame,
    reviewBikes,
    deleteBikes,
    saveFrame,
    archiveFrames,
    deleteFrames,
};
export default connect(mapStateToProps, mapDispatchToProps)(BikeReviewList)

