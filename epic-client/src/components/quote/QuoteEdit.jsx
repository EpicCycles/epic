import React from "react";
import * as PropTypes from "prop-types";
import {updateObject} from "../../helpers/utils";
import {updateModel} from "../app/model/helpers/model";
import {quoteFields, quoteFieldsNoBike} from "./helpers/display";
import EditModelPage from "../app/model/EditModelPage";
import ModelEditIcons from "../app/model/ModelEditIcons";

class QuoteEdit extends React.Component {
    state = {};

    componentWillMount() {
        this.setState(this.deriveStateFromProps());
    };

    componentDidUpdate(prevProps) {
        if (this.props.quote !== prevProps.quote) this.deriveStateFromProps();
    }

    deriveStateFromProps = () => {
        return { quote: updateObject(this.props.quote) };
    };

    handleInputChange = (fieldName, input) => {
        const quote = updateModel(this.state.quote, quoteFields, fieldName, input);
        this.setState({ quote });
    };

    onClickReset = () => {
        this.setState(this.deriveStateFromProps());
    };

    render() {
        const { quote } = this.state;
        const fields = quote.bike ? quoteFields : quoteFieldsNoBike;
        const { componentKey, customers, bikes, frames, brands } = this.props;
        return <div className="fit-content">

            <EditModelPage
                model={quote}
                persistedModel={this.props.quote}
                modelFields={fields}
                onChange={this.handleInputChange}
                showReadOnlyFields={true}
                customers={customers}
                bikes={bikes}
                brands={brands}
                frames={frames}
            />
            <div className="align_right">
                <ModelEditIcons
                    componentKey={componentKey}
                    model={quote}
                    modelSave={this.props.saveQuote}
                    modelDelete={this.props.archiveQuote}
                    modelReset={this.onClickReset}
                />
            </div>
        </div>;
    }
}

QuoteEdit.defaultProps = {
    quote: {}
};
QuoteEdit.propTypes = {
    quote: PropTypes.object,
    createQuote: PropTypes.func,
    archiveQuote: PropTypes.func.isRequired,
    saveQuote: PropTypes.func.isRequired,
    componentKey: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
     bikes: PropTypes.array.isRequired,
     brands: PropTypes.array.isRequired,
    customers: PropTypes.array.isRequired,
    frames: PropTypes.array.isRequired,
};
export default QuoteEdit;

