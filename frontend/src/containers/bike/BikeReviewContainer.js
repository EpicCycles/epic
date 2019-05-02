import { connect } from 'react-redux';
import { saveBrands } from '../../state/actions/core';
import {
  deleteBikePart,
  reviewBike,
  saveBike,
  saveBikePart,
  deleteBikes,
  addBikePart,
  getBikeParts,
  getBike,
} from '../../state/actions/bike';
import BikeReview from '../../components/bike/BikeReview';
import { listParts } from '../../state/actions/part';

const mapStateToProps = ({ core, framework, bike, part }) => {
  return {
    bikeId: bike.bikeId,
    bikeReviewList: bike.bikeReviewList,
    bikes: bike.bikes,
    bikeParts: bike.bikeParts,
    brands: core.brands,
    suppliers: core.suppliers,
    sections: framework.sections,
    parts: part.parts,
    frames: bike.frames,
    isLoading: core.isLoading || bike.isLoading || framework.isLoading,
  };
};
const mapDispatchToProps = {
  saveBrands,
  reviewBike,
  saveBike,
  deleteBikes,
  getBike,
  getBikeParts,
  saveBikePart,
  deleteBikePart,
  addBikePart,
  listParts,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BikeReview);
