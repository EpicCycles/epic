import React from "react";

import * as PropTypes from "prop-types";
import {eliminateReadOnlyFields, getComponentKey} from "./helpers/model";
import EditModelPageRow from "./EditModelPageRow";

const EditModelPage = (props) => {
    const { model, modelFields, persistedModel, className = "", sections, brands, suppliers, onChange } = props;
    const componentKey = getComponentKey(model);
    return <div className="grid-container">
        {model.error && <div className="red">{model.error}</div>}

        <div key="modelFields" className={`grid ${className}`}>

            {eliminateReadOnlyFields(modelFields).map((field, index) => <EditModelPageRow
                key={`EditModelPageRow${index}`}
                field={field}
                model={model}
                persistedModel={persistedModel}
                componentKey={componentKey}
                index={index}
                onChange={onChange}
                sections={sections}
                brands={brands}
                suppliers={suppliers}
            />)}
        </div>
    </div>
};


EditModelPage.propTypes = {
    model: PropTypes.object.isRequired,
    modelFields: PropTypes.array.isRequired,
    persistedModel: PropTypes.object,
    className: PropTypes.string,
    sections: PropTypes.array,
    brands: PropTypes.array,
    suppliers: PropTypes.array,
    onChange: PropTypes.func.isRequired
};
export default EditModelPage;