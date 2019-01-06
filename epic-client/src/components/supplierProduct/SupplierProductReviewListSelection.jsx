import BrandSelect from "../brand/BrandSelect";
import FormTextInput from "../../common/FormTextInput";
import {Button} from "semantic-ui-react";
import * as PropTypes from "prop-types";
import React, {Fragment} from "react";
import SupplierSelect from "../supplier/SupplierSelect";

const SupplierProductReviewListSelection = (props) => {
    return <Fragment>
        <h2>Get Parts</h2>
        <div className="row vertical-middle">
            <div className="field-label">Brand:</div>
            <BrandSelect
                brands={props.brands}
                fieldName="brand"
                onChange={props.onChange}
                brandSelected={props.brandSelected}
                isEmptyAllowed={true}
            />
            <div className="field-label">Supplier:</div>
            <SupplierSelect
                suppliers={props.suppliers}
                fieldName="supplier"
                onChange={props.onChange}
                supplierSelected={props.supplierSelected}
                isEmptyAllowed={true}
            />
            <div className="field-label">Part Name like:</div>
            <FormTextInput
                placeholder="Frame Name"
                id="frame-name-input"
                className="column "
                fieldName="partName"
                onChange={props.onChange}
                onClick={props.onClick}
                value={props.partName}
            />
            <div className="field-label">Standard only:</div>
            <input type="checkbox"
                   name="standard"
                   onChange={() => props.onChange("standard", !props.standard)}
                   checked={props.standard ? props.standard : false}
            />
            <div className="field-label">Stocked only:</div>
            <input type="checkbox"
                   name="stocked"
                   onChange={() => props.onChange("stocked", !props.stocked)}
                   checked={props.stocked ? props.stocked : false}
            />
            <Button
                onClick={props.listParts}
                disabled={!props.hasSelectionCriteria}
            >
                Find Products
            </Button>
        </div>
    </Fragment>;
};

SupplierProductReviewListSelection.propTypes = {
    brands: PropTypes.any,
    suppliers: PropTypes.any,
    onChange: PropTypes.func,
    brandSelected: PropTypes.string,
    supplierSelected: PropTypes.string,
    onClick: PropTypes.func,
    partName: PropTypes.string,
    standard: PropTypes.bool,
    stocked: PropTypes.bool,
    hasSelectionCriteria: PropTypes.bool,
    listParts: PropTypes.func
};

export default SupplierProductReviewListSelection;