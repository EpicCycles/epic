import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import {getComponentKey, supplierProductFields} from "../../helpers/models";
import ViewModelField from "../../common/ViewModelField";


const SupplierProductViewRow = (props) => {
    const { supplierProduct, lockFirstColumn, suppliers } = props;
    const componentKey = getComponentKey(supplierProduct);
    return <Fragment>
        {supplierProductFields.map((field, index) => {
            return <div
                className={`grid-item ${((index === 0) && lockFirstColumn) && "grid-item--fixed-left"}`}
                key={`SupplierProductRow${field.fieldName}${componentKey}`}
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
