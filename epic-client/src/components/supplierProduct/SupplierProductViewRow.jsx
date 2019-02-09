import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import {getComponentKey} from "../app/model/helpers/model";
import {supplierProductFields} from "../app/model/helpers/fields";
import ViewModelField from "../app/model/ViewModelField";


const SupplierProductViewRow = (props) => {
    const { supplierProduct, lockFirstColumn, suppliers } = props;
    const componentKey = getComponentKey(supplierProduct);
    return <Fragment>
        {supplierProductFields.map((field, index) => {
            const fixed = ((index === 0) && lockFirstColumn) ? "grid-item--fixed-left" : "";
            return <div
                className={`grid-item ${fixed}`}
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
    supplierProduct: PropTypes.object.isRequired,
    lockFirstColumn: PropTypes.bool,
    suppliers: PropTypes.array.isRequired,
};

export default SupplierProductViewRow;
