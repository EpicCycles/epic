import React from "react";
import {Icon} from "semantic-ui-react";
import * as PropTypes from "prop-types";

class ShowOrHide extends React.Component {
    toggleDetail = () => {
        if (this.props.isShown) {
            this.props.hideDetail(this.props.detailKey);
        } else {
            this.props.showDetail(this.props.detailKey);
        }
    };

    render() {
        const { componentKey, isShown } = this.props;
        return <Icon
            key={componentKey}
            id={componentKey}
            name={`toggle ${isShown ? "right" : "down"}`}
            onClick={this.toggleDetail}
        />;
    }
}
ShowOrHide.propTypes = {
    componentKey: PropTypes.any.isRequired,
    isShown: PropTypes.bool,
    hideDetail: PropTypes.func.isRequired,
    showDetail: PropTypes.func.isRequired,
};
export default ShowOrHide;