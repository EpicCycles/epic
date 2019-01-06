import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import {partFields} from "../../helpers/models";
import ViewModelField from "../../common/ViewModelField";


const PartViewRow = (props) => {
    const { part, supplierProducts, lockFirstColumn, brands, sections } = props;
    const rowSpan = supplierProducts ? supplierProducts.length : 1;
    const componentKey = part.id ? part.id : part.dummyKey;
    return <Fragment>
        {partFields.map((field, index) => {
            return <div
                className={`grid-item ${((index === 0) && lockFirstColumn) && "grid-item--fixed-left"}`}
                key={`partRow${field.fieldName}${componentKey}`}
                style={{ gridRow: ` span ${rowSpan}` }}
            >
                <ViewModelField
                    field={field}
                    model={part}
                    brands={brands}
                    sections={sections}
                />
            </div>
        })}
    </Fragment>
};
PartViewRow.propTypes = {
    part: PropTypes.any,
    supplierProducts: PropTypes.array,
    lockFirstColumn: PropTypes.bool,
    sections: PropTypes.any,
    brands: PropTypes.any,
};

export default PartViewRow;
