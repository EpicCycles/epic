import React, {Fragment} from "react";
import {removeObjectWithIndex} from "../../helpers/utils";
import ShowOrHide from "../../common/ShowOrHide";
import PartString from "../part/PartString";

class BikeUploadReview extends React.Component {
    constructor() {
        super();
        this.state = {
            bikesWithDetail: []
        }
    }

    showBikeDetail = id => {
        const updatedShownBikes = this.state.bikesWithDetail.slice(0)
        updatedShownBikes.push(id);
        this.setState({ bikesWithDetail: updatedShownBikes });
    };
    hideBikeDetail = id => {
        const bikeIndex = this.state.bikesWithDetail.indexOf(id);
        this.setState({ bikesWithDetail: removeObjectWithIndex(this.state.bikesWithDetail, bikeIndex) });
    };

    render() {
        const { frame, brands, sections } = this.props;
        const { bikesWithDetail } = this.state;
        // const uploadDisabled = !(brand && frameName);
        return <Fragment key="bikeUploadPartTypes">
            <div key="partTypes" className="grid"
                 style={{ height: (window.innerHeight * 0.8) + "px", overflow: "scroll" }}>
                <div className="grid-row grid-row--header ">
                    <div className="grid-item--header grid-header--fixed-left">
                        Bike
                    </div>
                    <div className="grid-item--header">
                        Description
                    </div>
                    <div className="grid-item--header">
                        Selling Price
                    </div>
                    <div className="grid-item--header">
                        Size(s)
                    </div>
                    <div className="grid-item--header">
                        Colour(s)
                    </div>
                    <div className="grid-item--header">

                    </div>
                    <div className="grid-item--header">
                        Parts
                    </div>
                    <div className="grid-item--header">

                    </div>
                </div>
                <Fragment>
                    {frame.bikes.map((bike, bikeIndex) =>
                        <div className="grid-row" key={`bikeRow${bikeIndex}`}>
                            <div className="grid-item grid-item--fixed-left">
                                {bike.model_name}
                            </div>
                            <div className="grid-item">
                                {bike.description}
                            </div>
                            <div className="grid-item">
                                {bike.selling_price && `&pound;${bike.selling_price}`}
                            </div>
                            <div className="grid-item">
                                {bike.sizes}
                            </div>
                            <div className="grid-item">
                                {bike.colours}
                            </div>
                            <div className="grid-item align_center">
                                <ShowOrHide
                                    componentKey={`seeParts${bikeIndex}`}
                                    isShown={bikesWithDetail.includes(bikeIndex)}
                                    hideDetail={this.hideBikeDetail}
                                    showDetail={this.showBikeDetail}
                                    detailKey={bikeIndex}
                                />
                            </div>
                            <div className="grid-item ">
                                {(bikesWithDetail.includes(bikeIndex)) && bike.parts.map(part =>
                                    <PartString
                                        part={part}
                                        brands={brands}
                                        sections={sections}
                                    />
                                )}
                            </div>
                            <div className="grid-item">
                                {bike.error && bike.error_detail.join()}
                            </div>
                        </div>)}
                </Fragment>
            </div>

        </Fragment>;
    }
}


//
// };


export default BikeUploadReview;