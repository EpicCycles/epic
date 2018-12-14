import {connect} from 'react-redux'
// import {sampleBrands, sampleSections} from "../../helpers/sampleData";
import {getBrands} from "../../state/actions/core";
import {getFramework} from "../../state/actions/framework";
import {archiveFrames, clearFrame, getFrameList, saveFrame} from "../../state/actions/bike";
import BikeReviewList from "../../components/bike/BikeReviewList";
const mapStateToProps = ({core, framework, bike}) => {
    return {
        brands: core.brands ,
        sections: framework.sections,
        isLoading: (bike.isLoading),
        frames: bike.frames
    }
};
const mapDispatchToProps = {
    getBrands,
    getFramework,
    getFrameList,
    clearFrame,
    saveFrame,
    archiveFrames,
};
export default connect(mapStateToProps, mapDispatchToProps)(BikeReviewList)

