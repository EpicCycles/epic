import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import {getModelKey} from "../app/model/helpers/model";
import {partFieldsComplete} from "../app/model/helpers/fields";
import ModelViewRowField from "../app/model/ModelViewRowField";


const PartViewRow = (props) => {
    const { part, supplierProducts, lockFirstColumn, brands, sections } = props;
    const rowSpan = supplierProducts ? supplierProducts.length : 1;
    const componentKey = getModelKey(part);
    return <Fragment>
        {partFieldsComplete.map((field, index) => {
            const fixed = ((index === 0) && lockFirstColumn) ? "grid-item--fixed-left" : "";

            return <div
                className={`grid-item ${fixed}`}
                key={`partRow${field.fieldName}${componentKey}`}
                style={{ gridRow: ` span ${rowSpan}` }}
            >
                <ModelViewRowField
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
    part: PropTypes.object.isRequired,
    supplierProducts: PropTypes.array,
    lockFirstColumn: PropTypes.bool,
    sections: PropTypes.any,
    brands: PropTypes.any,
};

export default PartViewRow;
