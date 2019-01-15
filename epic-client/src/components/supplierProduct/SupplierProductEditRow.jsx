import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import EditModelInput from "../app/model/EditModelInput";
import {getComponentKey, supplierProductFields} from "../../helpers/models";


const SupplierProductEditRow = (props) => {
    const { supplierProduct, persistedSupplierProduct, onChange, lockFirstColumn, suppliers } = props;
    const componentKey = getComponentKey(supplierProduct);
    return <Fragment>
        {supplierProductFields.map((field, index) => {
            return <div
                className={`grid-item ${((index === 0) && lockFirstColumn) && "grid-item--fixed-left"}`}
                key={`supplierProductRow${field.fieldName}${componentKey}`}
            >
                <EditModelInput
                    field={field}
                    model={supplierProduct}
                    persistedModel={persistedSupplierProduct}
                    componentKey={componentKey}
                    index={index}
                    onChange={onChange}
                    suppliers={suppliers}
                />
            </div>
        })}
    </Fragment>
};
SupplierProductEditRow.propTypes = {
    supplierProduct: PropTypes.any,
    persistedSupplierProduct: PropTypes.any,
    onChange: PropTypes.func,
    lockFirstColumn: PropTypes.bool,
    suppliers: PropTypes.any,
};

export default SupplierProductEditRow;
