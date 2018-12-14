import BrandSelect from "../brand/BrandSelect";
import FormTextInput from "../../common/FormTextInput";
import {Button} from "semantic-ui-react";
import * as PropTypes from "prop-types";
import React, {Fragment} from "react";

const BikeReviewListSelection = (props) => {
    return <Fragment>
        <h2>Get Frames to Review</h2>
        <div className="row vertical-middle">
            <div className="field-label">Brand:</div>
            <BrandSelect
                brands={props.brands}
                fieldName="brand"
                onChange={props.onChange}
                brandSelected={props.brandSelected}
                isEmptyAllowed={true}
                bikeOnly={true}
            />
            <div className="field-label">Frame Name like:</div>
            <FormTextInput
                placeholder="Frame Name"
                id="frame-name-input"
                className="column "
                fieldName="frameName"
                onChange={props.onChange}
                onClick={props.onClick}
                value={props.frameName}
            />
            <div className="field-label">Include archived frames:</div>
            <input type="checkbox"
                   name="archived"
                   onChange={props.changeArchivedSelected}
                   checked={props.archived ? props.archived : false}
            />
            <Button
                onClick={props.getFrameList}
                disabled={!props.brandSelected}
            >
                Find Bikes
            </Button>
        </div>
    </Fragment>;
};

BikeReviewListSelection.propTypes = {
    brands: PropTypes.any,
    onChange: PropTypes.func,
    brandSelected: PropTypes.string,
    onClick: PropTypes.func,
    frameName: PropTypes.string,
    changeArchivedSelected: PropTypes.func,
    archived: PropTypes.bool,
    getFrameList: PropTypes.func
};

export default BikeReviewListSelection;