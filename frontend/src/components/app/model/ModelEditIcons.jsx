import React, { Fragment } from 'react';
import * as PropTypes from 'prop-types';

import { Icon } from 'semantic-ui-react';
import { NEW_ELEMENT_ID } from '../../../helpers/constants';
import { isModelValid } from './helpers/model';

const ModelEditIcons = props => {
  const { model, componentKey, modelSave, modelDelete, modelReset } = props;
  const isValid = isModelValid(model);
  const canReset = model.changed || model.deleted;
  const canDelete = model.id && !model.deleted;
  const canSave = isValid && model.changed;
  return (
    <Fragment>
      {modelReset && (
        <Icon
          id={`reset-model`}
          name="undo"
          disabled={!canReset}
          onClick={() => canReset && modelReset()}
          title="Reset"
          key={`resetIcon${componentKey}`}
        />
      )}
      {modelSave && (
        <Icon
          id={`save-model`}
          name="check"
          disabled={!canSave}
          onClick={() => canSave && modelSave(model)}
          title="Save changes"
          key={`saveIcon${componentKey}`}
        />
      )}
      {modelDelete && (
        <Icon
          id={`delete-model`}
          name="delete"
          disabled={!canDelete}
          onClick={() => canDelete && modelDelete(componentKey)}
          title="Delete"
          key={`deleteIcon${componentKey}`}
        />
      )}
    </Fragment>
  );
};

ModelEditIcons.defaultProps = {
  model: {},
  componentKey: NEW_ELEMENT_ID,
};
ModelEditIcons.propTypes = {
  modelSave: PropTypes.func,
  modelReset: PropTypes.func,
  modelDelete: PropTypes.func,
  model: PropTypes.object,
  componentKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ModelEditIcons;
