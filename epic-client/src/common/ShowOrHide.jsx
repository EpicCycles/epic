import React from "react";
import {Icon} from "semantic-ui-react";

class ShowOrHide extends React.Component {
    toggleDetail = () => {
        console.log("in show hide for key", this.props.detailKey)
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
            name={`toggle ${isShown ? "right" : "down"}`}
            onClick={this.toggleDetail}
        />;
    }
}

export default ShowOrHide;