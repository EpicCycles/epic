import * as PropTypes from "prop-types";
import React, {Component, Fragment} from "react";
import {BRAND, CHECKBOX, COUNTRY, CURRENCY, DATE_TIME, PART_TYPE, SUPPLIER} from "./helpers/fields";
import {getBrandName} from "../../brand/helpers/brand_helper";
import {getPartTypeName} from "../../framework/helpers/framework";
import {getSupplierName} from "../../supplier/helpers/supplier";
import {getCountryName} from "../../address/helpers/address";

class ViewModelField extends Component {

    render() {
        const { field, model, sections, brands, suppliers } = this.props;
        let viewData;
        const fieldValue = model ? model[field.fieldName]  : undefined;
        switch (field.type) {
            case COUNTRY:
                viewData = getCountryName(fieldValue);
                break;
            case CURRENCY:
                viewData = fieldValue ? Number(fieldValue).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' }) : "";
                break;
            case CHECKBOX:
                viewData = fieldValue ? "Y" : "N";
                break;
            case DATE_TIME:
                viewData = fieldValue ? new Date(fieldValue).toLocaleString('en-GB', { timeZone: 'UTC' }) : "";
                break;
            case PART_TYPE:
                viewData = getPartTypeName(fieldValue, sections);
                break;
            case BRAND:
                viewData = getBrandName(fieldValue, brands);
                break;
            case SUPPLIER:
                viewData = getSupplierName(fieldValue, suppliers);
                break;
            default:
                viewData = fieldValue
        }
        return <Fragment>{Array.isArray(viewData) ? viewData.join() : viewData}</Fragment>;
    };

}

ViewModelField.propTypes = {
    field: PropTypes.any.isRequired,
    model: PropTypes.any,
    sections: PropTypes.array,
    brands: PropTypes.array,
    suppliers: PropTypes.array,
};
export default ViewModelField;