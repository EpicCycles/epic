import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import {eliminateReadOnlyFields, getComponentKey} from "./helpers/model";
import EditModelInput from "./EditModelInput";


const EditModelRow = (props) => {
    const { model, modelFields, persistedModel, className, onChange, lockFirstColumn, brands, sections, suppliers, childModels } = props;
    const rowSpan = childModels ? childModels.length : 1;
    const componentKey = getComponentKey(model);
    return <Fragment>
        {eliminateReadOnlyFields(modelFields).map((field, index) => {
            let divClass = "grid-item";
            if (lockFirstColumn) divClass += " grid-item--fixed-left";
            if (className) divClass += className;
            return <div
                className={divClass}
                key={`modelRow${field.fieldName}${componentKey}`}
                style={{ gridRow: `span ${rowSpan}` }}
            >
                <EditModelInput
                    field={field}
                    model={model}
                    persistedModel={persistedModel}
                    componentKey={componentKey}
                    index={index}
                    onChange={onChange}
                    brands={brands}
                    sections={sections}
                    suppliers={suppliers}
                />
            </div>
        })}
    </Fragment>
};
EditModelRow.propTypes = {
    model: PropTypes.object.isRequired,
    modelFields: PropTypes.array.isRequired,
    persistedModel: PropTypes.object,
    className: PropTypes.string,
    sections: PropTypes.array,
    brands: PropTypes.array,
    suppliers: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    childModels:PropTypes.array,
    lockFirstColumn: PropTypes.bool
};

export default EditModelRow;
