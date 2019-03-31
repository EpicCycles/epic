import * as PropTypes from "prop-types";
import React, {Component} from "react";
import {CUSTOMER, BRAND, CHECKBOX, COUNTRY, CURRENCY, DATE_TIME, PART_TYPE, SUPPLIER, BIKE} from "./helpers/fields";
import {getBrandName} from "../../brand/helpers/brand";
import {getPartTypeName} from "../../framework/helpers/framework";
import {getSupplierName} from "../../supplier/helpers/supplier";
import {getCountryName} from "../../address/helpers/address";
import {formattedDate} from "./helpers/display";
import {getCustomerName} from "../../customer/helpers/customer";
import {getBikeName} from "../../bike/helpers/bike";

class ViewModelField extends Component {

    render() {
        const { field, model, sections, brands, suppliers, customers, bikes, frames } = this.props;
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
                viewData = fieldValue ? formattedDate(new Date(fieldValue)) : "";
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
            case CUSTOMER:
                viewData = fieldValue ? getCustomerName(fieldValue, customers) : '';
                break;
            case BIKE:
                viewData = fieldValue ? getBikeName(fieldValue, bikes, frames, brands) : '';
            default:
                viewData = fieldValue
        }
        return <nobr>{Array.isArray(viewData) ? viewData.join() : viewData}</nobr>;
    };

}

ViewModelField.propTypes = {
    field: PropTypes.any.isRequired,
    model: PropTypes.any,
    sections: PropTypes.array,
    brands: PropTypes.array,
    bikes: PropTypes.array,
    frames: PropTypes.array,
    suppliers: PropTypes.array,
    customers: PropTypes.array,
};
export default ViewModelField;