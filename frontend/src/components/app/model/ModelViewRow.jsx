import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import ModelViewRowField from "./ModelViewRowField";
import {fieldAlignment, gridItemClass} from "./helpers/display";
import {getModelKey} from "./helpers/model";

const ModelViewRow = props => {
    const { model, modelFields, rowSpan, brands,customers, users, sections, suppliers, lockFirstColumn, className, bikes, frames } = props;
    const componentKey = getModelKey(model);
    return <Fragment>
        {modelFields.map((field, index) => {
            return <div
                className={gridItemClass(`${className} ${fieldAlignment(field)}`, index, lockFirstColumn)}
                key={`modelRow${field.fieldName}${componentKey}`}
                style={{ gridRow: ` span ${rowSpan}` }}
                data-test="model-field-cell"
            >
                <ModelViewRowField
                    field={field}
                    model={model}
                    brands={brands}
                    bikes={bikes}
                    frames={frames}
                    users={users}
                    sections={sections}
                    suppliers={suppliers}
                    customers={customers}
                    key={`modelField${field.fieldName}${componentKey}`}
                />
            </div>
        })}
    </Fragment>;
};

ModelViewRow.defaultProps = {
    model: {},
    className: '',
    sections: [],
    brands: [],
    suppliers: [],
    users: [],
    customers: [],
    bikes: [],
    frames: [],
    rowSpan: 1,
};

ModelViewRow.propTypes = {
    modelFields: PropTypes.array.isRequired,
    model: PropTypes.object,
    sections: PropTypes.array,
    className: PropTypes.string,
    brands: PropTypes.array,
    suppliers: PropTypes.array,
    customers: PropTypes.array,
    bikes: PropTypes.array,
    frames: PropTypes.array,
    users: PropTypes.array,
    lockFirstColumn: PropTypes.bool,
    rowSpan: PropTypes.number,
};
export default ModelViewRow;