import React from "react";

import * as PropTypes from "prop-types";
import {getModelKey} from "./helpers/model";
import ViewModelFieldRow from "./ViewModelFieldRow";

const ViewModelBlock = (props) => {
    const { model, modelFields, className = "", sections, bikes, brands, suppliers, customers } = props;
    const componentKey = getModelKey(model);
    return <div className="grid-container">
        {model.error && <div className="red">{model.error}</div>}

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
            />)}
        </div>
    </div>
};

ViewModelBlock.defaultProps = {
    model: {},
};

ViewModelBlock.propTypes = {
    model: PropTypes.object,
    modelFields: PropTypes.array.isRequired,
    persistedModel: PropTypes.object,
    className: PropTypes.string,
    sections: PropTypes.array,
    brands: PropTypes.array,
    bikes: PropTypes.array,
    frames: PropTypes.array,
    suppliers: PropTypes.array,
    customers: PropTypes.array,
};
export default ViewModelBlock;