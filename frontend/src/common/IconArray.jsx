import React, { Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

const IconArray = props => {
  const { actionArray, actionsDisabled, componentKey } = props;
  return (
    <Fragment>
      {actionArray.map(action => (
        <Icon
          name={action.iconName}
          title={action.iconTitle}
          onClick={() =>
            !(actionsDisabled || action.iconDisabled) && action.iconAction(componentKey)
          }
          key={`${action.iconName}-${componentKey}`}
          data-test="model-action"
          disabled={actionsDisabled || action.iconDisabled}
        />
      ))}
    </Fragment>
  );
};
IconArray.defaultProps = {
  actionArray: [],
};
IconArray.propTypes = {
  actionArray: PropTypes.array,
  actionsDisabled: PropTypes.bool,
  componentKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
export default IconArray;
