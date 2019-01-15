import React, {Fragment} from 'react'

import {applyFieldValueToModel, bikeFields} from "../../helpers/models";
import {Dimmer, Icon, Loader} from "semantic-ui-react";
import EditModelField from "../app/model/EditModelField";
import Pagination from "../../common/pagination";
import {isItAnObject, updateObject} from "../../helpers/utils";
import {Redirect} from "react-router";
import {buildPartString} from "../../helpers/part_helper";
import PartEdit from "../part/PartEdit";
import {NEW_ELEMENT_ID} from "../../helpers/constants";
import ReactModal from "react-modal";

// Review page for a single bike - needs: bike field entry section, table of parts with edit ability for each part

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
                                partTypeName: partType.shortName,
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
                <h2>{bike.frame_name}</h2>
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
                        <Fragment>
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
                        {displayParts.map((displayPart, partIndex) =>
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

// payload: {
//     bike: {
//       id: 57,
//       frame_name: 'Haibike: Urban',
//       model_name: '4',
//       description: null,
//       colours: 'titan/anthracite matt',
//       sell_price: '3700.00',
//       sizes: null,
//       frame: 13
//     },
//     parts: [
//       {
//         id: 65,
//         part_name: 'A-Head Tapered Cartridge aluminium\r',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 3,
//         brand: 3
//       },
//       {
//         id: 73,
//         part_name: 'aluminium 6061 Gravity Casting Interface hydroformed Tapered head tube quick-release 5 x 135mm disc brake Post Mount\r',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 1,
//         brand: 3
//       },
//       {
//         id: 74,
//         part_name: 'Urban Race steel steerer tube 1 1/8 - 1 1/2 tapered quick release',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 2,
//         brand: 3
//       },
//       {
//         id: 80,
//         part_name: 'Components TheBar ++ Topflat 740mm',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 20,
//         brand: 3
//       },
//       {
//         id: 81,
//         part_name: 'Components TheStem ++ A-head Bar bore: 31.8mm 6˚',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 21,
//         brand: 3
//       },
//       {
//         id: 82,
//         part_name: 'Components The seat post ++ patent 31.6mm',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 22,
//         brand: 3
//       },
//       {
//         id: 328,
//         part_name: 'x-sync 18',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 4,
//         brand: 5
//       },
//       {
//         id: 329,
//         part_name: 'SLX M7000 rapidfire',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 5,
//         brand: 6
//       },
//       {
//         id: 330,
//         part_name: 'Deore XT M8000 Shadow Plus 11 speed',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 7,
//         brand: 6
//       },
//       {
//         id: 331,
//         part_name: 'SLX M7000 aluminium',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 9,
//         brand: 6
//       },
//       {
//         id: 332,
//         part_name: 'HG601',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 10,
//         brand: 6
//       },
//       {
//         id: 333,
//         part_name: 'SLX M7000 11-42 teeth',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 11,
//         brand: 6
//       },
//       {
//         id: 334,
//         part_name: 'Cobalt 1',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 18,
//         brand: 8
//       },
//       {
//         id: 335,
//         part_name: 'Marathon Supreme 32-622 28 x 1.25 Reflective stripes',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 16,
//         brand: 7
//       },
//       {
//         id: 336,
//         part_name: 'Light MTB',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 23,
//         brand: 10
//       },
//       {
//         id: 337,
//         part_name: 'lock on grips Sport',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 24,
//         brand: 11
//       },
//       {
//         id: 338,
//         part_name: 'Freeride Plattform Pedal',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 25,
//         brand: 11
//       },
//       {
//         id: 339,
//         part_name: 'Intuvia',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 27,
//         brand: 12
//       },
//       {
//         id: 340,
//         part_name: 'PowerPack 500 Wh',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 26,
//         brand: 12
//       },
//       {
//         id: 341,
//         part_name: 'compact charger 2A',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 35,
//         brand: 12
//       },
//       {
//         id: 342,
//         part_name: 'Performance Cruise 250W 60Nm 25km/h',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 34,
//         brand: 12
//       },
//       {
//         id: 343,
//         part_name: 'SLX M7000 160mm 2-Kolben Scheibenbremse',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 42,
//         brand: 6
//       },
//       {
//         id: 344,
//         part_name: 'SLX M7000 160mm 2-Kolben Scheibenbremse',
//         trade_in_value: null,
//         standard: false,
//         stocked: false,
//         partType: 40,
//         brand: 6
//       }
//     ]
//   }