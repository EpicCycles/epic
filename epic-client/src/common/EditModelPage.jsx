import React, { Fragment } from "react";

import * as PropTypes from "prop-types";
import {getComponentKey} from "../helpers/models";
import EditModelInput from "./EditModelInput";

const EditModelPage = (props) => {
    const { model, modelFields, persistedModel, className = "", sections, brands, suppliers, onChange } = props;
    const componentKey = getComponentKey(model);
    return <Fragment>
        {model.error && <div className="red">{model.error}</div>}
        <div key="modelFields" className={`grid ${className}`}>

            {modelFields.map((field, index) => <div
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
                </div>)}
        </div>
    </Fragment>
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