import React from "react";

import * as PropTypes from "prop-types";
import ViewModelField from "./ViewModelField";

const EditModelPageViewOnlyRow = (props) => {
    const { model, field, index, sections, brands, suppliers, componentKey } = props;
    if (model[field.fieldName]) {
        return <div
            className="grid-row"
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
                <ViewModelField
                    field={field}
                    model={model}
                    brands={brands}
                    sections={sections}
                    suppliers={suppliers}
                    key={`modelField${field.fieldName}${componentKey}`}
                />
            </div>
        </div>
    } else {
        return null;
    }
};


EditModelPageViewOnlyRow.propTypes = {
    model: PropTypes.object.isRequired,
    field: PropTypes.object.isRequired,
    componentKey: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    index: PropTypes.number.isRequired,
    className: PropTypes.string,
    sections: PropTypes.array,
    brands: PropTypes.array,
    suppliers: PropTypes.array,
};
export default EditModelPageViewOnlyRow;