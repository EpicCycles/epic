import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import ViewModelField from "./ViewModelField";
import {gridItemClass} from "./helpers/display";
import {getComponentKey} from "./helpers/model";

const ModelViewRow = props => {
    const { model, modelFields, rowSpan, brands, sections, suppliers, lockFirstColumn, className } = props;
    const componentKey = getComponentKey(model);
    return <Fragment>
        {modelFields.map((field, index) => {
            return <div
                className={gridItemClass(className, index, lockFirstColumn)}
                key={`modelRow${field.fieldName}${componentKey}`}
                style={{ gridRow: ` span ${rowSpan}` }}
                data-test="model-field-cell"
            >
                <ViewModelField
                    field={field}
                    model={model}
                    brands={brands}
                    sections={sections}
                    suppliers={suppliers}
                    key={`modelField${field.fieldName}${componentKey}`}
                />
            </div>
        })}
    </Fragment>;
};

ModelViewRow.defaultProps = {
    className: '',
    sections: [],
    brands: [],
    suppliers: [],
    rowSpan: 1,
};

ModelViewRow.propTypes = {
    modelFields: PropTypes.array.isRequired,
    model: PropTypes.object.isRequired,
    sections: PropTypes.array,
    className: PropTypes.string,
    brands: PropTypes.array,
    suppliers: PropTypes.array,
    lockFirstColumn: PropTypes.bool,
    rowSpan: PropTypes.number,
};
export default ModelViewRow;