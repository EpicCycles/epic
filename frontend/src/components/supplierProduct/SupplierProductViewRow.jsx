import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import {getModelKey} from "../app/model/helpers/model";
import {supplierProductFields} from "../app/model/helpers/fields";
import ModelViewRowField from "../app/model/ModelViewRowField";


const SupplierProductViewRow = (props) => {
    const { supplierProduct, lockFirstColumn, suppliers } = props;
    const componentKey = getModelKey(supplierProduct);
    return <Fragment>
        {supplierProductFields.map((field, index) => {
            const fixed = ((index === 0) && lockFirstColumn) ? "grid-item--fixed-left" : "";
            return <div
                className={`grid-item ${fixed}`}
                key={`SupplierProductRow${field.fieldName}${componentKey}`}
            >
                <ModelViewRowField
                    field={field}
                    model={supplierProduct}
                    suppliers={suppliers}
                />
            </div>
        })}
    </Fragment>
};
SupplierProductViewRow.defaultProps = {
    supplierProduct: {},
    lockFirstColumn: false,
};
SupplierProductViewRow.propTypes = {
    supplierProduct: PropTypes.object,
    lockFirstColumn: PropTypes.bool,
    suppliers: PropTypes.array.isRequired,
};

export default SupplierProductViewRow;
