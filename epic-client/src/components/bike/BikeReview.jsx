import React, {Fragment} from 'react'
import {Dimmer, Loader} from "semantic-ui-react";
import Pagination from "../../common/pagination";
import {doWeHaveObjects, findObjectWithId} from "../../helpers/utils";
import {Redirect} from "react-router";
import BikeEdit from "./BikeEdit";
import * as PropTypes from "prop-types";
import {findPartsForBike} from "./helpers/bike";
import PartDisplayGrid from "../part/PartDisplayGrid";
import PartFinder from "../part/PartFinder";

const initialState = {
    showPartFinder: false,
    partEditPart: {},
};

class BikeReview extends React.Component {
    state = initialState;

    componentDidMount() {
        this.checkPropsData();
    };

    componentDidUpdate(prevProps) {
        this.checkPropsData();
        if (prevProps.bikeId !== this.props.bikeId) this.setState(initialState);
    };

    checkPropsData = () => {
        if (!this.props.isLoading) {
            this.getData();
        }
    };
    getData = () => {
        let brandsRequired = true;
        let frameworkRequired = true;
        let bikeRequired = true;
        let bikePartsRequired = true;
        if (doWeHaveObjects(this.props.brands)) brandsRequired = false;
        if (doWeHaveObjects(this.props.sections)) frameworkRequired = false;

        if (doWeHaveObjects(this.props.bikeParts)) {
            const partsForCurrentBike = this.props.bikeParts.filter(bikePart => bikePart.bike === this.props.bikeId);
            if (partsForCurrentBike.length) bikePartsRequired = false;
        }
        if (doWeHaveObjects(this.props.bikes)) {
            const currentBike = this.props.bikes.filter(bike => bike.id === this.props.bikeId);
            if (currentBike.length) bikeRequired = false;
        }
        if (brandsRequired) {
            this.props.getBrandsAndSuppliers();
        } else if (frameworkRequired) {
            this.props.getFramework();
        } else if (bikeRequired) {
            this.props.getBike(this.props.bikeId);
        } else if (bikePartsRequired) {
            this.props.getBikeParts(this.props.bikeId);
        }
    };
    reviewSelectedBike = (bikePage) => {
        const bikeIndex = bikePage - 1;
        this.props.reviewBike(this.props.bikeReviewList[bikeIndex]);
    };
    deletePart = (partId) => {
        this.props.deleteBikePart(this.props.bike.id, partId);
    };
    saveOrAddPart = (part) => {
        const bikeId = this.props.bikeId;
        if (part.id) {
            this.props.saveBikePart(bikeId, part);
        } else {
            this.props.addBikePart(bikeId, part);
        }
    };
    showPartFinder = (part) => {
        this.setState({ partEditPart: part, showPartFinder: true });
    };
    closePartFinder = () => {
        this.setState(initialState);
    };
    deleteBikePart = (partId) => {
        this.props.deleteBikePart(this.props.bikeId, partId);
    };

    render() {
        const { bikes, bikeParts, parts, bikeReviewList, isLoading, brands, frames, sections, saveBike, deleteBikes, bikeId, listParts } = this.props;
        if (!bikeId) return <Redirect to="/bike-review-list" push/>;
        const { partEditPart, showPartFinder } = this.state;
        const selectedBikeIndex = bikeReviewList.indexOf(bikeId);
        if (selectedBikeIndex < 0) return <Redirect to="/bike-review-list" push/>;
        const bike = findObjectWithId(bikes, bikeId);
        const partsForBike = bike ? findPartsForBike(bike, bikeParts, parts) : [];

        return <Fragment key={`bikeReview`}>
            <section className="row">
                {showPartFinder && <PartFinder
                    sections={sections}
                    parts={parts}
                    brands={brands}
                    savePart={this.saveOrAddPart}
                    deletePart={this.deletePart}
                    findParts={listParts}
                    part={partEditPart}
                    closeAction={this.closePartFinder}
                    partActionPrimary={this.saveOrAddPart}
                    partActionPrimaryIcon={'add'}
                    partActionPrimaryTitle={'Update bike with part'}
                />}
                <div>
                    <BikeEdit
                        bike={bike}
                        brands={brands}
                        frames={frames}
                        saveBike={saveBike}
                        deleteBikes={deleteBikes}
                        key={`editBike${bike.id}`}
                    />
                    <PartDisplayGrid
                        parts={partsForBike}
                        sections={sections}
                        brands={brands}
                        editPart={this.showPartFinder}
                        deletePart={this.deleteBikePart}
                              key={`partGrid${bike.id}`}
              />
                </div>
            </section>

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

BikeReview.defaultProps = {
    brands: [],
    sections: [],
    isLoading: false,
};

BikeReview.propTypes = {
    bikeId: PropTypes.object.isRequired,
    bikeReviewList: PropTypes.array.isRequired,
    bikes: PropTypes.array.isRequired,
    bikeParts: PropTypes.array.isRequired,
    brands: PropTypes.array,
    sections: PropTypes.array,
    parts: PropTypes.array.isRequired,
    frames: PropTypes.array.isRequired,
    getBrandsAndSuppliers: PropTypes.func.isRequired,
    saveBrands: PropTypes.func.isRequired,
    getFramework: PropTypes.func.isRequired,
    reviewBike: PropTypes.func.isRequired,
    saveBike: PropTypes.func.isRequired,
    deleteBikes: PropTypes.func.isRequired,
    getBike: PropTypes.func.isRequired,
    getBikeParts: PropTypes.func.isRequired,
    saveBikePart: PropTypes.func.isRequired,
    deleteBikePart: PropTypes.func.isRequired,
    addBikePart: PropTypes.func.isRequired,
    listParts: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};
export default BikeReview;

