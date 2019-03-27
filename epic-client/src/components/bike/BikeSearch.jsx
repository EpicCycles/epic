import BrandSelect from "../brand/BrandSelect";
import FormTextInput from "../../common/FormTextInput";
import * as PropTypes from "prop-types";
import React from "react";
import SearchButton from "../../common/SearchButton";
import FormCheckbox from "../../common/FormCheckbox";

const BikeSearch = (props) => {
    return <div className="row vertical-middle">
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
            data-test="frame-name"
        />
        {props.canSelectArchived && <FormCheckbox
            onChange={props.onChange}
            fieldName={'archived'}
            fieldValue={props.archived}
            fieldLabel='Include archived frames:'
            data-test="archived-checkbox"
            key='select-archived-for-bikes'
        />}
        <SearchButton
            onClick={props.getFrameList}
            disabled={!props.brandSelected}
            title={'find matching bikes'}
            data-test="search"
        />
    </div>;
};
BikeSearch.defaultProps = {
    brands: [],
};
BikeSearch.propTypes = {
    brands: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    brandSelected: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    frameName: PropTypes.string,
    canSelectArchived: PropTypes.bool,
    archived: PropTypes.bool,
    getFrameList: PropTypes.func.isRequired,
};

export default BikeSearch;