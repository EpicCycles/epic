import React from "react";

import * as PropTypes from "prop-types";
import {getModelKey} from "./helpers/model";
import ViewModelFieldRow from "./ViewModelFieldRow";

const ViewModelBlock = (props) => {
    const { model, modelFields, className = "", sections, bikes, frames, brands, suppliers, customers, users } = props;
    const componentKey = getModelKey(model);
    return <div className="grid-container">
         <div key="modelFields" className={`grid ${className}`}>
            {modelFields.map((field, index) => <ViewModelFieldRow
                key={`ViewModelFieldRow${field.fieldName}`}
                field={field}
                model={model}
                componentKey={componentKey}
                index={index}
                sections={sections}
                brands={brands}
                bikes={bikes}
                frames={frames}
                customers={customers}
                suppliers={suppliers}
                users={users}
            />)}
        </div>
    </div>
};

ViewModelBlock.defaultProps = {
    model: {},
    sections: [],
    brands: [],
    bikes: [],
    frames: [],
    suppliers: [],
    customers: [],
    users:[],
};

ViewModelBlock.propTypes = {
    model: PropTypes.object,
    modelFields: PropTypes.array.isRequired,
    className: PropTypes.string,
    sections: PropTypes.array,
    brands: PropTypes.array,
    bikes: PropTypes.array,
    frames: PropTypes.array,
    suppliers: PropTypes.array,
    customers: PropTypes.array,
    users: PropTypes.array,
};
export default ViewModelBlock;