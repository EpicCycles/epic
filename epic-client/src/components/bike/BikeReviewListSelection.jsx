import BrandSelect from "../brand/BrandSelect";
import FormTextInput from "../../common/FormTextInput";
import {Button} from "semantic-ui-react";
import * as PropTypes from "prop-types";
import React, {Fragment} from "react";
import BikeSearch from "./BikeSearch";

const BikeReviewListSelection = (props) => {
    return <Fragment>
        <h2 data-test="bike-review-heading">Get Frames to Review</h2>
        <BikeSearch
            brandSelected={props.brandSelected}
            brands={props.brands}
            onChange={props.onChange}
            onClick={props.onClick}
            getFrameList={props.getFrameList}
            frameName={props.frameName}
            archived={props.archived}
            canSelectArchived={true}
            data-test="bike-search"
            />
    </Fragment>;
};

BikeReviewListSelection.propTypes = {
    brands: PropTypes.any,
    onChange: PropTypes.func,
    brandSelected: PropTypes.string,
    onClick: PropTypes.func,
    frameName: PropTypes.string,
    archived: PropTypes.bool,
    getFrameList: PropTypes.func
};

export default BikeReviewListSelection;