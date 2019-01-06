import * as PropTypes from "prop-types";
import React, {Component, Fragment} from "react";
import {BRAND, CHECKBOX, CURRENCY, PART_TYPE, SUPPLIER} from "../helpers/models";
import {getBrandName} from "../helpers/brand_helper";
import {getPartTypeName} from "../helpers/framework";
import {getSupplierName} from "../helpers/supplier_helper";

class ViewModelField extends Component {

    render() {
        const { field, model, sections, brands, suppliers } = this.props;
        let viewData;
        const fieldValue = model[field.fieldName];
        switch (field.type) {
            case CURRENCY:
                viewData = Number(fieldValue).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
                break;
            case CHECKBOX:
                viewData = fieldValue ? "Y" : "N";
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
        return <Fragment>{viewData}</Fragment>;
    };

}

ViewModelField.propTypes = {
    field: PropTypes.any,
    model: PropTypes.any,
    sections: PropTypes.any,
    brands: PropTypes.any,
    suppliers: PropTypes.any,
};
export default ViewModelField;