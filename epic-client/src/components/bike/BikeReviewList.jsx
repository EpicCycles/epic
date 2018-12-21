import React, {Fragment} from 'react'
import {removeKey} from "../../helpers/utils";
import {Button, Dimmer, Icon, Loader} from "semantic-ui-react";
import BikeReviewListSelection from "./BikeReviewListSelection";

class BikeReviewList extends React.Component {
    state = {
        brand: '',
        frameName: '',
        archived: false,
        frameArchiveList: [],
        frameDeleteList: [],
        bikeReviewList: [],
        bikeDeleteList: []
    };

    constructor(props) {
        super();
        if (!(props.brands && props.brands.length > 0)) {
            if (!props.isLoading) {
                props.getBrands();
            }
        }
    }

    handleInputChange = (fieldName, input) => {
        let newState = Object.assign({}, this.state);
        newState[fieldName] = input;
        this.setState(newState);
    };
    handleInputClear = (fieldName) => {
        removeKey(this.state, fieldName);
    };
    changeArchivedSelected = () => {
        this.handleInputChange("archived", !this.state.archived);
    };
    buildSearchCriteria = () => {
        const { brand, frameName, archived } = this.state;
        return { brand, frameName, archived };
    };
    getFrameList = () => {
        this.props.getFrameList(this.buildSearchCriteria());
    };
    showSearch = () => {
        const { frameArchiveList, frameDeleteList, bikeReviewList, bikeDeleteList } = this.state;
        if ((frameArchiveList.length > 0) || (frameDeleteList.length > 0) || (bikeReviewList.length > 0) || (bikeDeleteList.length > 0)) {
            if (!window.confirm("Are You Sure?")) return;
        }
        let newState = Object.assign({},
            this.state,
            { frameArchiveList: [], frameDeleteList: [], bikeReviewList: [], bikeDeleteList: [] }
        );
        this.setState(newState);
        this.props.clearFrame();
    };
    changeList = (oldList, checkId) => {
        let newList = oldList.slice();
        if (newList.includes(checkId)) {
            var index = newList.indexOf(checkId);
            if (index !== -1) newList.splice(index, 1);
        } else {
            newList.push(checkId);
        }
        return newList;
    };
    changeFrameArchiveList = (frameId) => {
        let newState = Object.assign({},
            this.state,
            { frameArchiveList: this.changeList(this.state.frameArchiveList, frameId) }
        );
        this.setState(newState);
    };
    changeFrameDeleteList = (frameId) => {
        let newState = Object.assign({},
            this.state,
            { frameDeleteList: this.changeList(this.state.frameDeleteList, frameId) }
        );
        this.setState(newState);
    };
    changeBikeReviewList = (bikeId) => {
        let newState = Object.assign({},
            this.state,
            { bikeReviewList: this.changeList(this.state.bikeReviewList, bikeId) }
        );
        this.setState(newState);
    };
    changeBikeDeleteList = (bikeId) => {
        let newState = Object.assign({},
            this.state,
            { bikeDeleteList: this.changeList(this.state.bikeDeleteList, bikeId) }
        );
        this.setState(newState);
    };
    restoreArchivedFrame = (frameId) => {
        const frame = {
            id: frameId,
            archived: false,
            archived_date: null
        };
        this.props.saveFrame(frame, this.buildSearchCriteria());
    };

    archiveFrames = () => {
        this.props.archiveFrames(this.state.frameArchiveList, this.buildSearchCriteria());
        let newState = Object.assign({},
            this.state,
            { frameArchiveList: [] }
        );
        this.setState(newState);
    };

    deleteFrames = () => {
        this.props.deleteFrames(this.state.frameDeleteList, this.buildSearchCriteria());
        let newState = Object.assign({},
            this.state,
            { frameDeleteList: [] }
        );
        this.setState(newState);
    };

    reviewAll = () => {
        const { frames } = this.props;
        const nonArchivedFrames = frames ? frames.filter(frame => (!frame.archived)) : [];
        let bikeReviewList = [];
        nonArchivedFrames.forEach(frame => {
            frame.bikes.forEach(bike => bikeReviewList.push(bike.id));
        });
        let newState = Object.assign({},
            this.state,
            { bikeReviewList }
        );
        if (!this.kickOffReview(bikeReviewList)) this.setState(newState);
    };
    startReview = () => {
        this.kickOffReview(this.state.bikeReviewList);
    };
    kickOffReview = (bikeReviewList) => {
        const { frameArchiveList, frameDeleteList, bikeDeleteList } = this.state;
        if ((frameArchiveList.length > 0) || (frameDeleteList.length > 0) || (bikeDeleteList.length > 0)) {
            if (!window.confirm("Do you want to continue without processing delete and archive requests?")) {
                return false;
            }
        }
        this.props.reviewBikes(bikeReviewList, this.buildSearchCriteria());
        return true;
    };

    deleteBikes = () => {
        this.props.deleteBikes(this.state.bikeDeleteList, this.buildSearchCriteria());
        let newState = Object.assign({},
            this.state,
            { bikeDeleteList: [] }
        );
        this.setState(newState);
    };

    render() {
        const { brand, frameName, archived, frameArchiveList, bikeReviewList, bikeDeleteList, frameDeleteList } = this.state;
        const { isLoading, brands, frames } = this.props;
        const archivedFrames = frames ? frames.filter(frame => frame.archived) : [];
        const nonArchivedFrames = frames ? frames.filter(frame => (!frame.archived)) : [];
        let framesWidth = archived ? (window.innerWidth * 0.75) : window.innerWidth;
        return <Fragment key="bikeUpload">
            {!frames ? <BikeReviewListSelection
                    brands={brands}
                    onChange={this.handleInputChange}
                    brandSelected={brand}
                    onClick={this.handleInputClear}
                    frameName={frameName}
                    changeArchivedSelected={this.changeArchivedSelected}
                    archived={archived}
                    getFrameList={this.getFrameList}/>
                :
                <Fragment>
                    <h2>Review Frames</h2>

                    <div className="row full align_right">
                        <Button
                            key="newSearch"
                            onClick={this.showSearch}
                        >
                            New Search
                        </Button>
                        <Button
                            key="archiveFrames"
                            disabled={(frameArchiveList.length === 0)}
                            onClick={this.archiveFrames}
                        >
                            Archive Frames
                        </Button>
                        <Button
                            key="deleteFrames"
                            disabled={(frameDeleteList.length === 0)}
                            onClick={this.deleteFrames}
                        >
                            Delete Frames
                        </Button>
                        <Button
                            key="deleteBikes"
                            disabled={(bikeDeleteList.length === 0)}
                            onClick={this.deleteBikes}
                        >
                            Delete Bikes
                        </Button>
                        <Button
                            key="reviewBikes"
                            disabled={(bikeReviewList.length === 0)}
                            onClick={this.startReview}
                        >
                            Review Bikes
                        </Button>
                        <Button
                            key="reviewAllBikes"
                            onClick={this.reviewAll}
                        >
                            Review All
                        </Button>
                    </div>
                    <div className="row">
                        {(nonArchivedFrames.length > 0) ? <div
                                key='bikeReviewGrid'
                                className="grid"
                                style={{
                                    height: (window.innerHeight - 100) + "px",
                                    width: (framesWidth - 50) + "px",
                                    overflow: "scroll"
                                }}
                            >
                                <div key="bikeReviewHeaders" className="grid-row grid-row--header">
                                    <div className="grid-item--header grid-header--fixed-left">Frame</div>
                                    <div className="grid-item--header"></div>
                                    <div className="grid-item--header">Model</div>
                                    <div className="grid-item--header">Description</div>
                                    <div className="grid-item--header">Sell Price</div>
                                    <div className="grid-item--header">Sizes</div>
                                    <div className="grid-item--header">action</div>
                                </div>
                                {nonArchivedFrames.map((frame) =>
                                    frame.bikes.map((bike, bikeIndex) =>
                                        <div key={`detailRow${bike.id}`} className="grid-row">
                                            <div
                                                className="grid-item grid-item--fixed-left"
                                                key={`bikeRowFrame${bike.id}`}
                                            >
                                                {(bikeIndex === 0) && frame.frame_name}
                                            </div>
                                            <div
                                                className="grid-item align_center"
                                                key={`bikeRowArchive${bike.id}`}
                                            >
                                                {(bikeIndex === 0) &&
                                                <Fragment>
                                                    <Icon
                                                        key={`archive${frame.id}`}
                                                        name="archive"
                                                        className={frameArchiveList.includes(frame.id) && "red"}
                                                        onClick={() => (!frameDeleteList.includes(frame.id)) && this.changeFrameArchiveList(frame.id)}
                                                        disabled={(frameDeleteList.includes(frame.id))}
                                                        title="Archive this frame and all related bikes"
                                                    />
                                                    <Icon
                                                        key={`delete${frame.id}`}
                                                        name="delete"
                                                        className={frameDeleteList.includes(frame.id) && "red"}
                                                        onClick={() => (!frameArchiveList.includes(frame.id)) && this.changeFrameDeleteList(frame.id)}
                                                        disabled={(frameArchiveList.includes(frame.id))}
                                                        title="Delete this frame and all related bikes"
                                                    />
                                                </Fragment>
                                                }
                                            </div>
                                            <div
                                                className="grid-item"
                                                key={`bikeModel${bike.id}`}
                                            >
                                                {bike.model_name}
                                            </div>
                                            <div
                                                className="grid-item"
                                                key={`bikeDescription${bike.id}`}
                                            >
                                                {bike.description}
                                            </div>
                                            <div
                                                className="grid-item"
                                                key={`bikeColours${bike.id}`}
                                            >
                                                {bike.colours}
                                            </div>
                                            <div
                                                className="grid-item"
                                                key={`bikeSizes${bike.id}`}
                                            >
                                                {bike.sizes}
                                            </div>
                                            <div
                                                className="grid-item align_center"
                                                key={`bikeActions${bike.id}`}
                                            >
                                                <Icon
                                                    key={`delete${bike.id}`}
                                                    name="trash"
                                                    className={bikeDeleteList.includes(bike.id) && "red"}
                                                    onClick={() => (!bikeReviewList.includes(bike.id)) && this.changeBikeDeleteList(bike.id)}
                                                    disabled={(bikeReviewList.includes(bike.id))}
                                                    title="Delete this bike"
                                                />
                                                <Icon
                                                    key={`review${bike.id}`}
                                                    name="edit outline"
                                                    className={bikeReviewList.includes(bike.id) && "red"}
                                                    onClick={() => (!bikeDeleteList.includes(bike.id)) && this.changeBikeReviewList(bike.id)}
                                                    disabled={(bikeDeleteList.includes(bike.id))}
                                                    title="Review this bike"
                                                />
                                            </div>
                                        </div>
                                    )
                                )

                                }
                            </div>
                            :
                            <div>No current frames found</div>
                        }
                        {(archived && (archivedFrames.length > 0)) && <div
                            key='bikeArchiveGrid'
                            className="grid"
                            style={{
                                height: (window.innerHeight - 100) + "px",
                                width: ((window.innerWidth * 0.25) - 50) + "px",
                                overflow: "scroll"
                            }}
                        >
                            <div key="bikeReviewHeaders" className="grid-row grid-row--header">
                                <div className="grid-item--header grid-header--fixed-left">Frame</div>
                                <div className="grid-item--header">Date Archived</div>
                                <div className="grid-item--header">Undo</div>
                            </div>
                            {archivedFrames.map(frame =>
                                <div key={`archiveRow${frame.id}`} className="grid-row">
                                    <div
                                        className="grid-item grid-item--fixed-left"
                                        key={`archiveRowFrame${frame.id}`}
                                    >
                                        {frame.frame_name}
                                    </div>
                                    <div
                                        className="grid-item"
                                        key={`archiveRowDate${frame.id}`}
                                    >
                                        {frame.archived_date.substring(0, 10)}
                                    </div>
                                    <div
                                        className="grid-item align_center"
                                        key={`archiveRowUndo${frame.id}`}
                                    >
                                        <Icon
                                            key={`undo${frame.id}`}
                                            name="undo"
                                            className="red"
                                            onClick={() => this.restoreArchivedFrame(frame.id)}
                                            title="Undo Archive of frame"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        }
                        {(archived && (archivedFrames.length === 0)) && <div>No Archived frames found</div>}
                    </div>
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

export default BikeReviewList;