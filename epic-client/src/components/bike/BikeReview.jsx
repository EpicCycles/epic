import React, {Fragment} from 'react'
import {Dimmer, Loader} from "semantic-ui-react";
import Pagination from "../../common/pagination";
import {findObjectWithId, updateObject} from "../../helpers/utils";
import {Redirect} from "react-router";
import {applyFieldValueToModel} from "../app/model/helpers/model";
import BikeEdit from "./BikeEdit";
import * as PropTypes from "prop-types";
import {findPartsForBike} from "./helpers/bike";
import PartViewRow from "../part/PartViewRow";
import PartDisplayGrid from "../part/PartDisplayGrid";

// Review page for a single bike - needs: bike field entry section, table of parts with edit ability for each part

// TODO revise with new api structure
// 1.  state - check prev props and bikeId - get details for that bike id onload, frame name from frames.
// 2.  remove modal for parts - instead add panel to add a new part
// 3.  when a part is saved the api call gets bike parts and parts - needs revising
//     - api change - return bikeparts, parts
//     - reducer change to remove all bike parts for bike and add values from api - and trigger parts being added
// 4.  when a bike is deleted - api OK (I thnk) - check that bike and bike parts are removed and that bike id for review is updated, and id removed from review array
// 5.  next review - check that id is updated
// 6. display - drive from sections in body rather than in initialisation
// 7.  allow edit part details (price trade in price etc) as well as use different part - different part will be search for parts or enter new part block
class BikeReview extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        this.checkPropsData();
    };

    componentDidUpdate(prevProps) {
        this.checkPropsData();
    };

    checkPropsData = () => {
        if (!this.props.isLoading) {
            this.getData();
        }
    };
    getData = () => {
        let brandsRequired = true;
        let frameworkRequired = true;
        if (this.props.brands && this.props.brands.length > 0) {
            brandsRequired = false;
        }
        if (this.props.sections && this.props.sections.length > 0) {
            frameworkRequired = false;
        }
        if (brandsRequired) {
            this.props.getBrandsAndSuppliers();
        } else if (frameworkRequired) {
            this.props.getFramework();
        }
    };

    // note component key is also passed and ignored
    changeBikeField = (fieldName, fieldValue) => {
        const bike = applyFieldValueToModel(this.state.bike, fieldName, fieldValue);
        this.setStateForBike(bike);
    };

    resetBikeData = () => {
        this.setStateForBike(this.props.bike);
    };

    saveBikeChanges = () => {
        this.props.saveBike(this.state.bike);
        this.flagBikeRefresh();
    };
    deleteBike = () => {
        if (window.confirm("Are you sure you want to delete this bike?")) {
            this.props.deleteBikes([this.props.bike.id]);
        }
    };
    reviewSelectedBike = (bikePage) => {
        const bikeIndex = bikePage - 1;
        this.props.reviewBike(this.props.bikeReviewList[bikeIndex]);
    };
    deletePart = (partId) => {
        this.props.deleteBikePart(this.props.bike.id, partId);
        this.flagPartRefresh();
    };
    saveOrAddPart = (part) => {
        const bikeId = this.props.bike.id;
        if (part.id) {
            this.props.saveBikePart(bikeId, part);
        } else {
            this.props.addBikePart(bikeId, part);
        }
        this.flagPartRefresh();
    };
    flagBikeRefresh = () => {
        const newState = updateObject(this.state, { bikeRefresh: true });
        this.setState(newState);
    };
    flagPartRefresh = () => {
        const newState = updateObject(this.state, { partRefresh: true });
        this.setState(newState);
    };

    render() {
        const {bikes, bikeParts, parts, bikeReviewList, isLoading, brands, frames, sections, saveBike, deleteBike , bikeId} = this.props;
        const selectedBikeIndex = bikeReviewList.indexOf(bikeId);
        const bike = selectedBikeIndex ? bikes[selectedBikeIndex] : undefined;
        const partsForBike = findPartsForBike(bike, bikeParts, parts);
        return <Fragment key={`bikeReview`}>
            {!(bike) && <Redirect to="/bike-review-list" push/>}
            <BikeEdit
                bike={bike}
                brands={brands}
                frames={frames}
                saveBike={saveBike}
                deleteBike={deleteBike}
            />
            <PartDisplayGrid
                parts={parts}
                sections={sections}
                brands={brands}
            />
            <Pagination
                type="Bike"
                getPage={this.reviewSelectedBike}
                lastPage={bikeReviewList.length}
                count={bikeReviewList.length}
                page={(selectedBikeIndex + 1)}
            />
            {isLoading &&
            <Dimmer active inverted>
                <Loader content='Loading'/>
            </Dimmer>
            }
        </Fragment>
    }
}

BikeReview.propTypes = {
    bikeId: PropTypes.object.isRequired,
    bikeReviewList: PropTypes.array.isRequired,
    bikeParts: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
    parts: PropTypes.array.isRequired,
    frames: PropTypes.array.isRequired,
    saveBike: PropTypes.func.isRequired,
    deleteBike: PropTypes.func.isRequired,
    reviewBike: PropTypes.func.isRequired,
};
export default BikeReview;

