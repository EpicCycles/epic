import React, {Fragment} from "react";
import {Icon} from "semantic-ui-react";

const FrameworkMoves = props => (
    <Fragment>
        <Icon
            name="angle double up"
            id={"moveToTop_" + props.componentKey}
            size="small"
            circular
            link
            onClick={event => props.moveToTop(event.target.id)}
        />
        <Icon
            name="angle up"
            id={"moveUp_" + props.componentKey}
            size="small"
            circular
            link
            onClick={event => props.moveUp(event.target.id)}
        />
        <Icon
            name="angle down"
            id={"moveDown_" + props.componentKey}
            size="small"
            circular
            link
            onClick={event => props.moveDown(event.target.id)}
        />
        <Icon
            name="angle double down"
            id={"moveDown_" + props.componentKey}
            size="small"
            circular
            link
            onClick={event => props.moveToBottom(event.target.id)}
        />
    </Fragment>
);

export default FrameworkMoves;