import React from "react";

import * as PropTypes from "prop-types";
import EditModelInput from "./EditModelInput";

const EditModelPageRow = (props) => {
    const { model, field, index, persistedModel, sections, brands, suppliers, onChange, componentKey } = props;
    return <div
        className={`grid-row${index}`}
        key={`field-row${index}`}
    >
        <div
            className="grid-item--borderless field-label align_right"
            key={`modelField${index}`}
        >
            {field.header}
        </div>
        <div
            key={`fieldDiv${index}`}
            className="grid-item--borderless field-label "
        >
            <EditModelInput
                field={field}
                model={model}
                persistedModel={persistedModel}
                componentKey={componentKey}
                index={index}
                onChange={onChange}
                sections={sections}
                brands={brands}
                suppliers={suppliers}
            />
        </div>
    </div>
};


EditModelPageRow.propTypes = {
    model: PropTypes.object.isRequired,
    field: PropTypes.object.isRequired,
    componentKey: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    index: PropTypes.number.isRequired,
    persistedModel: PropTypes.object,
    className: PropTypes.string,
    sections: PropTypes.array,
    brands: PropTypes.array,
    suppliers: PropTypes.array,
    onChange: PropTypes.func.isRequired
};
export default EditModelPageRow;