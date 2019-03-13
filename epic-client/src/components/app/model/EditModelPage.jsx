import React from "react";

import * as PropTypes from "prop-types";
import {eliminateReadOnlyFields, getModelKey, justReadOnlyFields} from "./helpers/model";
import EditModelPageRow from "./EditModelPageRow";
import EditModelPageViewOnlyRow from "./EditModelPageViewOnlyRow";

const EditModelPage = (props) => {
    const { model, modelFields, persistedModel, className = "", sections, brands, suppliers, onChange, showReadOnlyFields } = props;
    const componentKey = getModelKey(model);
    return <div className="grid-container">
        {model.error && <div className="red">{model.error}</div>}

        <div key="modelFields" className={`grid ${className}`}>

            {eliminateReadOnlyFields(modelFields).map((field, index) => <EditModelPageRow
                key={`EditModelPageRow${field.fieldName}`}
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
            {showReadOnlyFields && justReadOnlyFields(modelFields).map((field, index) => <EditModelPageViewOnlyRow
                key={`EditModelPageRow${field.fieldName}`}
                field={field}
                model={model}
                componentKey={componentKey}
                index={index}
                sections={sections}
                brands={brands}
                suppliers={suppliers}
            />)}
        </div>
    </div>
};

EditModelPage.defaultProps = {
    model: {},
};

EditModelPage.propTypes = {
    model: PropTypes.object,
    modelFields: PropTypes.array.isRequired,
    persistedModel: PropTypes.object,
    className: PropTypes.string,
    sections: PropTypes.array,
    brands: PropTypes.array,
    suppliers: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    showReadOnlyFields: PropTypes.bool,
};
export default EditModelPage;