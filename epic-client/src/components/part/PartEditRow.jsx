import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import EditModelInput from "../../common/EditModelInput";
import {partFields} from "../../helpers/models";


const PartEditRow = (props) => {
    const { part, persistedPart, onChange, supplierParts, lockFirstColumn, brands, sections } = props;
    const rowSpan = supplierParts ? supplierParts.length : 1;
    const componentKey = part.id ? part.id : part.dummyKey;
    return <Fragment>
        {partFields.map((field, index) => {
            return <div
                className={`grid-item ${((index === 0) && lockFirstColumn) && "grid-item--fixed-left"}`}
                key={`partRow${field.fieldName}${componentKey}`}
                style={`grid-row: span ${rowSpan};`}
            >
                <EditModelInput
                    field={field}
                    model={part}
                    persistedModel={persistedPart}
                    className={className}
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
    supplierParts: PropTypes.array,
    lockFirstColumn: PropTypes.bool,
    sections: PropTypes.any,
    brands: PropTypes.any,
};

export default PartEditRow;
