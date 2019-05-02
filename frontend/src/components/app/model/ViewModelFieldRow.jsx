import React from "react";

import * as PropTypes from "prop-types";
import ModelViewRowField from "./ModelViewRowField";

const ViewModelFieldRow = (props) => {
    const { model, field, index, sections, brands, suppliers, bikes, frames, customers, users, componentKey } = props;
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
                <ModelViewRowField
                    field={field}
                    model={model}
                    brands={brands}
                    sections={sections}
                    suppliers={suppliers}
                    bikes={bikes}
                    frames={frames}
                    customers={customers}
                    users={users}
                    key={`modelField${field.fieldName}${componentKey}`}
                />
            </div>
        </div>
    } else {
        return null;
    }
};


ViewModelFieldRow.propTypes = {
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
    bikes: PropTypes.array,
    frames: PropTypes.array,
    suppliers: PropTypes.array,
    customers: PropTypes.array,
    users: PropTypes.array,
};
export default ViewModelFieldRow;