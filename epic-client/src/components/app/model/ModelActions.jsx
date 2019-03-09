import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import {Icon} from "semantic-ui-react";

const ModelActions = props => <Fragment>
    {props.actions.map(action => <Icon
        name={action.iconName}
        title={action.iconTitle}
        onClick={() => (!props.actionsDisabled) && action.iconAction(props.componentKey)}
        key={`${action.iconName}-${props.componentKey}`}
        data-test="model-action"
    />)}
</Fragment>;

ModelActions.defaultProps = {
    className: '',
};

ModelActions.propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
        iconName: PropTypes.string.isRequired,
        iconTitle: PropTypes.string.isRequired,
        iconAction: PropTypes.func.isRequired,
    })).isRequired,
    componentKey: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    className: PropTypes.string,
    actionsDisabled: PropTypes.bool,
};
export default ModelActions;