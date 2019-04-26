import React from "react";

import * as PropTypes from "prop-types";
import {eliminateReadOnlyFields, getModelKey, justReadOnlyFields} from "./helpers/model";
import EditModelPageRow from "./EditModelPageRow";
import ViewModelFieldRow from "./ViewModelFieldRow";
import NonFieldErrors from "./NonFieldErrors";
import {isItAnObject} from "../../../helpers/utils";

const EditModelPage = (props) => {
    const { model, modelFields, persistedModel, users, className = "", sections, brands, suppliers, bikes, frames, customers, onChange, showReadOnlyFields } = props;
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
                data-test='field-to-edit'
            />)}
            {showReadOnlyFields && justReadOnlyFields(modelFields).map((field, index) => <ViewModelFieldRow
                key={`EditModelPageRow${field.fieldName}`}
                field={field}
                model={persistedModel}
                componentKey={componentKey}
                index={index}
                sections={sections}
                brands={brands}
                bikes={bikes}
                frames={frames}
                customers={customers}
                suppliers={suppliers}
                users={users}
                data-test='field-to-view'
            />)}
            {isItAnObject(model.error_detail) && <NonFieldErrors
                componentKey={componentKey}
                error_detail={model.error_detail}
                data-test='show-error-detail'
            />
            }
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
    bikes: PropTypes.array,
    frames: PropTypes.array,
    suppliers: PropTypes.array,
    customers: PropTypes.array,
    users: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    showReadOnlyFields: PropTypes.bool,
};
export default EditModelPage;