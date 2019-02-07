import React, {Fragment} from 'react'

import {bikeFields} from "../app/model/helpers/fields";
import {Dimmer, Icon, Loader} from "semantic-ui-react";
import EditModelField from "../app/model/EditModelField";
import Pagination from "../../common/pagination";
import {isItAnObject, updateObject} from "../../helpers/utils";
import {Redirect} from "react-router";
import {buildPartString} from "../part/helpers/part_helper";
import PartEdit from "../part/PartEdit";
import {NEW_ELEMENT_ID} from "../../helpers/constants";
import ReactModal from "react-modal";
import {applyFieldValueToModel} from "../app/model/helpers/model";

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
        this.state = {
            showModal: false,
            modalPart: undefined
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    componentDidMount() {
        this.checkPropsData();
    };

    componentDidUpdate() {
        this.checkPropsData();
    };

    handleOpenModal(part) {
        this.setState({ showModal: true, modalPart: part });
    }


    handleCloseModal() {
        this.setState({ showModal: false, modalPart: undefined });
    }

    checkPropsData = () => {
        if (this.props.bikeReviewList && (this.props.bikeReviewList.length > 0)) {
            if (!this.props.isLoading) {
                this.getData();

                if (isItAnObject(this.props.bike) &&
                    (!isItAnObject(this.state.bike) || (this.props.bike.id !== this.state.bike.id))) {
                    if (this.props.sections && (this.props.sections.length > 0) && this.props.brands && this.props.parts) {
                        this.setStateForBike(this.props.bike, this.props.parts);
                    }
                } else if (this.props.parts && this.state.partRefresh) {
                    this.setStateForBike(undefined, this.props.parts);
                } else if (this.props.bike && this.state.bikeRefresh) {
                    this.setStateForBike(this.props.bike);
                }
            }
        }
    };
    setStateForBike = (bike, parts) => {
        let valuesForState = {};
        if (bike) {
            valuesForState.bike = bike;
            valuesForState.bikeRefresh = false;
        }
        const sections = this.props.sections;
        if (parts) {
            const brands = this.props.brands;
            const displayParts = [];
            sections.forEach(section => {
                const dummyPart = { section_name: section.name };
                let sectionPos = 0;
                section.partTypes.forEach(partType => {
                    const bikePart = parts.filter((part) => (part.partType === partType.id))[0];
                    if (bikePart) {
                        displayParts.push(updateObject(
                            dummyPart,
                            bikePart,
                            {
                                sectionPos,
                                partTypeName: partType.name,
                                fullPartName: buildPartString(bikePart, brands)
                            }));
                        sectionPos++;
                    }
                });
                if (sectionPos === 0) {
                    displayParts.push(updateObject(dummyPart, { empty: true, sectionPos }));
                }
            });
            valuesForState.displayParts = displayParts;
            valuesForState.partRefresh = false;
        }
        const newState = updateObject(this.state, valuesForState);
        this.setState(newState);
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
        let changeBike = true;
        if (this.state.bike.changed) {
            changeBike = window.confirm("Are you sure? Changes may be lost.")
        }
        if (changeBike) {
            const bikeIndex = bikePage - 1;
            this.props.reviewBike(this.props.bikeReviewList[bikeIndex]);
        }
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
        const { bikeReviewList, isLoading, brands, sections } = this.props;
        const { bike, displayParts, showModal, modalPart } = this.state;
        const persistedBike = this.props.bike;
        const selectedBikeIndex = bike && bikeReviewList.indexOf(bike.id);
        return <Fragment key={`bikeReview`}>
            {!(bikeReviewList && (bikeReviewList.length > 0)) && <Redirect to="/bike-review-list" push/>}
            {bike && <Fragment>
                <h2>{bike.frame_name}</h2> // TODO frame_name not on bike
                <div className="row">
                    <div className="column grid"
                         style={{
                             width: "550px",
                         }}
                    >
                        <div className="grid-row">
                            <div className="grid-item--borderless"/>
                            <div className="grid-item--borderless align_right">
                                {bike.changed &&
                                <Icon id={`reset-bike`} name="undo"
                                      onClick={this.resetBikeData}
                                      title="Reset Bike details"
                                />
                                }
                                {(bike.changed) &&
                                <Icon id={`accept-bike`} name="check"
                                      onClick={this.saveBikeChanges}
                                      title="Save Changes"
                                />
                                }
                                <Icon id={`delete-bike`} name="trash"
                                      onClick={this.deleteBike}
                                      title="Delete Bike"
                                />
                            </div>
                        </div>
                        <Fragment>// TODO consider using EditModel fragment here.
                            {bikeFields.map((field, index) => {
                                return <EditModelField
                                    key={`bikeFields${index}${bike.id}`}
                                    field={field}
                                    index={index}
                                    model={bike}
                                    persistedModel={persistedBike}
                                    onChange={this.changeBikeField}
                                />
                            })
                            }
                        </Fragment>
                    </div>
                    <div
                        className="column grid"
                        style={{
                            height: (window.innerHeight - 100) + "px",
                            width: (window.innerWidth - 600) + "px",
                            overflow: "auto"
                        }}
                    >
                        <div key="partReviewHeaders" className="grid-row grid-row--header">
                            <div
                                className="grid-item--header grid-header--fixed-left"
                            >
                                Section
                            </div>
                            <div
                                className="grid-item--header"
                            >
                                Part Type
                            </div>
                            <div
                                className="grid-item--header"
                            >
                                Part
                            </div>
                            <div
                                className="grid-item--header align_center"
                            >
                                Std
                            </div>
                            <div
                                className="grid-item--header "
                            >
                                Stk
                            </div>
                            <div
                                className="grid-item--header"
                            />
                        </div>
                        {displayParts.map((displayPart, partIndex) => //TODO display including readolny fields can this be a separate fragment
                            <div key={`detailRow${displayPart.id}`} className="grid-row">
                                <div className="grid-item grid-item--fixed-left">
                                    {(displayPart.sectionPos === 0) && displayPart.section_name}
                                </div>
                                <div className="grid-item">
                                    {displayPart.empty ? "No Parts" : displayPart.partTypeName}
                                </div>
                                <div className="grid-item">
                                    {displayPart.fullPartName && displayPart.fullPartName}
                                </div>
                                <div className="grid-item align_center">
                                    {displayPart.standard && "Y"}
                                </div>
                                <div className="grid-item align_center">
                                    {displayPart.stocked && "Y"}
                                </div>
                                <div className="grid-item align_center">
                                    <Icon
                                        key={`edit${partIndex}`}
                                        name="edit"
                                        title="Edit part "
                                        onClick={() => (!displayPart.empty) && this.handleOpenModal(displayPart)}
                                        disabled={displayPart.empty}
                                    />
                                    <Icon
                                        key={`delete${partIndex}`}
                                        name="trash"
                                        title="Delete part "
                                        onClick={() => (!displayPart.empty) && this.deletePart(displayPart.id)}
                                        disabled={displayPart.empty}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <Pagination
                    type="Bike"
                    getPage={this.reviewSelectedBike}
                    lastPage={bikeReviewList.length}
                    count={bikeReviewList.length}
                    page={(selectedBikeIndex + 1)}
                />
                {showModal &&
                <ReactModal
                    isOpen={showModal}
                    contentLabel={`Part`}
                    className="Modal PartModal"
                >
                    <PartEdit
                    part={modalPart}
                    partTypeEditable={!(modalPart && modalPart.id)}
                    componentKey={(modalPart && modalPart.id) ? modalPart.id: NEW_ELEMENT_ID}
                    sections={sections}
                    brands={brands}
                    savePart={this.saveOrAddPart}
                    closeModal={this.handleCloseModal}
                />
                </ReactModal>}
            </Fragment>
            }
            {isLoading &&
            <Dimmer active inverted>
                <Loader content='Loading'/>
            </Dimmer>
            }
        </Fragment>
    }
}

export default BikeReview;

