import BrandSelect from "../brand/BrandSelect";
import FormTextInput from "../../common/FormTextInput";
import * as PropTypes from "prop-types";
import React, {Fragment} from "react";
import SearchButton from "../../common/SearchButton";

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
        {props.canSelectArchived &&
        <Fragment>
            <div className="field-label">Include archived frames:</div>
            <input type="checkbox"
                   name="archived"
                   onChange={() => props.onChange('archived', !props.archived)}
                   checked={props.archived ? props.archived : false}
                   data-test="archived-checkbox"
            />
        </Fragment>
        }
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