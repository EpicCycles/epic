import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import {supplierProductFields} from "../../helpers/models";
import ViewModelField from "../../common/ViewModelField";


const SupplierProductViewRow = (props) => {
    const { supplierProduct, lockFirstColumn, suppliers } = props;
    const componentKey = supplierProduct.id ? supplierProduct.id : supplierProduct.dummyKey;
    return <Fragment>
        {supplierProductFields.map((field, index) => {
            return <div
                className={`grid-item ${((index === 0) && lockFirstColumn) && "grid-item--fixed-left"}`}
                key={`SupplierProductRow${field.fieldName}${componentKey}`}
                style={`grid-row: span ${rowSpan};`}
            >
                <ViewModelField
                    field={field}
                    model={supplierProduct}
                    suppliers={suppliers}
                />
            </div>
        })}
    </Fragment>
};
SupplierProductViewRow.propTypes = {
    supplierProduct: PropTypes.any,
    lockFirstColumn: PropTypes.bool,
    suppliers: PropTypes.any,
};

export default SupplierProductViewRow;
