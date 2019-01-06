import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import EditModelInput from "../../common/EditModelInput";
import {partFields} from "../../helpers/models";


const PartEditRow = (props) => {
    const { part, persistedPart, onChange, supplierProducts, lockFirstColumn, brands, sections } = props;
    const rowSpan = supplierProducts ? supplierProducts.length : 1;
    const componentKey = part.id ? part.id : part.dummyKey;
    return <Fragment>
        {partFields.map((field, index) => {
            let divClass = "grid-item";
            if (lockFirstColumn) divClass += " grid-item--fixed-left";
            return <div
                className={divClass}
                key={`partRow${field.fieldName}${componentKey}`}
                style={{ gridRow: `span ${rowSpan};` }}
            >
                <EditModelInput
                    field={field}
                    model={part}
                    persistedModel={persistedPart}
                    componentKey={componentKey}
                    index={index}
                    onChange={onChange}
                    brands={brands}
                    sections={sections}
                />
            </div>
        })}
    </Fragment>
};
PartEditRow.propTypes = {
    part: PropTypes.any,
    persistedPart: PropTypes.any,
    onChange: PropTypes.func,
    supplierProducts: PropTypes.array,
    lockFirstColumn: PropTypes.bool,
    sections: PropTypes.any,
    brands: PropTypes.any,
};

export default PartEditRow;
