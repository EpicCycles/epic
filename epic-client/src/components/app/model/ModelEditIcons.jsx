import React, {Fragment} from "react";
import * as PropTypes from "prop-types";

import {Icon} from "semantic-ui-react";
import {NEW_ELEMENT_ID} from "../../../helpers/constants";
import {isModelValid} from "./helpers/model";

const ModelEditIcons = props => {
    const {model, componentKey, modelSave, modelDelete, modelReset} = props;
    const isValid = isModelValid(model);
    return <Fragment>
        {(modelReset && model.changed) &&
        <Icon id={`reset-model`}
              name="undo"
              onClick={modelReset}
              title="Reset"
              key={`resetIcon${componentKey}`}
        />
        }
        {(modelSave && isValid && model.changed) &&
        <Icon id={`save-model`}
              name="check"
              onClick={() => modelSave(model)}
              title="Save changes"
              key={`saveIcon${componentKey}`}
        />
        }
        {(modelDelete && model.id) &&
        <Icon id={`delete-model`}
              name="delete"
              onClick={() => modelDelete(model.id)}
              title="Delete"
              key={`deleteIcon${componentKey}`}
        />
        }
    </Fragment>;
}

ModelEditIcons.defaultProps = {
    model: {},
    componentKey: NEW_ELEMENT_ID,
};
ModelEditIcons.propTypes = {
    modelSave: PropTypes.func,
    modelReset: PropTypes.func,
    modelDelete: PropTypes.func,
    model: PropTypes.object,
    componentKey: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
};

export default ModelEditIcons;